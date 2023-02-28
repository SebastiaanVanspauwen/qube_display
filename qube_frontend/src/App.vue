<script setup lang="ts">
import type { Engine } from 'tsparticles-engine'
import { loadFull } from 'tsparticles'
import { useConnectionStore } from '@/stores/connection.store'

const connectionStore = useConnectionStore()

onMounted(() => {
  connectionStore.heartbeat()
})

const options = {
  background: {
    color: {
      value: 'white'
    }
  },
  fpsLimit: 20,
  interactivity: {
    modes: {
      bubble: {
        distance: 400,
        duration: 0.2,
        opacity: 0.8,
        size: 40,
        speed: 0.2
      },
      push: {
        quantity: 4
      },
      repulse: {
        distance: 200,
        duration: 0.4
      }
    }
  },
  particles: {
    color: {
      value: '#0e47a1'
    },
    links: {
      color: '#0e47a1',
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1
    },
    collisions: {
      enable: false
    },
    move: {
      direction: 'none',
      enable: true,
      outMode: 'bounce',
      random: false,
      speed: 1,
      straight: false
    },
    number: {
      density: {
        enable: true,
        value_area: 800
      },
      value: 80
    },
    opacity: {
      value: 1
    },
    shape: {
      type: 'circle'
    },
    size: {
      random: true,
      value: 3
    }
  },
  detectRetina: true
}
const particlesInit = async (engine: Engine) => {
  await loadFull(engine)
}
</script>

<template>
  <RouterView class="relative z-50" />
  <Particles
    id="tsparticles"
    :options="options"
    :particles-init="particlesInit"
  />
</template>

<style>
@import "@/assets/tailwind.css";

@font-face {
    font-family: space;
    src: url('@/fonts/spaceheavy.otf');
    font-weight: bold;
}

html, body {
  background-color: #030B2B;
  height: 100%;
  min-width: 780px;
  overflow-y: hidden;
}
</style>
