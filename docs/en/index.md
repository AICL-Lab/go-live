---
layout: home
---

<div class="home-header">
  <div class="home-header-left">
    <div class="home-logo">GL</div>
    <div>
      <span class="home-title">Go-Live</span>
      <span class="home-subtitle">WebRTC SFU Server</span>
    </div>
  </div>
  <div class="home-nav">
    <a href="./getting-started">Getting Started</a>
    <a href="./architecture/overview">Architecture</a>
    <a href="./white-paper/design-principles">White Paper</a>
    <a href="https://github.com/LessUp/go-live">GitHub</a>
    <a href="../zh/">中文</a>
  </div>
</div>

<div class="home-intro-row">
  <div class="home-intro">
    A lightweight, high-performance WebRTC SFU server built with Go and Pion. Supports WHIP/WHEP protocols for browser-based and OBS streaming, with room-based relay, optional recording, multi-layer authentication, and full observability.
  </div>
  <div class="home-stats">
    <span><strong>Go</strong> native</span>
    <span><strong>WHIP/WHEP</strong> protocols</span>
    <span><strong>SFU</strong> architecture</span>
  </div>
</div>

## Architecture

<div class="feature-map">
  <div class="feature-card">
    <div class="feature-card-title">WHIP/WHEP Protocols</div>
    <div class="feature-card-desc">
      Full support for WHIP publishing and WHEP playback. Compatible with OBS Studio and modern browsers via standard HTTP-based signaling.
    </div>
    <div class="feature-tags">
      <a href="./protocols/whip" class="feature-tag">WHIP</a>
      <a href="./protocols/whep" class="feature-tag">WHEP</a>
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-card-title">Room-based SFU</div>
    <div class="feature-card-desc">
      Selective Forwarding Unit with one publisher and multiple subscribers per room. Efficient RTP packet forwarding without transcoding overhead.
    </div>
    <div class="feature-tags">
      <a href="./architecture/sfu-core" class="feature-tag">SFU Core</a>
      <a href="./architecture/data-flow" class="feature-tag">Data Flow</a>
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-card-title">Recording & Upload</div>
    <div class="feature-card-desc">
      Built-in recording with VP8/VP9 to IVF and Opus to OGG. Automatic upload to S3/MinIO for cloud storage integration.
    </div>
    <div class="feature-tags">
      <a href="./features/recording" class="feature-tag">Recording</a>
      <a href="./api/configuration" class="feature-tag">S3 Config</a>
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-card-title">Multi-layer Auth</div>
    <div class="feature-card-desc">
      Token authentication (global and per-room), JWT with role-based access control. Constant-time comparison prevents timing attacks.
    </div>
    <div class="feature-tags">
      <a href="./features/auth" class="feature-tag">Auth</a>
      <a href="./white-paper/security-architecture" class="feature-tag">Security</a>
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-card-title">Observability</div>
    <div class="feature-card-desc">
      Prometheus metrics, OpenTelemetry distributed tracing, and health checks. Production-ready monitoring out of the box.
    </div>
    <div class="feature-tags">
      <a href="./features/observability" class="feature-tag">Metrics</a>
      <a href="./features/observability" class="feature-tag">Tracing</a>
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-card-title">High Performance</div>
    <div class="feature-card-desc">
      Low-latency, high-throughput media distribution. Efficient memory management with automatic room cleanup and goroutine lifecycle control.
    </div>
    <div class="feature-tags">
      <a href="./white-paper/benchmarks" class="feature-tag">Benchmarks</a>
      <a href="./architecture/overview" class="feature-tag">Architecture</a>
    </div>
  </div>
</div>

<div class="quick-start">
  <div class="quick-start-title">Quick Start</div>
  <div class="quick-start-content">
    <div class="command-block"><code>go run ./cmd/server</code></div>
    Server starts on <code>:8080</code>. Publish via WHIP at <code>/api/whip/publish/{room}</code>, play via WHEP at <code>/api/whep/play/{room}</code>.
  </div>
</div>
