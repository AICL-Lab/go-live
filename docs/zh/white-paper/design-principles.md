# 设计原则

Go-Live 的架构由三个核心原则指导，这些原则塑造了每一个设计决策。它们源于 WebRTC SFU 设计空间，优先考虑运维简洁性而非功能完整性。

## 1. 简洁性优先

单发布者房间消除了大规模 SFU 实现中占主导地位的流选择算法（SVC 适配、Simulcast 层选择）的复杂性 [1]。通过将每个房间限制为一个发布者，Go-Live 避免了：

- **Simulcast 层选择**：无需带宽估计算法或时间/空间层切换
- **流优先级仲裁**：多个发布者竞争时无需仲裁逻辑
- **编解码器协商复杂性**：单发布者意味着每个房间单一编解码管线

这是一个刻意的权衡。Go-Live 面向直播活动、网络研讨会和监控等一对多模型自然适用的场景。对于多方会议，Janus 或 mediasoup 等项目提供了更合适的抽象。

## 2. 零转码转发

通过在 RTP 包层面操作，Go-Live 避免了编解码循环的计算开销。SFU 从发布者的轨道读取 RTP 包，直接写入订阅者轨道，不做任何媒体处理 [2]。

**这带来的优势：**
- 可预测的 CPU 使用（随订阅者数量扩展，而非媒体复杂度）
- 无编解码器许可问题（H.264/VP8/VP9 直通）
- 亚帧延迟（无编码管线延迟）

**为此牺牲的能力：**
- 无服务端混流或合成
- 无针对订阅者条件的码率自适应
- 无需要重编码格式的服务端录制（如 MP4）

录制系统通过将原始 RTP 载荷捕获到支持它们的容器格式来绕过此限制：VP8/VP9 存入 IVF，Opus 存入 OGG。

## 3. 默认可观测

每个重要操作都发出指标和追踪，无需代码变更即可进行生产调试。可观测性栈包括：

- **Prometheus 指标**：房间数、订阅者数、每轨道 RTP 字节/包数、限流拒绝数
- **OpenTelemetry 追踪**：HTTP 处理器、SFU 管理器和房间操作的请求级追踪
- **健康端点**：`/healthz` 用于存活检测，`/metrics` 用于 Prometheus 抓取

这一原则确保当生产问题发生时，第一个问题是"仪表盘显示什么？"而非"我们能在本地复现吗？"

## 并发模型

Go-Live 的并发设计遵循 Go 惯用模式：

| 关注点 | 机制 |
|--------|------|
| 房间状态 | 每个房间 `sync.RWMutex` |
| 轨道扇出 | 每个订阅者独立 goroutine，断开时退出 |
| 优雅关闭 | Context 取消传播到所有 goroutine |
| 限流 | 每 IP 令牌桶，goroutine 安全 |

每个订阅者获得独立的 `readLoop` goroutine，从发布者轨道读取并写入订阅者本地轨道。该 goroutine 在以下情况退出：
- 订阅者断开（ICE 状态变更）
- 发布者断开
- 房间关闭

完整架构决策记录见 [ADR-0001: 核心架构](/zh/decisions/0001-core-architecture)。

## 参考文献

1. RFC 7667 - "RTP Topologies" (IETF, 2015) — 定义 SFU、MCU 和其他 RTP 拓扑
2. RFC 8853 - "Using Simulcast in SDP and RTP Sessions" (IETF, 2021) — Go-Live 单发布者模型避免的 Simulcast 协商
3. I-D.ietf-wish-whip - "WebRTC-HTTP Ingestion Protocol (WHIP)" — Go-Live 实现的摄取协议
4. I-D.ietf-wish-whep - "WebRTC-HTTP Egress Protocol (WHEP)" — Go-Live 实现的输出协议
5. RFC 3550 - "RTP: A Transport Protocol for Real-Time Applications" (IETF, 2003) — 底层传输协议
