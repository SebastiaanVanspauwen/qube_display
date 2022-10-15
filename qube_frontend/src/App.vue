<script setup lang="ts">
import { usePacketStore } from '@/stores/packet.store'

let connection: WebSocket

const packetStore = usePacketStore()

onMounted(() => {
  connection = new WebSocket("ws://localhost:9000");

  connection.onopen = () => {
    console.log("Connected to server");
  }

  connection.onmessage = (message: any) => {
    packetStore.setPacket(JSON.parse(message.data))
  }
})

</script>

<template>
  <router-view />
  <div id="modal-teleport" />
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
}
</style>
