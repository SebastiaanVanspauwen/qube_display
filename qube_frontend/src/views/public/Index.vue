<script setup lang="ts">
import { useConnectionStore } from '@/stores/connection.store';
import { usePacketStore } from '@/stores/packet.store'
import { QUBEPacket } from '@/types/packet.type';
import * as echarts from 'echarts'
import moment from 'moment'

const packetStore = usePacketStore()
const connectionStore = useConnectionStore()

const laserStrength = computed(() => {
  return packet.value!.info.laserData.status === 1
    ? (((280 - packet.value!.info.laserData.potentiometerValue) / 280) * 100).toFixed(2)
    : '0'
})

const laserState = computed(() => {
  return packet.value!.info.laserData.status === 1
    ? 'ON'
    : 'OFF'
})

const pps = ref(0)
// Set interval every 1 second to calculate packets per second
setInterval(async () => {
  const packets = packetStore.getPacketCount()

  // Wait for 1 second before calculating packets per second
  await new Promise(resolve => setTimeout(resolve, 1000))

  pps.value = packetStore.getPacketCount() - packets
}, 1000)

const attenuationStrength = computed(() => {
  return ((63 - packet.value!.info.microwaveData.attenuation) / 63) * 100
})

</script>

<template>
  <div class="min-h-[1200px]">
  <div class="min-h-[64px] h-[64px] text-center flex">
    <CompanyLogo class="absolute flex h-[78px]" />
    <h1 class="flex m-auto text-center py-10 text-white font-bold text-5xl"> OSCAR-QUBE Display </h1>
    <FPSCounter />
  </div>
  <div v-if="connectionStore.hasConnection()" class="flex flex-col items-center">
    <div class="w-[100%] m-auto flex justify-center">
        <div class="w-[90%] py-8">
          <div class="flex m-auto w-[70%]">
              <StatisticsCard header="Laser housing temperature" unit="°C"
                :value="packet!.info.laserData.temperature.toFixed(2)" 
              >
                <TemperatureIcon background="#0B132F" fill="#0654EF" height="48px" width="48px" circlewidth="64px" circleheight="64px"/>
              </StatisticsCard>

              <StatisticsCard header="Board temperature" unit="°C"
                :value="packet!.data.referenceTemp.referenceTemperature.toFixed(2)" 
              >
                <TemperatureIcon background="#0B132F" fill="#0654EF" height="48px" width="48px" circlewidth="64px" circleheight="64px"/>
              </StatisticsCard>

              <StatisticsCard header="System uptime" unit=""
                :value="uptime" 
              >
                <UptimeIcon background="#0B132F" fill="#0654EF" height="48px" width="48px" circlewidth="64px" circleheight="64px"/>
              </StatisticsCard>
              <StatisticsCard header="Packets received since connected" unit=""
                :value="packetStore.getPacketCount().toString()" 
              >
                <PacketIcon background="#0B132F" fill="#0654EF" height="48px" width="48px" circlewidth="64px" circleheight="64px"/>
              </StatisticsCard>
              <StatisticsCard header="Packets per second" unit=""
                :value="pps.toString()" 
              >
                <PacketIcon background="#0B132F" fill="#0654EF" height="48px" width="48px" circlewidth="64px" circleheight="64px"/>
              </StatisticsCard>
          </div>
          <div class="flex m-auto w-[70%]">

              <StatisticsCard header="Laser Status" unit=""
                :value="laserState" 
              >
                <LaserBeamIcon background="#0B132F" fill="#0654EF" height="48px" width="48px" circlewidth="64px" circleheight="64px"/>
              </StatisticsCard>

              <StatisticsCard header="Microwave Status" unit=""
                :value="laserState" 
              >
                <MicrowaveIcon background="#0B132F" fill="#0654EF" height="48px" width="48px" circlewidth="64px" circleheight="64px"/>
              </StatisticsCard>

              <StatisticsCard header="Laser Power" unit="%"
                :value=laserStrength
                info="The higher the laser power, the more power is being emitted from the laser, resulting in a higher intensity of led right emitted by the diamond."

              >
                <LaserBeamIcon background="#0B132F" fill="#0654EF" height="48px" width="48px" circlewidth="64px" circleheight="64px"/>
              </StatisticsCard>

              <StatisticsCard header="Attenuation" unit="%"
                :value="attenuationStrength.toFixed(2)" 
                info="The larger the attenuation, the less power is transmitted by the microwave system, resulting in a less defined ODMR signal."

              >
                <MicrowaveIcon background="#0B132F" fill="#0654EF" height="48px" width="48px" circlewidth="64px" circleheight="64px"/>
                
              </StatisticsCard>
              <StatisticsCard header="Measurements / packet" unit=""
                :value="packet!.info.deviceData.deviceSettings.averageOptical.toString()" 
                info="The amount of averages taken for the ODMR sample by the QUBE before sending a packet. The higher this value, the slower the amount of packets but the higher the resolution."
              >
                <MicrowaveIcon background="#0B132F" fill="#0654EF" height="48px" width="48px" circlewidth="64px" circleheight="64px"/>
              </StatisticsCard>
          </div>
      </div>   
    </div>
    <div class="w-[90%] m-auto my-12">
    </div>
  </div>
  <div v-else>
    <p> No connection omg help !!!</p>
  </div>
</div>
  <BottomFooter />
</template>

<style scoped>
h1 {
  font-family: space
}
</style>
