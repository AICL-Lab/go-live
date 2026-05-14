# Project Comparisons

Go-Live occupies a specific niche in the WebRTC SFU landscape: a single-binary, Go-native server with built-in recording, authentication, and observability. This page compares Go-Live with similar projects to clarify its positioning and trade-offs.

## SFU Implementations Comparison

| Feature | Go-Live | Pion SFU Example | Janus Gateway | mediasoup |
|---------|---------|------------------|---------------|-----------|
| **Language** | Go | Go | C | C++ / Node.js |
| **Deployment** | Single binary | Source build | Package/build | npm + native |
| **Protocol** | WHIP/WHEP | Custom HTTP | Plugin-based | Custom JS API |
| **Recording** | Built-in (IVF/OGG) | Manual capture | Plugin | External |
| **Authentication** | Token + JWT | None built-in | Plugin | External |
| **Observability** | Prometheus + OTel | Basic logs | Plugin | External |
| **Room management** | In-memory, automatic | Manual | Plugin | Manual |
| **Complexity** | Low | Low | High | Medium |
| **Best for** | Live streaming, events | Learning, PoC | Conferencing, SIP | Production conferencing |

## Design Trade-offs

### Why Go-Live Chose Simplicity

Go-Live makes explicit trade-offs that favor operational simplicity:

**Single publisher per room**
- Eliminates simulcast layer selection complexity
- Removes stream arbitration logic
- Natural fit for live events, webinars, surveillance
- Trade-off: No multi-party conferencing support

**In-memory room state**
- Zero external dependencies (no Redis, no database)
- Fast room creation and cleanup
- Trade-off: Room state lost on server restart

**RTP pass-through (no transcoding)**
- Predictable CPU usage
- No codec licensing
- Trade-off: No server-side mixing, bitrate adaptation, or MP4 recording

**WHIP/WHEP only**
- Standards-based, works with OBS and browsers
- Simple HTTP signaling (no WebSocket)
- Trade-off: No custom signaling for advanced features

### When to Choose Alternatives

| Use Case | Recommended Solution |
|----------|---------------------|
| Multi-party video conferencing | Janus, mediasoup, LiveKit |
| SIP/PSTN gateway | Janus |
| Large-scale broadcast (10k+ viewers) | Cloud CDN + SFU cluster |
| Server-side mixing/composition | Kurento, custom MCU |
| Simple live streaming with recording | **Go-Live** |
| Learning WebRTC internals | **Go-Live** or Pion examples |

## Similar Go Projects

| Project | Focus | Difference from Go-Live |
|---------|-------|------------------------|
| [pion/webrtc](https://github.com/pion/webrtc) | WebRTC library | Go-Live is built on Pion; Pion is the engine, Go-Live is the application |
| [ion-sfu](https://github.com/pion/ion-sfu) | Full SFU library | More features (simulcast, data channels), more complex API |
| [LiveKit](https://github.com/livekit/livekit) | Production SFU platform | Full-featured (recording, egress, SIP), requires more infrastructure |

Go-Live is intentionally simpler than these alternatives. It serves as a reference implementation and a practical tool for straightforward live streaming scenarios.
