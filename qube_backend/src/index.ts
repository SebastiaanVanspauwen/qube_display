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

  private readonly PING_SIZE = 14
  private readonly PACKET_SIZE = 512
  private readonly PING_INTERVAL = 1000

  private readonly socket: datagram.Socket = datagram.createSocket('udp4')

  async start (): Promise<void> {
    this.initHandlers()
    await this.initPing()

    process.on('SIGINT', () => { void this.close() })
    process.on('SIGTERM', () => { void this.close() })
  }

  private initHandlers (): void {
    this.logger.info('Attempting to connect to QUBE')

    this.socket.bind(this.QUBE_PORT_RECV)
    this.socket.connect(this.QUBE_PORT_SEND, this.QUBE_IP)

    this.socket.on('error', (err: Error) => {
      this.logger.error('Error: ', err)
    })

    this.socket.on('message', (raw: Buffer, rInfo: datagram.RemoteInfo) => {
      switch (rInfo.size) {
      case this.PING_SIZE:
        // this.logger.info(`Reply QUBE at ${this.socket.address().address}:${this.socket.address().port}`)
        this.pingReply = true
        break

      case this.PACKET_SIZE:
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
        break
      }
    })
  }

  private async initPing (): Promise<void> {
    this.pinger = setInterval(async () => {
      // this.logger.info(`Pinged QUBE at ${this.QUBE_IP}:${this.QUBE_PORT_SEND}`)

      if (this.pingReply) {
        if (this.wss === undefined &&  this.pingCount > 2) {
          this.wss = new WebSocketServer({ port: 9000 })

          this.wss.on('connection', () => {
            this.logger.info('Frontend connected.')
          })

          this.wss.on('message', (message: string) => {
            this.logger.all('Message from client: ', message)
          })

          this.wss.on('error', (err: Error) => {
            this.logger.error('Error: ', err)
          })

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
        await this.handlePingTimeout()
      }
    }, this.PING_INTERVAL)
  }

  private async handlePingTimeout (): Promise<void> {
    await this.close()
    await new Promise(resolve => setTimeout(resolve, 4000))
    await new Runner().start()
  }

  private async close (): Promise<void> {
    this.socket.close()
    clearTimeout(this.pinger)
    this.logger.info('Closed connection to QUBE, no reply in time.')

    if (this.wss) {
      this.wss.close()
      this.logger.info('Closed connection to clients. (Frontend)')
      try {
        this.wss.clients.forEach(client => {
          client.close(1012)
        })
      } catch (err) {
        this.logger.error('Error: ', err)
      }
    }
  }
}

if (require.main === module) {
  void new Runner().start()
}
