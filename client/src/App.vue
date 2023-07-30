<script setup>

import { RouterLink, RouterView } from 'vue-router'
import Sidebar from './components/Sidebar.vue';
</script>

<template>
  <div class="p-12 flex flex-row flex-1 bg-[#d5daed] w-screen h-screen box-border">
    <Sidebar/>
    <RouterView/>
  </div>
</template>

<style scoped>
</style>
