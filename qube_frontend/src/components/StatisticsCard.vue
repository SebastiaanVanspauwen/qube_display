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
    default: 0
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
  },
})

</script>

<template>
      <div class="w-[90%] m-auto py-5">
        <div class="text-white font-3xl">
            <div class="flex justify-between">
               <div class=" py-5 flex">
                  <div class="">
                    <slot />
                  </div>
                  <div class="text-white text-center px-4">
                      <h2 class="text-center"> {{ value}} {{ unit }}</h2>
                      <h1 class="text-center"> {{ header }} </h1>
                  </div>
                </div>
            </div>
        </div>
        <div class="text-white text-sm">
            <p> {{ info }}</p>
        </div>
    </div>
</template>

<style scoped>
.svg img {
    fill: #ffffff;
    stroke: #ffffff; 
}
h1 {
    font-size: 0.75rem;
    color:#ffffff
}
h2 {
    font-size: 1.5rem;
    color:#ffffff;
    font-weight: 700;
}
</style>