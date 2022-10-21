<script setup lang="ts">
import MainLayout from '../layouts/MainLayout.vue'
import { useConnectionStore } from '@/stores/connection.store'
import { usePacketStore } from '@/stores/packet.store'

const connectionStore = useConnectionStore()
const packetStore = usePacketStore()

onMounted(() => {
  packetStore.calculatePPS()
})
</script>

<template>
  <MainLayout>
    <div class="m-auto text-white">
      <div
        v-if="connectionStore.isConnected"
        class="absolute flex h-[100%] items-center justify-center w-[100%]"
      >
        <QubeDisplay />
      </div>
      <div v-else>
        <div class="flex m-auto">
          <QubeVideo />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
h1 {
  font-family: space
}
</style>
