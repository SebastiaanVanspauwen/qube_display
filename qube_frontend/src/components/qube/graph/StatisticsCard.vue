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
    required: false,
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
  <div class="m-auto min-w-[196px] text-center">
    <div class="flex flex-row py-5">
      <div class="">
        <slot />
      </div>
      <div class="bg-primary_darkblue opacity-80 px-2 text-center text-white">
        <h2 class="text-left">
          <p> {{ value }} {{ unit }} </p>
        </h2>
        <h1 class="text-left">
          {{ header }}
        </h1>
      </div>
    </div>

    <!-- Info Card -->
    <div>
      <p class="text-justify">
        {{ info }}
      </p>
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
