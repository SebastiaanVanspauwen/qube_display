import datagram from 'dgram'
import WebSocket, { WebSocketServer } from 'ws'
import Logger, { LogLevel } from './helpers/logger'
import { destructure } from './helpers/destructure'
import { QUBEPacket } from './types/packet.type'

export class Runner {
  wss: WebSocketServer = new WebSocketServer({ port: 9000 })
  private readonly logger: Logger = new Logger(LogLevel.INFO)
  private lastPacket: QUBEPacket | undefined
  private pinger: NodeJS.Timer
  private pingReply = true

  private readonly QUBE_PORT_RECV = 10016
  private readonly QUBE_PORT_SEND = 7777
  private readonly QUBE_IP = '172.22.222.208'

  private readonly socket: datagram.Socket = datagram.createSocket('udp4')

  async start (): Promise<void> {
    this.initHandlers()
    await this.initPing()

    this.wss.on('connection', (ws: WebSocket) => {
      this.logger.info('Client connected from:', ws)
    })

    this.wss.on('message', (message: string) => {
      this.logger.info('Message from client: ', message)
    })

    process.on('SIGINT', () => { void this.close() })
    process.on('SIGTERM', () => { void this.close() })
  }

  private initHandlers (): void {
    this.logger.info('Connecting to QUBE')

    this.socket.bind(this.QUBE_PORT_RECV)
    this.socket.connect(this.QUBE_PORT_SEND, this.QUBE_IP)

    this.socket.on('error', (err: Error) => {
      this.logger.error('Error: ', err)
    })

    this.socket.on('message', (raw: Buffer, rInfo: datagram.RemoteInfo) => {
      switch (rInfo.size) {
      case 14:
        this.logger.info(`Reply QUBE at ${this.socket.address().address}:${this.socket.address().port}`)
        this.pingReply = true
        break

      case 512:
        this.lastPacket = destructure(raw)

        if (this.lastPacket !== undefined) {
          this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              this.logger.info('Sending packet to client')
              client.send(JSON.stringify(this.lastPacket))
            }
          })
        }
        break

      default:
        throw Error('Unknown packet size')
      }
    })
  }

  async initPing (): Promise<void> {
    this.pinger = setInterval(() => {
      this.logger.info(`Pinged QUBE at ${this.QUBE_IP}:${this.QUBE_PORT_SEND}`)

      if (this.pingReply) {
        this.socket.send('ping', this.QUBE_PORT_SEND, this.QUBE_IP)
        this.pingReply = false
      } else {
        void this.handlePingTimeout()
      }
    }, 2000)
  }

  async handlePingTimeout (): Promise<void> {
    await this.close()
    await new Runner().start()
  }

  async close (): Promise<void> {
    this.wss?.close()
    this.socket.close()
    clearTimeout(this.pinger)

    this.logger.info('Closing connection to QUBE')
  }
}

if (require.main === module) {
  void new Runner().start()
}
