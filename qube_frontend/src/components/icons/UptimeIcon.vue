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
    default: '48px'
  },
  height: {
    type: String,
    required: false,
    default: '48px'
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
      :width="width"
      :height="height"
      viewBox="0 0 24 24"
      :fill="fill"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 22.312C6.5 22.312 2 17.812 2 12.312C2 6.81201 6.5 2.31201 12 2.31201C17.5 2.31201 22 6.81201 22 12.312C22 17.812 17.5 22.312 12 22.312ZM12 4.31201C7.6 4.31201 4 7.91201 4 12.312C4 16.712 7.6 20.312 12 20.312C16.4 20.312 20 16.712 20 12.312C20 7.91201 16.4 4.31201 12 4.31201Z" />
      <path d="M16.9 13.312H12C11.4 13.312 11 12.912 11 12.312V7.41202C11 6.81202 11.4 6.41202 12 6.41202C12.6 6.41202 13 6.81202 13 7.41202V11.312H16.9C17.5 11.312 17.9 11.712 17.9 12.312C17.9 12.912 17.5 13.312 16.9 13.312Z" />
    </svg>
  </div>
</template>
