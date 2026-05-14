# 数据流

请求和数据流的详细文档。

## WHIP 发布流程

```mermaid
sequenceDiagram
    participant P as 发布者<br/>(OBS/浏览器)
    participant H as HTTP 处理器
    participant M as 管理器
    participant R as 房间
    participant PC as PeerConnection
    participant TF as TrackFanout

    P->>H: POST /api/whip/publish/{room}<br/>SDP Offer
    H->>H: CORS 检查
    H->>H: 限流检查
    H->>H: 认证检查
    
    H->>M: Publish(roomName, offer)
    M->>M: getOrCreateRoom(roomName)
    M->>R: Publish(offer)
    
    R->>PC: NewPeerConnection(iceConfig)
    PC->>PC: SetRemoteDescription(offer)
    PC->>PC: CreateAnswer()
    PC->>PC: SetLocalDescription(answer)
    
    PC-->>R: OnTrack 回调
    R->>TF: attachTrackFeed(track)
    TF->>TF: 启动 readLoop()
    
    R-->>M: answer SDP
    M-->>H: answer SDP
    H-->>P: 201 Created + SDP Answer
    
    Note over TF: readLoop 持续运行<br/>分发 RTP 包
```

## WHEP 播放流程

```mermaid
sequenceDiagram
    participant V as 观众<br/>(浏览器)
    participant H as HTTP 处理器
    participant M as 管理器
    participant R as 房间
    participant PC as PeerConnection
    participant TF as TrackFanout

    V->>H: POST /api/whep/play/{room}<br/>SDP Offer
    H->>H: CORS + 限流 + 认证检查
    
    H->>M: Subscribe(roomName, offer)
    M->>R: Subscribe(offer)
    
    R->>R: 检查订阅者限制
    
    loop 对每个现有 TrackFanout
        R->>TF: attachToSubscriber()
        TF->>PC: AddTrack(localTrack)
    end
    
    R->>PC: NewPeerConnection(iceConfig)
    PC->>PC: SetRemoteDescription(offer)
    PC->>PC: CreateAnswer()
    PC->>PC: SetLocalDescription(answer)
    
    R-->>M: answer SDP
    M-->>H: answer SDP
    H-->>V: 201 Created + SDP Answer
```

## RTP 包转发流程

```mermaid
flowchart LR
    subgraph 发布者
        PT[发布者轨道]
    end

    subgraph SFU
        RT[远程轨道] -->|ReadRTP| BUF[RTP 缓冲区]
        BUF -->|WriteRTP| LT1[本地轨道 1]
        BUF -->|WriteRTP| LT2[本地轨道 2]
        BUF -->|WriteRTP| LT3[本地轨道 N]
        BUF -->|WriteRTP| REC[录制器]
    end

    subgraph 订阅者
        LT1 --> S1[订阅者 1]
        LT2 --> S2[订阅者 2]
        LT3 --> SN[订阅者 N]
    end

    PT -->|RTP| RT
```

## 断开连接流程

### 发布者断开

```mermaid
sequenceDiagram
    participant PC as PeerConnection
    participant R as 房间
    participant TF as TrackFanout
    participant U as 上传器
    participant S as 订阅者

    PC->>PC: ICE 状态变更<br/>(Failed/Disconnected/Closed)
    PC-->>R: OnICEStateChange 回调

    R->>R: closePublisher()

    loop 遍历每个 TrackFanout
        R->>TF: close()
        TF->>TF: 停止 readLoop
        TF-->>R: 返回录制文件路径
    end

    R->>S: 关闭所有订阅者连接
    R->>R: 清空订阅者列表

    alt 启用上传
        R->>U: uploadRecording(paths)
        U->>U: PutObject 到 S3
        opt 上传后删除
            U->>U: 删除本地文件
        end
    end

    R->>R: pruneIfEmpty()
```

### 订阅者断开

```mermaid
sequenceDiagram
    participant PC as PeerConnection
    participant R as 房间
    participant TF as TrackFanout

    PC->>PC: ICE 状态变更
    PC-->>R: OnICEStateChange 回调

    R->>R: removeSubscriber(id)

    loop 遍历每个 TrackFanout
        R->>TF: 移除本地轨道绑定
    end

    R->>PC: 关闭 PeerConnection
    R->>R: pruneIfEmpty()
```

## 认证流程

```mermaid
flowchart TB
    REQ[请求] --> HEADER{检查认证头}
    
    HEADER -->|Authorization: Bearer| TOKEN[提取 Token]
    HEADER -->|X-Auth-Token| TOKEN
    HEADER -->|无| NOAUTH[无认证]
    
    TOKEN --> ROOM{房间 Token?}
    ROOM -->|找到| ROOMCHECK[比较 ROOM_TOKENS]
    ROOM -->|未找到| GLOBAL
    
    ROOMCHECK -->|匹配| ALLOW[✓ 允许]
    ROOMCHECK -->|不匹配| GLOBAL
    
    GLOBAL[全局 Token 检查] --> GLOBALFOUND{AUTH_TOKEN?}
    GLOBALFOUND -->|是| GLOBALCHECK[比较 Token]
    GLOBALFOUND -->|否| JWT
    
    GLOBALCHECK -->|匹配| ALLOW
    GLOBALCHECK -->|不匹配| JWT
    
    JWT[JWT 检查] --> JWTFOUND{JWT_SECRET?}
    JWTFOUND -->|是| JWTCHECK[验证并解析 JWT]
    JWTFOUND -->|否| NOAUTH
    
    JWTCHECK -->|无效| DENY[✗ 401 未授权]
    JWTCHECK -->|有效| JWTAUTH{检查声明}
    
    JWTAUTH -->|房间匹配| ALLOW
    JWTAUTH -->|房间不匹配| DENY
    
    NOAUTH -->|已配置认证| DENY
    NOAUTH -->|未配置认证| ALLOW
```

## 录制流程

```mermaid
sequenceDiagram
    participant TF as TrackFanout
    participant R as 录制器
    participant FS as 文件系统
    participant S3 as S3/MinIO

    TF->>TF: readLoop 接收 RTP
    
    alt 视频轨道 (VP8/VP9)
        TF->>R: WriteRTP 到 IVF 写入器
    else 音频轨道 (Opus)
        TF->>R: WriteRTP 到 OGG 写入器
    end
    
    Note over R: 文件名: {room}_{trackID}_{timestamp}.{ext}
    
    R->>FS: 写入 RECORD_DIR
    
    opt 发布者断开
        TF->>R: Close()
        R->>FS: 关闭文件

        alt UPLOAD_RECORDINGS=1
            TF->>S3: PutObject(bucket, key, file)

            opt DELETE_RECORDING_AFTER_UPLOAD=1
                TF->>FS: 删除本地文件
            end
        end
    end
```

## 指标更新流程

```mermaid
flowchart TB
    subgraph RTP["RTP 处理"]
        READ[ReadRTP] --> UPDATE[更新指标]
        UPDATE --> DISTRIB[分发给订阅者]
    end

    subgraph Metrics["Prometheus 指标"]
        UPDATE --> ROOMS[live_rooms Gauge]
        UPDATE --> SUBS[live_subscribers GaugeVec]
        UPDATE --> BYTES[live_rtp_bytes_total CounterVec]
        UPDATE --> PKTS[live_rtp_packets_total CounterVec]
    end

    subgraph Export["导出"]
        ROOMS --> PROM[/metrics 端点]
        SUBS --> PROM
        BYTES --> PROM
        PKTS --> PROM
    end
```

## 请求限流

```mermaid
flowchart TB
    REQ[请求] --> IP[提取客户端 IP]
    IP --> BUCKET{令牌桶<br/>可用?}

    BUCKET -->|是| ALLOW[允许请求]
    BUCKET -->|否| REJECT[429 Too Many Requests]

    ALLOW --> PROCESS[处理请求]
    PROCESS --> UPDATE[更新令牌桶<br/>-1 令牌]

    Note over BUCKET: 按 RATE_LIMIT_RPS 速率补充<br/>突发容量: RATE_LIMIT_BURST
```
