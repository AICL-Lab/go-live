# Design Principles

Go-Live's architecture is guided by three core principles that shape every design decision. These principles emerge from the WebRTC SFU design space and prioritize operational simplicity over feature completeness.

## 1. Simplicity Over Completeness

Single-publisher rooms eliminate the complexity of stream selection algorithms (SVC adaptation, simulcast layer selection) that dominate large-scale SFU implementations [1]. By constraining each room to one publisher, Go-Live avoids:

- **Simulcast layer selection**: No need for bandwidth estimation algorithms or temporal/spatial layer switching
- **Stream prioritization**: No arbitration logic when multiple publishers compete
- **Codec negotiation complexity**: Single publisher means single codec pipeline per room

This constraint is a deliberate trade-off. Go-Live targets use cases like live events, webinars, and surveillance where the one-to-many model is natural. For multi-party conferencing, projects like Janus or mediasoup provide more appropriate abstractions.

## 2. Zero-Transcoding Forwarding

By operating at the RTP packet level, Go-Live avoids the computational cost of decode/encode cycles. The SFU reads RTP packets from the publisher's track and writes them directly to subscriber tracks without any media processing [2].

**What this enables:**
- Predictable CPU usage (scales with subscriber count, not media complexity)
- No codec licensing concerns (H.264/VP8/VP9 pass-through)
- Sub-frame latency (no encode pipeline delay)

**What this sacrifices:**
- No server-side mixing or compositing
- No bitrate adaptation to subscriber conditions
- No server-side recording in formats requiring re-encoding (e.g., MP4)

The recording system works around this by capturing raw RTP payloads into container formats that support them: VP8/VP9 into IVF, Opus into OGG.

## 3. Observable by Default

Every significant operation emits metrics and traces, enabling production debugging without code changes. The observability stack consists of:

- **Prometheus metrics**: Room count, subscriber count, RTP bytes/packets per track, rate limit rejections
- **OpenTelemetry traces**: Request-level tracing through the HTTP handler, SFU manager, and room operations
- **Health endpoints**: `/healthz` for liveness, `/metrics` for Prometheus scraping

This principle ensures that when a production issue occurs, the first question is "what do the dashboards show?" rather than "can we reproduce this locally?"

## Concurrency Model

Go-Live's concurrency design follows Go idioms:

| Concern | Mechanism |
|---------|-----------|
| Room state | `sync.RWMutex` per room |
| Track fanout | Goroutine per subscriber, exits on disconnect |
| Graceful shutdown | Context cancellation propagates to all goroutines |
| Rate limiting | Token bucket per IP, goroutine-safe |

Each subscriber gets an independent `readLoop` goroutine that reads from the publisher's track and writes to the subscriber's local track. This goroutine exits when:
- The subscriber disconnects (ICE state change)
- The publisher disconnects
- The room is closed

See [ADR-0001: Core Architecture](/en/decisions/0001-core-architecture) for the full architectural decision record.

## References

1. RFC 7667 - "RTP Topologies" (IETF, 2015) — Defines SFU, MCU, and other RTP topologies
2. RFC 8853 - "Using Simulcast in SDP and RTP Sessions" (IETF, 2021) — Simulcast negotiation that Go-Live's single-publisher model avoids
3. I-D.ietf-wish-whip - "WebRTC-HTTP Ingestion Protocol (WHIP)" — The ingestion protocol Go-Live implements
4. I-D.ietf-wish-whep - "WebRTC-HTTP Egress Protocol (WHEP)" — The egress protocol Go-Live implements
5. RFC 3550 - "RTP: A Transport Protocol for Real-Time Applications" (IETF, 2003) — The underlying transport protocol
