import { defineStore } from 'pinia'
import { QUBEPacket } from '@/types/packet.type'
import moment from 'moment'

export const usePacketStore = defineStore({
  id: 'packet',
  state: () => ({
    packet: {} as QUBEPacket,
    packetsReceived: 0,
    startedAt: Date.now(),
    temperature: {
      referenceTemperature: {} as number,
      laserTemperature: {} as number,
    }
  }),
  actions: {
    get _packet(): QUBEPacket {
      return this.packet
    },
    setPacket(packet: QUBEPacket) {
      this.packet = packet
      this.packetsReceived++
    },
    timeout(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    getPacketCount(): string {
      return this.packetsReceived?.toString() ?? '0'
    },
    getRefTemp (): string {
      return this.temperature?.referenceTemperature.toFixed(2) ?? ''
    },
    getLaserTemp (): string {
      return this.temperature?.laserTemperature.toFixed(2) ?? ''
    },
    getMicrowaveRange (): number[][] {
      const step = this.packet?.info?.microwaveData.steps ?? 200
      const min = this.packet?.info?.microwaveData.minimumFrequency ?? 2600
      const max = this.packet?.info?.microwaveData.maximumFrequency ?? 3200
    
      const microwaveRange: number[] = Array.from({ length: step + 1 }, (_, i ) => min + (max - min) / step * i)

      return Array.from({ length: this.packet.info.microwaveData.steps }, (_, i) => [microwaveRange[i], this.packet.data.measurement.ODMR[i]])
    },
    getUptime (): string {
      return moment.utc(this.packet.info.deviceData.system.systemTickCount).format('HH:mm:ss')
    },
    getLaserStrength (): string {
      return this.packet.info.laserData.status === 1
        ? (((280 - this.packet.info.laserData.potentiometerValue) / 280) * 100).toFixed(2)
        : '0'
    },
    getLaserState (): string {
      return this.packet.info.laserData.status === 1
      ? 'ON'
      : 'OFF'
    },
    getAttenuationStrength (): string {
      return (((63 - this.packet.info.microwaveData.attenuation) / 63) * 100).toFixed(2)
    }
  }
})