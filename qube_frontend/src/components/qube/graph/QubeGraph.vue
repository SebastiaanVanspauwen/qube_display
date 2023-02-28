<script setup lang="ts">
import * as echarts from 'echarts'
import { usePacketStore } from '@/stores/packet.store'

const packetStore = usePacketStore()
let odmrChart: echarts.ECharts
onMounted(() => {
  odmrChart = echarts.init(document.getElementById('odmr') as HTMLDivElement)
  setInterval(() => {
    odmrChart.setOption({
      xAxis: {
        type: 'value',
        min: packetStore.getMinimumMicrowave,
        max: packetStore.getMaximumMicrowave,
        data: packetStore.getMicrowaveRange,
        name: 'Microwave Frequency (MHz)',
        // offset: 25,
        axisLine: {
          lineStyle: {
            color: '#ffff',
            width: 2
          }
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          fontSize: 16,
          formatter: function (value: number) {
            return value.toString().replace(',', '')
          }
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
          padding: [40, 0, 0, 0],
          fontSize: 30
        }
      },
      yAxis: {
        type: 'value',
        name: 'Voltage (V)',
        offset: 25,
        minInterval: 1,
        // fontsize of axis title
        nameTextStyle: {
          fontSize: 30
        },
        // amount of ticks on the
        minorTick: {
          show: true,
          splitNumber: 5
        },
        majorTick: {
          show: true,
          splitNumber: 1
        },
        min: packetStore.getMinimumODMR,
        max: packetStore.getMaximumODMR,
        splitLine: {
          lineStyle: {
            color: '#ffff',
            type: 'dashed',
            dashOffset: 5,
            width: 0.3
          },
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#ffff',
            width: 2
          }
        },
        // bigger font
        axisLabel: {
          fontSize: 16,
          formatter: function (value: number) {
            return value.toFixed(2)
          }
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
        data: packetStore.getMicrowaveRange,
        type: 'line',
        showSymbol: false,
        smooth: true,
        lineStyle: {
          color: '#025BF9',
          width: 5
        }
      }
      ]
    })
  }, 150)
})
/*
  window.onresize = (): void => {
    odmrChart.resize()
  }
*/
</script>

<template>
  <div class="bg-primary_darkblue flex m-auto my-12 opacity-90 w-[90%]">
    <div
      id="odmr"
      class="m-auto min-h-[850px] w-[100%]"
    />
  </div>
</template>
