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
      <div class="w-[90%] m-auto py-5 min-w-[196px] px-5 h-[128px]">
        <div class="text-white font-3xl">
            <div class="m-auto">
               <div class=" py-5 flex">
                  <div class="">
                    <slot />
                  </div>
                  <div class="text-white text-center m-auto min-w-[50%]">
                      <h2 class="text-left"> {{ value}} {{ unit }}</h2>
                      <h1 class="text-left min-w-[50%] "> {{ header }} </h1>
                  </div>
                </div>
            </div>
            <div>
              <p class="text-justify"> {{ info }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
p {
  font-size: 12px;
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