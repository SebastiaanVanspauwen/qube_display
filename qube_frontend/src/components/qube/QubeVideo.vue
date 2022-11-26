<script setup lang="ts">
const counter = ref(0)
let timer: NodeJS.Timer

onMounted(() => {
  timer = setInterval(() => {
    counter.value++
  }, 2000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const dots = computed(() => {
  return '_ '.repeat((counter.value % 4) + 1)
})
</script>

<template>
  <div class="h-full m-auto text-center w-[780px]">
    <!--
      <video
      autoplay
      loop
      >
      <source
      src="https://rotato.netlify.app/alpha-demo/movie-hevc.mov"
      type="video/mp4; codecs=hvc1"
      >
      <source
      src="https://rotato.netlify.app/alpha-demo/movie-webm.webm"
      type="video/webm"
      >
      Sorry, your browser doesn't support embedded videos.
      </video>
    -->
    <div class="text-centered">
      <h1 class="text-4xl">
        The QUBE is currently disconnected
      </h1>
      <p> Attempting to re-establish {{ dots }}</p>
    </div>
  </div>
</template>

<style scoped>
h1, h2, p {
  font-family: space, sans-serif;
}
</style>
