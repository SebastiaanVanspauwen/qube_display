<script setup lang="ts">
const props = defineProps({
  href: { type: String, required: true }
})
</script>

<template>
  <div class="hover:cursor-pointer hover:scale-150 transform transition-all">
    <a
      :href="props.href"
      target="_blank"
      rel="noopener noreferrer"
    >
      <slot />
    </a>
  </div>
</template>