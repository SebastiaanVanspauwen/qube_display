<script setup lang="ts">
import { useConnectionStore } from '@/stores/connection.store';

const connectionStore = useConnectionStore()

</script>

<template>
    <div class="h-[128px] w-full ">
        <CompanyLogo class="absolute left-0 top-0 w-[256px]"/>
        <div class="flex flex-col text-center justify-center my-auto">
            <h1 class="h-[128px] w-full pt-8 text-white font-bold text-5xl"> OSCAR-QUBE Display </h1>
        </div>
        <InfoBox class="absolute right-0 top-0 w-[256px] h-[128px]" />
    </div>
</template>