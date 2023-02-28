<script setup lang="ts">
defineProps({
  background: {
    type: String,
    required: false,
    default: '#030B2B'
  },
  fill: {
    type: String,
    required: false,
    default: '#025BF9'
  },
  width: {
    type: String,
    required: false,
    default: '32px'
  },
  height: {
    type: String,
    required: false,
    default: '32px'
  },
  circlewidth: {
    type: String,
    required: false,
    default: '64px'
  },
  circleheight: {
    type: String,
    required: false,
    default: '64px'
  }
})
</script>

<template>
    <img
      src='./microwave.png'
      :style="{ 'background-color': background, 'width': circlewidth, 'height': circleheight}"
      class="flex items-center justify-center select-none"
    />
</template>
