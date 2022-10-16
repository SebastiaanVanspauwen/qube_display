<script setup lang="ts">
import { usePacketStore } from '@/stores/packet.store'
import { QUBEPacket } from '@/types/packet.type';
import * as echarts from 'echarts'
import moment from 'moment'

const packetStore = usePacketStore()

const packet = computed(() => packetStore.getPacket())

const microwaveRange = computed(() => {
  if (packet === undefined) return

  const step = packet.value!.info.microwaveData.steps
  const min = packet.value!.info.microwaveData.minimumFrequency
  const max = packet.value!.info.microwaveData.maximumFrequency

  return Array.from({ length: step + 1 }, (_, i ) => min + (max - min) / step * i)
})

function to2DArray (packet: QUBEPacket): Number[][] {
  const odmr = packet.data.measurement.ODMR.map(x => x / 1000)

  return Array.from({ length: packet.info.microwaveData.steps }, (_, i) => [microwaveRange.value![i], odmr[i]])
}

const uptime = computed(() => {
  if (packet === undefined) return

  return moment.utc(packet.value!.info.deviceData.system.systemTickCount).format('HH:mm:ss')
})

const laserStrength = computed(() => {
  return ((280 - packet.value!.info.laserData.potentiometerValue) / 280) * 100
})
const laserState = computed(() => {
  if (packet.value!.info.laserData.status == 1) {
    return 'ON'
  } else {
    return 'OFF'
  }
})

const pps = ref(0)
// Set interval every 1 second to calculate packets per second
const packetsPerSecondInterval = setInterval(async () => {
  const packets = packetStore.getPacketCount()

  // Wait for 1 second before calculating packets per second
  await new Promise(resolve => setTimeout(resolve, 1000))

  pps.value = packetStore.getPacketCount() - packets
}, 1000)

const attenuationStrength = computed(() => {
  return ((63 - packet.value!.info.microwaveData.attenuation) / 63) * 100
})

const lastPing = computed(() => {
  if (packet === undefined) return

  const now = Date.now() - packet.value!.info.deviceData.connectionStatus.lastPingTick

  return moment.utc(now + packet.value!.info.deviceData.connectionStatus.lastPingTick).format('YYYY:MM:DD HH:mm:ss')
})

function fromSingleArray (input: number[]): number[][] {
  const output: number[][] = []

  for (let i = 0; i < input.length; i += 1) {
    output.push([i, input[i]])
  }

  return output
}

let odmrChart: echarts.ECharts

onMounted(() => {
  odmrChart = echarts.init(document.getElementById('odmr') as HTMLDivElement)
  setInterval(() => {
    odmrChart.setOption({
    xAxis: {
      type: 'value',
      min: Math.round(microwaveRange.value![0] / 100) * 100,
      max: Math.round(microwaveRange.value![microwaveRange.value!.length - 1] / 100) * 100,
      data: microwaveRange,
      name: 'Microwave Frequency (MHz)',
      axisLine: {
        lineStyle: {
          color: '#ffff'
        },
        show: false
      },
      axisLabel: {
        fontSize: 16
      },
      nameLocation: 'middle',
      nameGap: 0,
      splitArea: {
        show: false
      },
      nameTextStyle: {
        /**
         * the top padding will shift the name down so that it does not overlap with the axis-labels
         * t-l-b-r
         */
        padding: [50, 0, 0, 0],
        fontSize: 16
      }
    },
    yAxis: {
      min: (Math.min(...packet.value!.data.measurement.ODMR.map(x => x / 1000)) - 0.015).toFixed(2),
      max: (Math.max(...packet.value!.data.measurement.ODMR.map(x => x / 1000)) + 0.015).toFixed(2),
      type: 'value',
      name: 'Voltage (V)',
      axisLine: {
        lineStyle: {
          color: '#ffff'
        },
      },
        // bigger font
      axisLabel: {
        fontSize: 16
      }
    },
    axisTick: {
        length: 12,
        lineStyle: {
          color: '#fff',
          width: 2
        }
      },
    series: [{
      data: to2DArray(packet.value!),
      type: 'line',
      showSymbol: false,
      smooth: true,
      lineStyle: {
        color: '#025BF9',
        width: 5
      },
    }
  ]
  })
  }, 20)
})

window.onresize = () => {
  odmrChart.resize()
}

</script>

<template>
  <div class="min-h-[1200px]">
  <div class="min-h-[64px] h-[64px] text-center flex">
    <CompanyLogo class="absolute flex h-[78px]" />
    <h1 class="flex m-auto text-center py-10 text-white font-bold text-5xl"> OSCAR-QUBE Display </h1>
    <FPSCounter />
  </div>
  <div class="w-[100%] m-auto flex justify-center">
      <div class="w-[90%] py-8 px-[100px]">
        <div class="flex m-auto w-[70%]">
            <StatisticsCard header="Laser" unit="°C"
              :value="packet!.info.laserData.temperature.toFixed(2)" 
            >
              <TemperatureIcon background="#0B132F" fill="#0654EF" height="48px" width="48px" circlewidth="64px" circleheight="64px"/>
            </StatisticsCard>

            <StatisticsCard header="Board" unit="°C"
              :value="packet!.data.referenceTemp.referenceTemperature.toFixed(2)" 
            >
              <TemperatureIcon background="#0B132F" fill="#0654EF" height="48px" width="48px" circlewidth="64px" circleheight="64px"/>
            </StatisticsCard>

            <StatisticsCard header="Uptime" unit=""
              :value="uptime" 
            >
              <UptimeIcon background="#0B132F" fill="#0654EF" height="48px" width="48px" circlewidth="64px" circleheight="64px"/>
            </StatisticsCard>
            <StatisticsCard header="Packets received" unit=""
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
            <StatisticsCard header="Laser Power" unit="%"
              :value="laserStrength.toFixed(2)" 
            >
              <LaserBeamIcon background="#0B132F" fill="#0654EF" height="48px" width="48px" circlewidth="64px" circleheight="64px"/>
            </StatisticsCard>

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

            <StatisticsCard header="Attenuation" unit="%"
              :value="attenuationStrength.toFixed(2)" 
            >
              <MicrowaveIcon background="#0B132F" fill="#0654EF" height="48px" width="48px" circlewidth="64px" circleheight="64px"/>
            </StatisticsCard>
            <StatisticsCard header="Averaging" unit=""
              :value="packet!.info.deviceData.deviceSettings.averageOptical.toString()" 
            >
              <MicrowaveIcon background="#0B132F" fill="#0654EF" height="48px" width="48px" circlewidth="64px" circleheight="64px"/>
            </StatisticsCard>
        </div>
    </div>   
  </div>
  <div class="w-[90%] m-auto">
    <div id="odmr" class="min-w-[80%] m-auto w-[90%] min-h-[750px]"></div>
  </div>
</div>
  <BottomFooter />
</template>

<style scoped>
h1 {
  font-family: space
}
</style>
