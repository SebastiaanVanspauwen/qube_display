<script setup lang="ts">
import { useConnectionStore } from '@/stores/connection.store';

const connectionStore = useConnectionStore()

</script>


<template>
    <div class="w-full justify-center m-auto flex">
        <FPSCounter />
        <div class="m-auto flex my-8">
            <ConnectionStatus 
            :enabled="connectionStore.isConnected"
            />
        </div>
    </div>
</template>