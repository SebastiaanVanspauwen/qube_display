<script setup lang="ts">
import { usePacketStore } from '@/stores/packet.store'
import { Box, Camera, LambertMaterial, PointLight, Renderer, Scene } from 'troisjs'

let connection: WebSocket

const packetStore = usePacketStore()

onMounted(() => {
  connection = new WebSocket("ws://localhost:9000");

  connection.onopen = () => {
    console.log("Connected to server");
    console.log(connection.url);
  }

  connection.onmessage = (message: any) => {
    console.log(message)
    packetStore.setPacket(JSON.parse(message.data))
  }
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
