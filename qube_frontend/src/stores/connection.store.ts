import { defineStore } from 'pinia'
import { SocketStore } from './connection.type'
import { usePacketStore } from './packet.store'

export const useConnectionStore = defineStore({
  id: 'wss',
  state: (): SocketStore => ({
    wss: undefined,
    hasWSS: false,
    isConnected: false,
    heartBeat: {} as NodeJS.Timer
  }),
  actions: {
    WSS_ONOPEN () {
        this.isConnected = true
    },
    WSS_ONERROR () {
        this.isConnected = false

    },
    WSS_ONCLOSE () {
        this.isConnected = false
        this.wss = undefined
    },
    WSS_ONMESSAGE(event: MessageEvent) {
        const packet = JSON.parse(event.data)
        const packetStore = usePacketStore()
        packetStore.setPacket(packet)
    },
    hasConnection(): boolean {
        return this.isConnected
    },
    async heartbeat () {
        this.heartBeat = setInterval(() => {
            if (this.isConnected === false && this.wss === undefined) {
                try {
                    this.wss = new WebSocket('ws://172.22.222.220:9000')
                    this.wss.onopen = () => this.WSS_ONOPEN()
                    this.wss.onerror = () => this.WSS_ONERROR()
                    this.wss.onclose = () => this.WSS_ONCLOSE()
                    this.wss.onmessage = (event) => this.WSS_ONMESSAGE(event)
                } catch (e) {
                    this.wss = undefined
                    this.isConnected = false
                    this.hasWSS = false
                }
            }
        }, 1000)
    },
    clearHeartbeat() {
        clearInterval(this.heartBeat)
    }
  }
})