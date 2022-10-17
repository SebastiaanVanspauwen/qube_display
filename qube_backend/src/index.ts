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
  private pinger: NodeJS.Timer

  private readonly QUBE_PORT_SEND = 10016
  private readonly QUBE_PORT_RECV = 7777
  private readonly QUBE_IP = '172.22.222.208'

  async start (): Promise<void> {
    try {
      this.wss = new WebSocketServer({ port: 9000 })
      this.logger.info('WebSocket server started on port 9000')
    } catch (e) {
      this.logger.error('Failed to start WebSocket server')
      this.logger.error(e)
    }

    const socket = datagram.createSocket('udp4')
    socket.bind(this.QUBE_PORT_SEND)

    this.logger.info('QUBE_BACKEND server started')

    socket.on('message', (raw: Buffer) => { 
      this.lastPacket = destructure(raw)

      if (this.lastPacket !== undefined) {
        this.wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            this.logger.info('Sending packet to client')
            client.send(JSON.stringify(this.lastPacket))
          }
        })
      }
    }) 

    this.pinger = setInterval(() => {
      socket.send('ping', this.QUBE_PORT_RECV, this.QUBE_IP)
    }, 5000)
    
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected from:', ws._socket.remoteAddress, 'on port:', ws._socket.remotePort)
    })

    this.wss.on('message', (message: string) => {
      console.log('Message from client: ', message)
    })

    process.on('SIGINT', () => { void this.close() })
    process.on('SIGTERM', () => { void this.close() })
  }

  async close (): Promise<void> {
    this.server?.close()
    clearTimeout(this.pinger)

    // eslint-disable-next-line no-console
    console.log('server closed')
  }
}

if (require.main === module) {
  void new Runner().start()
}
