<script setup lang="ts">
import { usePacketStore } from '@/stores/packet.store'
import { useConnectionStore } from '@/stores/connection.store'


const packetStore = usePacketStore()
const connectionStore = useConnectionStore()


onMounted(() => {
  connectionStore.heartbeat()
})

</script>

<template>
  <router-view />
</template>

<style>
@font-face {
    font-family: space;
    src: url('~@/assets/fonts/A-SPACEHEAVY.otf');
}
@import "@/assets/tailwind.css";
html, body {
  background-color: #030B2B;
  height: 100%;
  min-width: 780px;
}
</style>
