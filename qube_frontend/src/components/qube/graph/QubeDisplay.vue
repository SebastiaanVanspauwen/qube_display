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
      <div class="justify-between m-auto">
        <!-- Info cards top row -->
        <div class="flex m-auto">
          <StatisticsCard
            header="Laser Temp"
            unit="°C"
            :value="packetStore.getLaserTemp"
          >
            <TemperatureIcon />
          </StatisticsCard>
          <StatisticsCard
            header="Board Temp"
            unit="°C"
            :value="packetStore.getRefTemp"
          >
            <TemperatureIcon />
          </StatisticsCard>
          <StatisticsCard
            header="System Uptime"
            :value="packetStore.getUptime"
          >
            <UptimeIcon />
          </StatisticsCard>
          <StatisticsCard
            header="Packets received"
            :value="packetStore.getPacketCount"
          >
            <PacketIcon />
          </StatisticsCard>
          <StatisticsCard
            header="Packets per second"
            :value="packetStore.getPPS.toString()"
          >
            <SpeedIcon />
          </StatisticsCard>
        </div>

        <!-- Info cards bottom row -->
        <div class="flex m-auto">
          <StatisticsCard
            header="Laser Status"
            unit=""
            :value="packetStore.getLaserState"
          >
            <LaserBeamIcon />
          </StatisticsCard>
          <StatisticsCard
            header="Microwave State"
            unit=""
            :value="packetStore.getLaserState"
          >
            <MicrowaveIcon />
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
            <MicrowaveIcon />
          </StatisticsCard>
          <StatisticsCard
            header="Averages taken"
            :value="packetStore.getAverageOptical"
          >
            <AverageIcon />
          </StatisticsCard>
        </div>
      </div>

      <!-- Graph -->
      <div class="h-[40%] my-auto w-full">
        <QubeGraph />
      </div>
      <div class="justify-center my-auto text-center pt-48">
        <h1 class="font-bold h-[128px] text-6xl text-white w-full">
          OSCAR-QUBE Display
        </h1>
      </div>
    </div>
  </div>
</template>
