# 性能基准

Go-Live 的性能特征通过自动化测试套件验证，覆盖 HTTP API 延迟、并发吞吐、内存稳定性和限流行为。

## 测试方法

所有基准测试针对内存 SFU 运行，不建立真实 WebRTC 连接。这将 HTTP 处理器和房间管理性能与网络及媒体处理开销隔离。测试使用 Go 的 `testing.B` 进行微基准测试，使用自定义负载测试验证并发性。

**测试环境：**
- Go 运行时，基准测试禁用 `-race` 检测器
- 内存房间管理器（无磁盘 I/O）
- `httptest.NewRecorder()` 捕获请求/响应

## HTTP API 性能

| 指标 | 值 | 测试条件 |
|------|-----|----------|
| 房间列表响应时间 | < 10ms 平均 | 100 次顺序请求 |
| 并发吞吐 | 1000 请求 / 50 工作线程 | 全部成功 |
| 房间创建 | 基准优化 | `go test -bench=BenchmarkRoomCreation` |
| 房间列表（100 个房间） | 基准优化 | `go test -bench=BenchmarkRoomListing` |

`TestPerformanceHighConcurrency` 测试启动 50 个 goroutine 处理共 1000 个请求。所有请求必须返回 HTTP 200 — 零失败容忍。

## 内存特性

**过期房间清理**：100 次失败的发布尝试（无效 SDP）后，房间管理器包含零个过期房间。失败发布不会泄漏房间状态。

```go
// 来自 test/performance/performance_test.go
for i := 0; i < 100; i++ {
    roomName := fmt.Sprintf("memory-test-room-%d", i)
    req := httptest.NewRequest("POST", "/api/whip/publish/"+roomName, bytes.NewReader([]byte("invalid-sdp")))
    w := httptest.NewRecorder()
    h.ServeWHIPPublish(w, req, roomName)
}
if got := len(mgr.ListRooms()); got != 0 {
    t.Fatalf("expected no stale rooms after failed publishes, got %d", got)
}
```

## 限流行为

限流器使用每客户端 IP 的令牌桶算法。配置 `RATE_LIMIT_RPS=10` 和 `RATE_LIMIT_BURST=5`：

- 初始突发 5 个请求通过
- 突发窗口内的后续请求被限流（HTTP 429）
- 令牌桶按配置的 RPS 速率补充

测试验证限流是部分性的 — 既非全部通过也非全部拒绝：

```go
// 预期：部分请求通过（突发），部分被限流
if rateLimited == 0 || rateLimited == 50 {
    t.Fatalf("expected partial rate limiting, got %d", rateLimited)
}
```

## 负载测试

独立负载测试工具（`test/load/main.go`）提供可配置的并发和持续时间：

```bash
go run ./test/load/main.go -url http://localhost:8080 -concurrent=50 -duration=30s
```

**测试端点：**
- `/healthz` — 健康检查
- `/api/rooms` — 房间列表
- `/api/records` — 录制列表
- `/metrics` — Prometheus 指标

**输出包含：**
- 总计/成功/失败/限流请求数
- 最小/最大/平均响应时间
- 每秒请求数

## 微基准测试

运行特定操作的 Go 基准测试：

```bash
# 所有性能测试
go test -tags=performance -v ./test/performance/

# 特定基准
go test -tags=performance -bench=BenchmarkRoomCreation -benchmem ./test/performance/
go test -tags=performance -bench=BenchmarkRoomListing -benchmem ./test/performance/
go test -tags=performance -bench=BenchmarkConcurrentRequests -benchmem ./test/performance/
```

## 复现方法

```bash
# 性能测试（包含基准和并发测试）
make test-performance

# 负载测试（需要运行中的服务器）
go run ./test/load/main.go -url http://localhost:8080 -concurrent=100 -duration=60s

# 内存分析
go tool pprof http://localhost:8080/debug/pprof/heap

# CPU 分析（30 秒采样）
go tool pprof http://localhost:8080/debug/pprof/profile?seconds=30
```
