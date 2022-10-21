<script setup lang="ts">
import { useConnectionStore } from '@/stores/connection.store';
import { usePacketStore } from '@/stores/packet.store'
import { QUBEPacket } from '@/types/packet.type';
import * as echarts from 'echarts'
import moment from 'moment'
import MainLayout from '../layouts/MainLayout.vue';

// const packetStore = usePacketStore()
// const packet = packetStore.packet
const connectionStore = useConnectionStore()

</script>

<template>
    <MainLayout>
      <div class="text-white m-auto">
        <div v-if="!connectionStore.isConnected">
          <div class="m-auto">
            <OscarVideo />
          </div>
        </div>
        <div v-else>
          <p> Disconnected</p>
        </div>
      </div>
    </MainLayout>
</template>

<style scoped>
h1 {
  font-family: space
}
</style>
