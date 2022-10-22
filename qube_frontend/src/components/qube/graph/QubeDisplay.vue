<script setup lang="ts">
import { useConnectionStore } from '@/stores/connection.store'
import { usePacketStore } from '@/stores/packet.store'

const packetStore = usePacketStore()
const connectionStore = useConnectionStore()
</script>

<template>
  <div
    v-if="connectionStore.isConnected"
    class="flex flex-col h-[90%] text-center w-full"
  >
    <div class="mx-auto w-[100%]">
      <!-- Info cards -->
      <div class="justify-between m-auto max-w-[860px] w-[80%]">
        <!-- Info cards top row -->
        <div class="flex m-auto">
          <StatisticsCard
            header="Laser Temp"
            unit="°C"
            :value="packetStore.getLaserTemp"
          >
            <LaserBeamIcon />
          </StatisticsCard>
          <StatisticsCard
            header="Board Temp"
            unit="°C"
            :value="packetStore.getRefTemp"
          >
            <LaserBeamIcon />
          </StatisticsCard>
          <StatisticsCard
            header="System Uptime"
            :value="packetStore.getUptime"
          >
            <LaserBeamIcon />
          </StatisticsCard>
          <StatisticsCard
            header="Packets since connected"
            :value="packetStore.getPacketCount"
          >
            <LaserBeamIcon />
          </StatisticsCard>
          <StatisticsCard
            header="Packets per second"
            unit="/s"
            :value="packetStore.getPPS.toString()"
          >
            <LaserBeamIcon />
          </StatisticsCard>
        </div>

        <!-- Info cards bottom row -->
        <div class="flex m-auto">
          <StatisticsCard
            header="Laser Status"
            unit="%"
            :value="packetStore.getLaserState"
          >
            <LaserBeamIcon />
          </StatisticsCard>
          <StatisticsCard
            header="Microwave State"
            unit="%"
            :value="packetStore.getLaserState"
          >
            <LaserBeamIcon />
          </StatisticsCard>
          <StatisticsCard
            header="Laser Power"
            unit="%"
            :value="packetStore.getLaserStrength"
          >
            <LaserBeamIcon />
          </StatisticsCard>
          <StatisticsCard
            header="Attenuation"
            unit="%"
            :value="packetStore.getAttenuationStrength"
          >
            <LaserBeamIcon />
          </StatisticsCard>
          <StatisticsCard
            header="Averages taken"
            :value="packetStore.getAverageOptical"
          >
            <LaserBeamIcon />
          </StatisticsCard>
        </div>
      </div>

      <!-- Graph -->
      <div class="h-[40%] my-auto w-full">
        <QubeGraph />
      </div>
    </div>
  </div>
</template>
