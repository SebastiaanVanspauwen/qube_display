<script setup lang="ts">
import { usePacketStore } from '@/stores/packet.store'
import { useConnectionStore } from '@/stores/connection.store'


const packetStore = usePacketStore()
const connectionStore = useConnectionStore()

import type { Engine } from "tsparticles-engine"
import { loadFull } from "tsparticles"

const options = {
  background: {
    color: {
      value: "white",
    },
  },
  fpsLimit: 120,
  interactivity: {
    modes: {
      bubble: {
        distance: 400,
        duration: 0.2,
        opacity: 0.8,
        size: 40,
        speed: 0.2,
      },
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#0e47a1",
    },
    links: {
      color: "#0e47a1",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: false,
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        value_area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.2,
    },
    shape: {
      type: "circle",
    },
    size: {
      random: true,
      value: 5,
    },
  },
  detectRetina: true,
};
const particlesInit = async (engine: Engine) => {
  await loadFull(engine);
};

</script>

<template>
  <router-view class="z-50 relative"/>
  <Particles
      id="tsparticles"
      :options="options"
      :particlesInit="particlesInit"
    />
</template>

<style>
@font-face {
    font-family: space;
    src: url('@/fonts/spaceheavy.otf');
    font-weight: bold;
}
@import "@/assets/tailwind.css";

html, body {
  background-color: #030B2B;
  height: 100%;
  min-width: 780px;
}

h1, h2, p {
  font-family: space, sans-serif;
}
</style>
