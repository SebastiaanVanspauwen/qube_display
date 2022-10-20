import { Websocket } from ws

export type SocketStore = {
    isConnected: boolean
    hasWSS: boolean
    wss: WebSocket | undefined
    heartBeat: NodeJS.Timer
  };