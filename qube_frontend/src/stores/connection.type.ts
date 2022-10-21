
export interface SocketStore {
  isConnected: boolean
  hasWSS: boolean
  wss: WebSocket | undefined
  heartBeat: NodeJS.Timer
}
