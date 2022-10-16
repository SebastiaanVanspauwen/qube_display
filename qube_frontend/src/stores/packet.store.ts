import { defineStore } from 'pinia'
import { QUBEPacket } from '@/types/packet.type'

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
      this.update()
    },
    update(): void {
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
    }
  }
})