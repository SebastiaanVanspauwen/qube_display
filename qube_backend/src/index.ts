import datagram from 'dgram'
import WebSocket, { WebSocketServer } from 'ws'
import Logger, { LogLevel } from './helpers/logger'
import { destructure } from './helpers/destructure'
import { QUBEPacket } from './types/packet.type'

export class Runner {
  private wss: WebSocketServer
  private readonly logger: Logger = new Logger(LogLevel.INFO)
  private lastPacket: QUBEPacket | undefined
  private pinger: NodeJS.Timer
  private pingReply = true
  private pingCount = 0

  private readonly QUBE_PORT_RECV = 10016
  private readonly QUBE_PORT_SEND = 7777
  private readonly QUBE_IP = '172.22.222.208'

  private readonly socket: datagram.Socket = datagram.createSocket('udp4')

  async start (): Promise<void> {
    this.initHandlers()
    await this.initPing()

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

        if (this.lastPacket !== undefined && this.wss !== undefined) {
          this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
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

  private async initPing (): Promise<void> {
    this.pinger = setInterval(() => {
      this.logger.info(`Pinged QUBE at ${this.QUBE_IP}:${this.QUBE_PORT_SEND}`)

      if (this.pingReply) {
        if (this.wss === undefined &&  this.pingCount > 2) {
          this.wss = new WebSocketServer({ port: 9000 })

          this.wss.on('connection', (ws: WebSocket) => {
            this.logger.info('Client connected from:', ws.url)
          })

          this.wss.on('message', (message: string) => {
            this.logger.all('Message from client: ', message)
          })

          this.wss.on('error', (err: Error) => {
            this.logger.error('Error: ', err)
          })

          // send 1012 to clients

          this.wss.on('close', () => {
            this.logger.info('Client disconnected')
            this.wss.clients.forEach(client => {
                client.close(1012)
            })
          })
        }

        this.socket.send('ping', this.QUBE_PORT_SEND, this.QUBE_IP)
        this.pingReply = false
        this.pingCount++
      } else {
        void this.handlePingTimeout()
      }
    }, 2000)
  }

  private async handlePingTimeout (): Promise<void> {
    await this.close()
    await new Runner().start()
  }

  private async close (): Promise<void> {
    this.wss?.close()
    this.socket.close()
    clearTimeout(this.pinger)

    this.logger.info('Closing connection to QUBE')
  }
}

if (require.main === module) {
  void new Runner().start()
}
