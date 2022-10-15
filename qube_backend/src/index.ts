import { Server } from 'http'
import datagram from 'dgram'
import Logger, { LogLevel } from './helpers/logger'
import { destructure } from './helpers/destructure'
import WebSocket, { WebSocketServer } from 'ws'
import { QUBEPacket } from './types/packet.type'

interface Info {
  address: string
  port: number
}

export class Runner {
  server: Server
  wss: WebSocketServer
  private readonly logger: Logger = new Logger(LogLevel.INFO)
  private lastPacket: QUBEPacket | undefined

  private readonly QUBE_PORT_SEND = 10016

  async start (): Promise<void> {
    this.wss = new WebSocketServer({ port: 9000 })

    const socket = datagram.createSocket('udp4')
    socket.bind(this.QUBE_PORT_SEND)

    this.logger.info('QUBE_BACKEND server started')

    socket.on('message', (raw: Buffer) => { 
      this.lastPacket = destructure(raw)

      if (this.lastPacket !== undefined) {
        this.wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(this.lastPacket))
          }
        })
      }
    })

    process.on('SIGINT', () => { void this.close() })
    process.on('SIGTERM', () => { void this.close() })
  }

  async close (): Promise<void> {
    this.server?.close()

    // eslint-disable-next-line no-console
    console.log('server closed')
  }
}

if (require.main === module) {
  void new Runner().start()
}
