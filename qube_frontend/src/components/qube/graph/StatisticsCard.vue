<script setup lang="ts">
defineProps({
  header: {
    type: String,
    required: true,
    default: 'Label'
  },
  value: {
    type: String,
    required: true,
    default: '0'
  },
  unit: {
    type: String,
    required: true,
    default: ''
  },
  info: {
    type: String,
    required: false,
    default: ''
  }
})
</script>

<template>
  <div class="bg-red h-[128px] m-auto min-w-[196px] px-5 py-5 w-[90%]">
    <div class="font-3xl text-white">
      <div class="m-auto">
        <div class="flex py-5">
          <div class="">
            <slot />
          </div>
          <div class="m-auto min-w-[50%] text-center text-white">
            <h2 class="text-left">
              {{ value }} {{ unit }}
            </h2>
            <h1 class="min-w-[50%] text-left">
              {{ header }}
            </h1>
          </div>
        </div>
      </div>
      <div>
        <p class="text-justify">
          {{ info }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail {
  font-size: 12px;
  font-family: 'Courier New', Courier, monospace;
}
h1 {
    font-size: 0.85rem;
    color:#ffffff
}
h2 {
    font-size: 1.5rem;
    color:#ffffff;
    font-weight: 700;
}
</style>
