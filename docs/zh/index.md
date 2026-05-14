---
layout: home
---

<div class="home-header">
  <div class="home-header-left">
    <div class="home-logo">GL</div>
    <div>
      <span class="home-title">Go-Live</span>
      <span class="home-subtitle">WebRTC SFU 服务器</span>
    </div>
  </div>
  <div class="home-nav">
    <a href="./getting-started">快速开始</a>
    <a href="./architecture/overview">系统架构</a>
    <a href="./white-paper/design-principles">技术白皮书</a>
    <a href="https://github.com/LessUp/go-live">GitHub</a>
    <a href="../en/">English</a>
  </div>
</div>

<div class="home-intro-row">
  <div class="home-intro">
    基于 Go 和 Pion 构建的轻量级高性能 WebRTC SFU 服务器。支持 WHIP/WHEP 协议，可与浏览器和 OBS 无缝对接，提供房间级媒体转发、可选录制、多层认证和完整可观测性。
  </div>
  <div class="home-stats">
    <span><strong>Go</strong> 原生</span>
    <span><strong>WHIP/WHEP</strong> 协议</span>
    <span><strong>SFU</strong> 架构</span>
  </div>
</div>

## 系统架构

<div class="feature-map">
  <div class="feature-card">
    <div class="feature-card-title">WHIP/WHEP 协议</div>
    <div class="feature-card-desc">
      完整支持 WHIP 推流和 WHEP 播放协议。兼容 OBS Studio 和现代浏览器，基于标准 HTTP 信令交互。
    </div>
    <div class="feature-tags">
      <a href="./protocols/whip" class="feature-tag">WHIP</a>
      <a href="./protocols/whep" class="feature-tag">WHEP</a>
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-card-title">房间 SFU 架构</div>
    <div class="feature-card-desc">
      选择性转发单元，每个房间支持单发布者和多订阅者。高效 RTP 包转发，无转码开销。
    </div>
    <div class="feature-tags">
      <a href="./architecture/sfu-core" class="feature-tag">SFU 核心</a>
      <a href="./architecture/data-flow" class="feature-tag">数据流</a>
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-card-title">录制与上传</div>
    <div class="feature-card-desc">
      内置录制功能，VP8/VP9 转 IVF，Opus 转 OGG。支持自动上传到 S3/MinIO 云存储。
    </div>
    <div class="feature-tags">
      <a href="./features/recording" class="feature-tag">录制</a>
      <a href="./api/configuration" class="feature-tag">S3 配置</a>
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-card-title">多层认证</div>
    <div class="feature-card-desc">
      Token 认证（全局和房间级），JWT 角色权限控制。常量时间比较防止时序攻击。
    </div>
    <div class="feature-tags">
      <a href="./features/auth" class="feature-tag">认证</a>
      <a href="./white-paper/security-architecture" class="feature-tag">安全</a>
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-card-title">可观测性</div>
    <div class="feature-card-desc">
      Prometheus 指标、OpenTelemetry 分布式追踪、健康检查。开箱即用的生产级监控。
    </div>
    <div class="feature-tags">
      <a href="./features/observability" class="feature-tag">指标</a>
      <a href="./features/observability" class="feature-tag">追踪</a>
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-card-title">高性能</div>
    <div class="feature-card-desc">
      低延迟、高吞吐量媒体分发。高效内存管理，自动房间清理和 goroutine 生命周期控制。
    </div>
    <div class="feature-tags">
      <a href="./white-paper/benchmarks" class="feature-tag">性能基准</a>
      <a href="./architecture/overview" class="feature-tag">架构</a>
    </div>
  </div>
</div>

<div class="quick-start">
  <div class="quick-start-title">快速开始</div>
  <div class="quick-start-content">
    <div class="command-block"><code>go run ./cmd/server</code></div>
    服务启动于 <code>:8080</code>。通过 <code>/api/whip/publish/{room}</code> 推流，通过 <code>/api/whep/play/{room}</code> 播放。
  </div>
</div>
