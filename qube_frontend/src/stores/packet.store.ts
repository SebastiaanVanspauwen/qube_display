/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { defineStore } from 'pinia'
import moment from 'moment'
import { QUBEPacket } from '@/types/packet.type'

export const usePacketStore = defineStore({
  id: 'packet',
  state: () => ({
    packet: {} as QUBEPacket,
    packetsReceived: 0,
    pps: 0,
    ppsTimer: {} as NodeJS.Timer,
    ppsStart: Number,
    startedAt: Date.now()
  }),
  actions: {
    setPacket (packet: QUBEPacket) {
      this.packet = packet
      this.packetsReceived++
    },
    async timeout (ms: number) {
      return await new Promise(resolve => setTimeout(resolve, ms))
    },
    async calculatePPS () {
      this.ppsTimer = setInterval(async () => {
        const packets = this.packetsReceived
        // Wait for 1 second before calculating packets per second
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.pps = this.packetsReceived - packets
      }, 1000)
    },
    clearPPS () {
      clearInterval(this.ppsTimer)
    }
  },
  getters: {
    getPacket (): QUBEPacket {
      return this.packet
    },
    getPacketCount (): string {
      return this.packetsReceived?.toString() ?? '0'
    },
    getRefTemp (): string {
      return this.packet?.data?.referenceTemp?.referenceTemperature.toFixed(2) ?? '0.00'
    },
    getLaserTemp (): string {
      return this.packet?.info?.laserData?.temperature.toFixed(2) ?? '0.00'
    },
    getMicrowaveRange (): number[][] {
      const step = this.packet?.info?.microwaveData?.steps ?? 200
      const min = this.packet?.info?.microwaveData?.minimumFrequency ?? 2600
      const max = this.packet?.info?.microwaveData?.maximumFrequency ?? 3200

      const microwaveRange: number[] = Array.from(
        { length: step + 1 },
        (_, i) => min + (max - min) / step * i
      )

      return Array.from(
        { length: this.packet?.info?.microwaveData?.steps },
        (_, i) => [microwaveRange[i], this.packet.data.measurement.ODMR[i]]
      )
    },
    getUptime (): string {
      return moment.utc(this.packet?.info?.deviceData?.system?.systemTickCount ?? 0).format('HH:mm:ss')
    },
    getLaserStrength (): string {
      return (this.packet?.info?.laserData?.status === 1
        ? (((280 - this.packet?.info?.laserData?.potentiometerValue) / 280) * 100).toFixed(2)
        : '0') ?? '0'
    },
    getLaserState (): string {
      return (this.packet?.info?.laserData?.status === 1
        ? 'ON'
        : 'OFF') ?? 'OFF'
    },
    getAttenuationStrength (): string {
      return (((63 - this.packet?.info?.microwaveData?.attenuation ?? 63) / 63) * 100).toFixed(2)
    },
    getPPS (): number {
      return this.pps
    },
    getAverageOptical (): string {
      return this.packet?.info?.deviceData?.deviceSettings?.averageOptical.toString() ?? '10'
    },
    getMinimumMicrowave (): number {
      return Math.round((this.packet?.info?.microwaveData?.minimumFrequency / 100) * 100)
    },
    getMaximumMicrowave (): number {
      return Math.round((this.packet?.info?.microwaveData?.maximumFrequency / 100) * 100)
    },
    getMinimumODMR (): number {
      return (Math.round(Math.min(...this.packet?.data?.measurement?.ODMR) / 10) * 10) - 10
    },
    getMaximumODMR (): number {
      return (Math.round(Math.max(...this.packet?.data?.measurement?.ODMR) / 10) * 10 + 10)
    }
  }
})
