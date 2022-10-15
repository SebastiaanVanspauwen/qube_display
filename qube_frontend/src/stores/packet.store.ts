import { defineStore } from 'pinia'
import { QUBEPacket } from '@/types/packet.type'

export const usePacketStore = defineStore({
  id: 'packet',
  state: () => ({
    packet: {} as QUBEPacket,
    packetsReceived: 0,
    startedAt: Date.now(),
    temperature: {
      referenceTemperature: [] as number[],
      laserTemperature: [] as number[],
    },
    maxArrayLength: 500
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
      this.update()
    },
    update(): void {
      this.addTemperature()
    },
    getPacketsPerSecond(): string {
      return (this.packetsReceived / ((Date.now() - this.startedAt) / 1000)).toFixed(2)
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

    addTemperature (): void {
      this.temperature.referenceTemperature.push(this.packet.data.referenceTemp.referenceTemperature)
      this.temperature.laserTemperature.push(this.packet.info.laserData.temperature)

      if (this.temperature.referenceTemperature.length > this.maxArrayLength) {
        this.temperature.referenceTemperature.splice(0, 1)
      }

      if (this.temperature.laserTemperature.length > this.maxArrayLength) {
        this.temperature.laserTemperature.splice(0, 1)
      }
    }
  }
})