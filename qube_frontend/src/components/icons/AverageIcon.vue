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
  <div
    :style="{ 'background-color': background, 'width': circlewidth, 'height': circleheight}"
    class="flex items-center justify-center rounded-full select-none"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      :fill="fill"
    >
      <path
        d="M 6.2890625 3.0039062 L 1.1640625 7.6289062 A 0.50005 0.50005 0 0 0 1.1640625 8.3710938 L 6.2890625 12.996094 L 6.9609375 12.253906 L 2.2480469 8 L 6.9609375 3.7460938 L 6.2890625 3.0039062 z M 9.7109375 3.0039062 L 9.0390625 3.7460938 L 13.751953 8 L 9.0390625 12.253906 L 9.7109375 12.996094 L 14.835938 8.3710938 A 0.50005 0.50005 0 0 0 14.835938 7.6289062 L 9.7109375 3.0039062 z"
        font-weight="400"
        font-family="sans-serif"
        white-space="normal"
        overflow="visible"
      />
    </svg>
  </div>
</template>
