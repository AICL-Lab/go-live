# Performance Benchmarks

Go-Live's performance characteristics are validated through automated test suites covering HTTP API latency, concurrent throughput, memory stability, and rate limiting behavior.

## Methodology

All benchmarks run against the in-memory SFU without real WebRTC connections. This isolates HTTP handler and room management performance from network and media processing costs. Tests use Go's `testing.B` for microbenchmarks and custom load tests for concurrency validation.

**Test environment:**
- Go runtime with `-race` detector disabled for benchmarks
- In-memory room manager (no disk I/O)
- `httptest.NewRecorder()` for request/response capture

## HTTP API Performance

| Metric | Value | Test Condition |
|--------|-------|----------------|
| Room listing response time | < 10ms average | 100 sequential requests |
| Concurrent throughput | 1000 requests / 50 workers | All requests succeed |
| Room creation | Benchmark-optimized | `go test -bench=BenchmarkRoomCreation` |
| Room listing (100 rooms) | Benchmark-optimized | `go test -bench=BenchmarkRoomListing` |

The `TestPerformanceHighConcurrency` test spawns 50 goroutines processing 1000 total requests. All requests must return HTTP 200 — zero failures are tolerated.

## Memory Characteristics

**Stale room cleanup**: After 100 failed publish attempts (invalid SDP), the room manager contains zero stale rooms. Failed publishes do not leak room state.

```go
// From test/performance/performance_test.go
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

## Rate Limiting Behavior

The rate limiter uses a token bucket algorithm per client IP. With `RATE_LIMIT_RPS=10` and `RATE_LIMIT_BURST=5`:

- Initial burst of 5 requests passes
- Subsequent requests within the burst window are rate-limited (HTTP 429)
- The bucket refills at the configured RPS rate

The test verifies that rate limiting is partial — neither all requests pass nor all are rejected:

```go
// Expected: some requests pass (burst), some are rate-limited
if rateLimited == 0 || rateLimited == 50 {
    t.Fatalf("expected partial rate limiting, got %d", rateLimited)
}
```

## Load Testing

A standalone load testing tool (`test/load/main.go`) provides configurable concurrency and duration:

```bash
go run ./test/load/main.go -url http://localhost:8080 -concurrent=50 -duration=30s
```

**Endpoints tested:**
- `/healthz` — Health check
- `/api/rooms` — Room listing
- `/api/records` — Recording listing
- `/metrics` — Prometheus metrics

**Output includes:**
- Total/successful/failed/rate-limited request counts
- Min/max/average response times
- Requests per second

## Microbenchmarks

Run Go benchmarks for specific operations:

```bash
# All performance tests
go test -tags=performance -v ./test/performance/

# Specific benchmarks
go test -tags=performance -bench=BenchmarkRoomCreation -benchmem ./test/performance/
go test -tags=performance -bench=BenchmarkRoomListing -benchmem ./test/performance/
go test -tags=performance -bench=BenchmarkConcurrentRequests -benchmem ./test/performance/
```

## Reproducing

```bash
# Performance tests (includes benchmarks and concurrency tests)
make test-performance

# Load test (requires running server)
go run ./test/load/main.go -url http://localhost:8080 -concurrent=100 -duration=60s

# Memory profiling
go tool pprof http://localhost:8080/debug/pprof/heap

# CPU profiling (30s sample)
go tool pprof http://localhost:8080/debug/pprof/profile?seconds=30
```
