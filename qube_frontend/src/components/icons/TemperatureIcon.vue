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
      <path d="M15.7 13.468V5.66796C15.7 3.66796 14.1 1.96796 12 1.96796C11 1.96796 10.1 2.36796 9.4 3.06796C8.7 3.76796 8.3 4.66796 8.3 5.66796V13.468C6.8 14.568 6 16.268 6 18.068C6 21.268 8.7 23.968 12 23.968C15.3 23.968 18 21.268 18 18.068C18 16.268 17.2 14.568 15.7 13.468ZM12 21.968C9.8 21.968 8 20.168 8 18.068C8 16.768 8.7 15.568 9.8 14.768C10.1 14.568 10.3 14.268 10.3 13.968V5.66796C10.3 5.26796 10.5 4.76796 10.8 4.46796C11.1 4.16796 11.5 3.96796 12 3.96796C13 3.96796 13.7 4.76796 13.7 5.66796V13.968C13.7 14.268 13.9 14.668 14.2 14.768C15.3 15.468 16 16.668 16 18.068C16 20.168 14.2 21.968 12 21.968Z" />
      <path d="M12 20.968C13.6016 20.968 14.9 19.6696 14.9 18.068C14.9 16.4663 13.6016 15.168 12 15.168C10.3984 15.168 9.10001 16.4663 9.10001 18.068C9.10001 19.6696 10.3984 20.968 12 20.968Z" />
    </svg>
  </div>
</template>
