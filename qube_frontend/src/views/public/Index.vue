<script setup lang="ts">
import { usePacketStore } from '@/stores/packet.store'
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

const to2DArray = computed(() => {
  if (packet === undefined) return

  const odmr = packet.value!.data.measurement.ODMR

  return Array.from({ length: packet.value!.info.microwaveData.steps }, (_, i) => [microwaveRange.value![i], odmr[i]])
})

const uptime = computed(() => {
  if (packet === undefined) return

  return moment.utc(packet.value!.info.deviceData.system.systemTickCount).format('HH:mm:ss')
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
let tempChart: echarts.ECharts

onMounted(() => {
  odmrChart = echarts.init(document.getElementById('odmr') as HTMLDivElement)
  setInterval(() => {
    odmrChart.setOption({
    xAxis: {
      type: 'value',
      min: microwaveRange.value![0] - 20,
      max: microwaveRange.value![microwaveRange.value!.length - 1] + 20,
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
      min: Math.min(...packet.value!.data.measurement.ODMR) - 40,
      max: Math.max(...packet.value!.data.measurement.ODMR) + 40,
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
      data: to2DArray.value,
      type: 'line',
      showSymbol: false,
      smooth: true,
      lineStyle: {
        color: '#025BF9',
        width: 5
      },
    }]
  })
  }, 20)

  tempChart = echarts.init(document.getElementById('temp') as HTMLDivElement)
  const maxArrayLength = packetStore.getMaxArrayLength()
  setInterval(() => {
    tempChart.setOption({
    xAxis: {
      type: 'value',
      min: 0,
      max: maxArrayLength,
      axisLine: {
        lineStyle: {
          color: '#ffff'
        },
        show: false
      },
      axisLabel: {
        fontSize: 16
      },
    },
    yAxis: {
      type: 'value',
      name: 'Temperature (°C)',
      min: Math.min(Math.min(...packetStore.getReferenceTemperature()), ...packetStore.getLaserTemperature()) - 5,
      max: Math.max(Math.max(...packetStore.getReferenceTemperature()), ...packetStore.getLaserTemperature()) + 5,
      axisLine: {
        lineStyle: {
          color: '#ffff'
        },
        show: false
      },
      axisLabel: {
        fontSize: 16
      },
    },
    series: [
      {
        data: fromSingleArray(packetStore.getReferenceTemperature()),
        type: 'line',
        color: '#F2085D',
        showSymbol: false,
        smooth: true,
        // set label
        endLabel: {
          show: true,
          valueAnimation: true,
          formatter: packetStore.getReferenceTemperature().slice(-1) + '°C',
          color: '#F2085D',
          fontSize: 12,
        },
      },
      {
        data: fromSingleArray(packetStore.getLaserTemperature()),
        type: 'line',
        color: '#00B849',
        showSymbol: false,
        smooth: true,
        endLabel: {
          show: true,
          valueAnimation: true,
          formatter: packetStore.getLaserTemperature().slice(-1) + '°C',
          color: '#00B849',
          fontSize: 12
        },
      },     
    ]
  })
  }, 20)

  const laserPotentiometer = echarts.init(document.getElementById('laserpot') as HTMLDivElement)
  setInterval(() => {
    laserPotentiometer.setOption({
  series: [
    {
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 1023,
      max: 0,
      splitNumber: 4,
      splitLine: {
        show: false
      },
      itemStyle: {
        color: '#58D9F9',
        shadowColor: 'rgba(0,138,255,0.45)',
        shadowBlur: 10,
        shadowOffsetX: 2,
        shadowOffsetY: 2
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: '12%',
        width: 12,
        offsetCenter: [0, '-60%'],
        itemStyle: {
          color: 'auto'
        }
      },
      axisLine: {
        lineStyle: {
          width: 6,
          color: [
            // green hex
            [0.15, '#006B3D'],
            [0.30, '#069C56'],
            [0.5, '#FF980E'],
            [0.75, '#FF681E'],
            [1.05, '#D3212C'],

          ]
        }
      },
      axisLabel: {
        show: false
      },
      axisTick: {
        length: 2,
        lineStyle: {
          color: 'auto',
          width: 2
        }
      },
      title: {
        offsetCenter: [0, '30%'],
        fontSize: 12,
        color: '#ffff',
        fontWeight: 'bold'
      },
      detail: {
        fontSize: 12,
        offsetCenter: [0, '-35%'],
        valueAnimation: true,
        formatter: function (value: number) {
          return Math.round(value);
        },
        color: 'auto'
      },
      data: [
        {
          value: (packet.value?.info.laserData.potentiometerValue ?? 0),
          name: 'Potentiometer'
        },
      ]
    }
  ]
})
  }, 1000)


  const microwaveAttenuation = echarts.init(document.getElementById('attenuation') as HTMLDivElement)
  setInterval(() => {
    microwaveAttenuation.setOption({
  series: [
    {
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 63,
      max: 0,
      splitNumber: 4,
      splitLine: {
        show: false
      },
      itemStyle: {
        color: '#58D9F9',
        shadowColor: 'rgba(0,138,255,0.45)',
        shadowBlur: 10,
        shadowOffsetX: 2,
        shadowOffsetY: 2
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: '12%',
        width: 12,
        offsetCenter: [0, '-60%'],
        itemStyle: {
          color: 'auto'
        }
      },
      axisLine: {
        lineStyle: {
          width: 6,
          color: [
            // green hex
            [0.15, '#006B3D'],
            [0.30, '#069C56'],
            [0.5, '#FF980E'],
            [0.75, '#FF681E'],
            [1.05, '#D3212C'],

          ]
        }
      },
      axisLabel: {
        show: false
      },
      axisTick: {
        length: 2,
        lineStyle: {
          color: 'auto',
          width: 2
        }
      },
      title: {
        offsetCenter: [0, '30%'],
        fontSize: 12,
        color: '#ffff',
        fontWeight: 'bold'
      },
      detail: {
        fontSize: 12,
        offsetCenter: [0, '-35%'],
        valueAnimation: true,
        formatter: function (value: number) {
          return Math.round(value);
        },
        color: 'auto'
      },
      data: [
        {
          value: (packet.value?.info.microwaveData.attenuation ?? 0),
          name: 'Attenuation'
        },
      ]
    }
  ]
})
  }, 1000)
})

window.onresize = () => {
  odmrChart.resize()
  tempChart.resize()
}

</script>

<template>
  <div class="min-h-[64px] h-[64px] text-center flex">
    <CompanyLogo class="absolute flex h-[64px]" />
    <h1 class="flex m-auto text-center py-10 text-white font-bold text-5xl"> OSCAR-QUBE Display </h1>
    <FPSCounter />
  </div>
  <div class="w-[80%] m-auto my-12 flex justify-center">
    <div>
      <div class="m-auto flex min-w-[50%]">
        <ConnectionStatus 
          label="CONNECTED"
          :enabled="packet?.info.deviceData.connectionStatus.hasConnection !== 0"
        />
        <ConnectionStatus class=""
          label="LASER"
          :enabled="packet?.info.laserData.status"
        />
        <ConnectionStatus 
          label="MICROWAVE"
          :enabled="packet?.info.microwaveData.attenuation !== 0"
        />
        <ConnectionStatus 
          label="MW ATTENUATION"
          :enabled="packet?.info.microwaveData.attenuation !== 0"
        />
      </div>
      <div class=" flex min-w-[50%] justify-center">
          <div id="laserpot" class="w-[128px] h-[128px]"></div>     
          <div id="attenuation" class="w-[128px] h-[128px]"></div>   
      </div>
    </div>
    <div class="w-[50%] block justify-left p-5">
      <div class="w-[80%] m-auto p-5 h-full">
        <h3> System info: </h3>
        <p> Uptime: {{ uptime }} </p>
        <p> Last ping: {{ lastPing }} </p>
        <p> Packet count: {{ packetStore.getPacketCount() }}</p>
        <p> Packets/s: {{ packetStore.getPacketsPerSecond() }}</p>
        <p> Bandwidth (kbps): {{ (Number(packetStore.getPacketsPerSecond()) * 512) / 1024 }}</p>
        <p> Averages taken: {{ packet?.info.deviceData.deviceSettings.averageOptical }}</p>
      </div>
    </div>   
  </div>
  <div class="w-[95%] flex m-auto">
    <div id="odmr" class="min-w-[66%] w-[66%] min-h-[500px]"></div>
    <div id="temp" class=" min-w-[33%] min-h-[500px] mx-5"></div>
  </div>
  <BottomFooter />
</template>

<style scoped>
h1 {
  font-family: space
}
</style>
