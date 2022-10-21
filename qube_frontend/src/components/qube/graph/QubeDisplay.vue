<script setup lang="ts">
import { useConnectionStore } from '@/stores/connection.store'
import { usePacketStore } from '@/stores/packet.store'

const packetStore = usePacketStore()
const connectionStore = useConnectionStore()
</script>

<template>
  <div
    v-if="connectionStore.isConnected"
    class="bg-red flex flex-col h-full m-auto text-center w-full"
  >
    <div class="bg-black mx-auto my-5 w-[80%]">
      <div>
        <StatisticsCard
          header="Laser Power"
          unit="%"
          :value="packetStore.getLaserStrength"
          info="The higher the laser power, the more power is being emitted from the laser, resulting in a higher intensity of led right emitted by the diamond."
        >
          <LaserBeamIcon
            background="#0B132F"
            fill="#0654EF"
            height="48px"
            width="48px"
            circlewidth="64px"
            circleheight="64px"
          />
        </StatisticsCard>
      </div>
    </div>
  </div>
</template>
