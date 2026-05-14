# 参考文献

与 Go-Live 设计和实现相关的标准、论文和资源汇编。

## 标准与 RFC

| 编号 | 标题 | 相关性 |
|------|------|--------|
| [RFC 3550](https://datatracker.ietf.org/doc/html/rfc3550) | RTP: A Transport Protocol for Real-Time Applications | 媒体传输核心协议 |
| [RFC 7667](https://datatracker.ietf.org/doc/html/rfc7667) | RTP Topologies | 定义 SFU、MCU 和其他拓扑；Go-Live 实现 SFU 拓扑 |
| [RFC 8825](https://datatracker.ietf.org/doc/html/rfc8825) | Overview: Real-Time Protocols for Browser-Based Applications | WebRTC 协议概览 |
| [RFC 8826](https://datatracker.ietf.org/doc/html/rfc8826) | Security Considerations for WebRTC | WebRTC 安全模型 |
| [RFC 8853](https://datatracker.ietf.org/doc/html/rfc8853) | Using Simulcast in SDP and RTP Sessions | Simulcast 协商（Go-Live 单发布者模型避免了此复杂性） |
| [RFC 8829](https://datatracker.ietf.org/doc/html/rfc8829) | JSEP: JavaScript Session Establishment Protocol | WebRTC 中使用的 SDP offer/answer 模型 |
| [RFC 8838](https://datatracker.ietf.org/doc/html/rfc8838) | Trickle ICE | ICE 候选 trickling（Go-Live 的 WHIP/WHEP 交换未使用） |

## WebRTC 草案

| 编号 | 标题 | 状态 |
|------|------|------|
| [I-D.ietf-wish-whip](https://datatracker.ietf.org/doc/draft-ietf-wish-whip/) | WebRTC-HTTP Ingestion Protocol (WHIP) | Go-Live 已实现 |
| [I-D.ietf-wish-whep](https://datatracker.ietf.org/doc/draft-ietf-wish-whep/) | WebRTC-HTTP Egress Protocol (WHEP) | Go-Live 已实现 |

## WebRTC 实现

| 资源 | 描述 |
|------|------|
| [Pion WebRTC](https://github.com/pion/webrtc) | WebRTC 的 Go 实现 — Go-Live 的核心依赖 |
| [WebRTC for the Curious](https://webrtcforthecurious.com/) | 解释 WebRTC 内部原理的开源书籍 |
| [WebRTC.org](https://webrtc.org/) | WebRTC 官方项目站点 |

## 媒体容器

| 资源 | 描述 |
|------|------|
| [IVF 容器格式](https://wiki.multimedia.cx/index.php/IVF) | VP8/VP9 录制使用的格式 |
| [OGG 容器格式](https://xiph.org/ogg/) | Opus 音频录制使用的格式 |
| [RFC 7587](https://datatracker.ietf.org/doc/html/rfc7587) | Opus 编解码器的 RTP 载荷格式 |

## 可观测性

| 资源 | 描述 |
|------|------|
| [OpenTelemetry 规范](https://opentelemetry.io/docs/) | Go-Live 使用的分布式追踪标准 |
| [Prometheus 最佳实践](https://prometheus.io/docs/practices/) | 指标命名和仪表化指南 |
| [Prometheus Go 客户端](https://github.com/prometheus/client_golang) | Prometheus 指标 Go 库 |

## Go 并发

| 资源 | 描述 |
|------|------|
| [Go 内存模型](https://go.dev/ref/mem) | 定义 goroutine 同步的 happens-before 关系 |
| [Effective Go: Concurrency](https://go.dev/doc/effective_go#concurrency) | Go 并发模式（goroutine、channel、mutex） |
| [sync.Mutex 文档](https://pkg.go.dev/sync#Mutex) | Go-Live 中用于房间状态保护 |

## 相关项目

| 项目 | 描述 |
|------|------|
| [Janus Gateway](https://github.com/meetecho/janus-gateway) | 基于 C 的插件架构 WebRTC 服务器 |
| [mediasoup](https://github.com/versatica/mediasoup) | C++/Node.js 生产会议 SFU |
| [LiveKit](https://github.com/livekit/livekit) | 全功能开源 WebRTC 平台 |
| [Pion ion-sfu](https://github.com/pion/ion-sfu) | 支持 Simulcast 的 Go SFU 库 |
