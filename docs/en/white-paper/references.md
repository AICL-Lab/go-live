# References

A collection of standards, papers, and resources relevant to Go-Live's design and implementation.

## Standards and RFCs

| ID | Title | Relevance |
|----|-------|-----------|
| [RFC 3550](https://datatracker.ietf.org/doc/html/rfc3550) | RTP: A Transport Protocol for Real-Time Applications | Core transport protocol for media delivery |
| [RFC 7667](https://datatracker.ietf.org/doc/html/rfc7667) | RTP Topologies | Defines SFU, MCU, and other topologies; Go-Live implements the SFU topology |
| [RFC 8825](https://datatracker.ietf.org/doc/html/rfc8825) | Overview: Real-Time Protocols for Browser-Based Applications | WebRTC protocol overview |
| [RFC 8826](https://datatracker.ietf.org/doc/html/rfc8826) | Security Considerations for WebRTC | WebRTC security model |
| [RFC 8853](https://datatracker.ietf.org/doc/html/rfc8853) | Using Simulcast in SDP and RTP Sessions | Simulcast negotiation (Go-Live's single-publisher model avoids this complexity) |
| [RFC 8829](https://datatracker.ietf.org/doc/html/rfc8829) | JSEP: JavaScript Session Establishment Protocol | SDP offer/answer model used in WebRTC |
| [RFC 8838](https://datatracker.ietf.org/doc/html/rfc8838) | Trickle ICE | ICE candidate trickling (not used by Go-Live's WHIP/WHEP exchange) |

## WebRTC Drafts

| ID | Title | Status |
|----|-------|--------|
| [I-D.ietf-wish-whip](https://datatracker.ietf.org/doc/draft-ietf-wish-whip/) | WebRTC-HTTP Ingestion Protocol (WHIP) | Implemented by Go-Live |
| [I-D.ietf-wish-whep](https://datatracker.ietf.org/doc/draft-ietf-wish-whep/) | WebRTC-HTTP Egress Protocol (WHEP) | Implemented by Go-Live |

## WebRTC Implementation

| Resource | Description |
|----------|-------------|
| [Pion WebRTC](https://github.com/pion/webrtc) | Go implementation of WebRTC — Go-Live's core dependency |
| [WebRTC for the Curious](https://webrtcforthecurious.com/) | Open-source book explaining WebRTC internals |
| [WebRTC.org](https://webrtc.org/) | Official WebRTC project site |

## Media Containers

| Resource | Description |
|----------|-------------|
| [IVF Container Format](https://wiki.multimedia.cx/index.php/IVF) | Format used for VP8/VP9 recording |
| [OGG Container Format](https://xiph.org/ogg/) | Format used for Opus audio recording |
| [RFC 7587](https://datatracker.ietf.org/doc/html/rfc7587) | RTP Payload Format for the Opus Codec |

## Observability

| Resource | Description |
|----------|-------------|
| [OpenTelemetry Specification](https://opentelemetry.io/docs/) | Distributed tracing standard used by Go-Live |
| [Prometheus Best Practices](https://prometheus.io/docs/practices/) | Metrics naming and instrumentation guidelines |
| [Prometheus Go Client](https://github.com/prometheus/client_golang) | Go library for Prometheus metrics |

## Go Concurrency

| Resource | Description |
|----------|-------------|
| [Go Memory Model](https://go.dev/ref/mem) | Defines happens-before relationships for goroutine synchronization |
| [Effective Go: Concurrency](https://go.dev/doc/effective_go#concurrency) | Go concurrency patterns (goroutines, channels, mutexes) |
| [sync.Mutex documentation](https://pkg.go.dev/sync#Mutex) | Used for room state protection in Go-Live |

## Related Projects

| Project | Description |
|---------|-------------|
| [Janus Gateway](https://github.com/meetecho/janus-gateway) | C-based WebRTC server with plugin architecture |
| [mediasoup](https://github.com/versatica/mediasoup) | C++/Node.js SFU for production conferencing |
| [LiveKit](https://github.com/livekit/livekit) | Full-featured open-source WebRTC platform |
| [Pion ion-sfu](https://github.com/pion/ion-sfu) | Go SFU library with simulcast support |
