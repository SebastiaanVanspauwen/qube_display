import { defineStore } from 'pinia'
import { QUBEPacket } from '@/types/packet.type'
import moment from 'moment'

export const usePacketStore = defineStore({
  id: 'packet',
  state: () => ({
    packet: {} as QUBEPacket,
    history: [] as QUBEPacket[],
    packetsReceived: 0,
    startedAt: Date.now(),
    temperature: {
      referenceTemperature: {} as number,
      laserTemperature: {} as number,
    }
  }),
  actions: {
    get _packet(): QUBEPacket {
      console.log('get packet')
      return this.packet
    },
    setPacket(packet: QUBEPacket) {
      this.packet = packet
      this.packetsReceived++
    },
    timeout(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    get packetCount(): string {
      return this.packetsReceived.toString()
    },
    get refTemp (): string {
      return this.temperature.referenceTemperature.toFixed(2)
    },
    get laserTemp (): string {
      return this.temperature.laserTemperature.toFixed(2)
    },
    get microwaveRange (): number[][] {
      const step = this.packet.info.microwaveData.steps
      const min = this.packet.info.microwaveData.minimumFrequency
      const max = this.packet.info.microwaveData.maximumFrequency
    
      const microwaveRange: number[] = Array.from({ length: step + 1 }, (_, i ) => min + (max - min) / step * i)

      return Array.from({ length: this.packet.info.microwaveData.steps }, (_, i) => [microwaveRange[i], this.packet.data.measurement.ODMR[i]])
    },
    get uptime (): string {
      return moment.utc(this.packet.info.deviceData.system.systemTickCount).format('HH:mm:ss')
    },
    get laserStrength (): string {
      return this.packet.info.laserData.status === 1
        ? (((280 - this.packet.info.laserData.potentiometerValue) / 280) * 100).toFixed(2)
        : '0'
    },
    get laserState (): string {
      return this.packet.info.laserData.status === 1
      ? 'ON'
      : 'OFF'
    },
    get attenuationStrength (): string {
      return (((63 - this.packet.info.microwaveData.attenuation) / 63) * 100).toFixed(2)
    }
  }
})