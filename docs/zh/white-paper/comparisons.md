# 项目对比

Go-Live 在 WebRTC SFU 领域占据特定定位：单二进制文件、Go 原生服务器，内置录制、认证和可观测性。本页将 Go-Live 与类似项目对比，明确其定位和权衡。

## SFU 实现对比

| 特性 | Go-Live | Pion SFU Example | Janus Gateway | mediasoup |
|------|---------|------------------|---------------|-----------|
| **语言** | Go | Go | C | C++ / Node.js |
| **部署** | 单二进制 | 源码构建 | 包/构建 | npm + 原生 |
| **协议** | WHIP/WHEP | 自定义 HTTP | 插件式 | 自定义 JS API |
| **录制** | 内置（IVF/OGG） | 手动捕获 | 插件 | 外部 |
| **认证** | Token + JWT | 无内置 | 插件 | 外部 |
| **可观测性** | Prometheus + OTel | 基础日志 | 插件 | 外部 |
| **房间管理** | 内存自动管理 | 手动 | 插件 | 手动 |
| **复杂度** | 低 | 低 | 高 | 中 |
| **适用场景** | 直播、活动 | 学习、PoC | 会议、SIP | 生产会议 |

## 设计权衡

### 为什么 Go-Live 选择简洁性

Go-Live 做出明确的权衡，优先考虑运维简洁性：

**每房间单发布者**
- 消除 Simulcast 层选择复杂性
- 移除流仲裁逻辑
- 直播活动、网络研讨会、监控的自然适配
- 权衡：不支持多方会议

**内存房间状态**
- 零外部依赖（无 Redis、无数据库）
- 快速房间创建和清理
- 权衡：服务器重启时房间状态丢失

**RTP 直通（无转码）**
- 可预测的 CPU 使用
- 无编解码器许可问题
- 权衡：无服务端混流、码率自适应或 MP4 录制

**仅 WHIP/WHEP**
- 基于标准，兼容 OBS 和浏览器
- 简单 HTTP 信令（无 WebSocket）
- 权衡：无自定义信令支持高级特性

### 何时选择替代方案

| 用例 | 推荐方案 |
|------|----------|
| 多方视频会议 | Janus、mediasoup、LiveKit |
| SIP/PSTN 网关 | Janus |
| 大规模广播（1 万+ 观众） | CDN + SFU 集群 |
| 服务端混流/合成 | Kurento、自定义 MCU |
| 简单直播 + 录制 | **Go-Live** |
| 学习 WebRTC 内部原理 | **Go-Live** 或 Pion 示例 |

## 类似 Go 项目

| 项目 | 定位 | 与 Go-Live 的区别 |
|------|------|-------------------|
| [pion/webrtc](https://github.com/pion/webrtc) | WebRTC 库 | Go-Live 基于 Pion 构建；Pion 是引擎，Go-Live 是应用 |
| [ion-sfu](https://github.com/pion/ion-sfu) | 完整 SFU 库 | 更多功能（Simulcast、数据通道），更复杂 API |
| [LiveKit](https://github.com/livekit/livekit) | 生产 SFU 平台 | 全功能（录制、输出、SIP），需要更多基础设施 |

Go-Live 刻意比这些替代方案更简单。它作为参考实现和简单直播场景的实用工具。
