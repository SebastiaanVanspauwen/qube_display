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
      referenceTemperature: [] as number[],
      laserTemperature: [] as number[],
    },
    maxArrayLength: 25
  }),
  actions: {
    getMaxArrayLength() {
      return this.maxArrayLength
    },
    getPacket (): QUBEPacket | undefined {
      return this.packet
    },
    setPacket(packet: QUBEPacket): void {
      this.packet = packet
      this.packetsReceived++
    },
    timeout(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    getPacketCount(): number {
      return this.packetsReceived
    },
    getReferenceTemperature (): number[] {
      return this.temperature.referenceTemperature
    },
    getLaserTemperature (): number[] {
      return this.temperature.laserTemperature
    },
    getMicrowaveRange (): number[][] {
      const step = this.packet.info.microwaveData.steps
      const min = this.packet.info.microwaveData.minimumFrequency
      const max = this.packet.info.microwaveData.maximumFrequency
    
      const microwaveRange: number[] = Array.from({ length: step + 1 }, (_, i ) => min + (max - min) / step * i)

      return Array.from({ length: this.packet.info.microwaveData.steps }, (_, i) => [microwaveRange[i], this.packet.data.measurement.ODMR[i]])
    },
    getUptime (): string {
      return moment.utc(this.packet.info.deviceData.system.systemTickCount).format('HH:mm:ss')
    },
    getLaserStrengh (): string {
      return this.packet.info.laserData.status === 1
        ? (((280 - this.packet.info.laserData.potentiometerValue) / 280) * 100).toFixed(2)
        : '0'
    },
    getLaserState (): string {
      return this.packet.info.laserData.status === 1
      ? 'ON'
      : 'OFF'
    }
  }
})