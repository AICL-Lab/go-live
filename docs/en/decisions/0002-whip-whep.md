# ADR-0002: WHIP/WHEP Protocol Integration

**Status**: Approved
**Date**: 2024
**Decision Makers**: Core team

## Context

Go-Live needs a signaling protocol for WebRTC stream publishing and playback. The signaling mechanism determines how clients establish connections with the server.

## Decision

Adopt WHIP (WebRTC-HTTP Ingestion Protocol) for publishing and WHEP (WebRTC-HTTP Egress Protocol) for playback.

### WHIP Publishing Flow

```mermaid
sequenceDiagram
    participant C as Client (OBS/Browser)
    participant S as Go-Live Server

    C->>S: POST /api/whip/publish/{room}<br/>Content-Type: application/sdp<br/>Body: SDP Offer

    S->>S: Authenticate request
    S->>S: Validate room name
    S->>S: Create PeerConnection
    S->>S: SetRemoteDescription(offer)
    S->>S: CreateAnswer()
    S->>S: SetLocalDescription(answer)

    S-->>C: 201 Created<br/>Content-Type: application/sdp<br/>Body: SDP Answer

    Note over C,S: ICE negotiation begins
    C-->>S: ICE Candidates
    S-->>C: ICE Candidates

    Note over C,S: DTLS handshake
    Note over C,S: RTP stream flows
```

### WHEP Playback Flow

```mermaid
sequenceDiagram
    participant C as Viewer (Browser)
    participant S as Go-Live Server

    C->>S: POST /api/whep/play/{room}<br/>Content-Type: application/sdp<br/>Body: SDP Offer

    S->>S: Authenticate request
    S->>S: Check subscriber limit
    S->>S: Create PeerConnection
    S->>S: Attach to existing tracks
    S->>S: SetRemoteDescription(offer)
    S->>S: CreateAnswer()

    S-->>C: 201 Created<br/>Content-Type: application/sdp<br/>Body: SDP Answer

    Note over C,S: ICE + DTLS + RTP
```

### API Contract

| Method | Path | Request | Response |
|--------|------|---------|----------|
| `POST` | `/api/whip/publish/{room}` | SDP Offer | SDP Answer (201) |
| `POST` | `/api/whep/play/{room}` | SDP Offer | SDP Answer (201) |

Both endpoints accept `application/sdp` content type and return `application/sdp` in the response body.

## Rationale

### Why WHIP/WHEP over WebSocket signaling

| Aspect | WHIP/WHEP | WebSocket |
|--------|-----------|-----------|
| Infrastructure | Standard HTTP | Requires WebSocket support |
| CDN/Proxy | Works with any reverse proxy | Needs WebSocket-aware proxy |
| Client complexity | Simple POST request | Persistent connection management |
| Firewall traversal | HTTP(S) is universally allowed | May be blocked |
| Scaling | Stateless HTTP, easy to scale | Stateful connections |

### Why WHIP/WHEP over custom protocol

- **Interoperability**: OBS Studio, browsers, and libraries support WHIP/WHEP
- **Standards-track**: IETF drafts with growing adoption
- **Simplicity**: One HTTP request per connection (no trickle ICE in basic mode)

## Integration Architecture

```mermaid
flowchart LR
    subgraph HTTP["HTTP Layer (internal/api)"]
        H[Handlers] --> MW[Middleware<br/>CORS + Auth + Rate Limit]
    end

    subgraph SFU["SFU Layer (internal/sfu)"]
        M[Manager] --> R[Room]
        R --> PC[PeerConnection]
    end

    MW --> M
    H -->|SDP Exchange| PC
    PC -->|RTP| TF[TrackFanout]
```

## Alternatives Considered

### WebSocket-based signaling
- **Rejected**: Adds infrastructure complexity
- Clients must maintain persistent connections
- Harder to scale horizontally

### gRPC-based signaling
- **Rejected**: Not natively supported in browsers
- Requires gRPC-Web proxy layer

### Custom HTTP API
- **Rejected**: Would work but loses interoperability
- WHIP/WHEP are becoming the standard

## Consequences

- Simple HTTP-based signaling
- Compatible with OBS Studio and modern browsers
- No WebSocket infrastructure needed
- Basic mode does not support trickle ICE (all candidates in SDP)
