<script setup>
import { useRoute } from 'vue-router'
import { watch, ref } from 'vue'

const prop = defineProps({
  itemName: {
    type: String,
    required: true
  },
  itemPath: {
    type: String,
    required: true
  },
  itemIcon: {
    type: [String],
    required: true
  },
})

const route = useRoute();
const currentPath = ref(route.path)
const pathIsMatched = ref(prop.itemPath === route.path)

watch(() => route.path, (newPath) => {
  currentPath.value = newPath;
  pathIsMatched.value = prop.itemPath === newPath
})

const selectedSidebarItemStyle = 'text-secondary bg-[#f5f6fb] font-bold'
const defaultSidebarItemStyle = 'text-white font-bold'


</script>

<template>
  <router-link class="relative text-xl flex flex-row gap-4 items-center w-[80%] justify-center py-3 rounded-l-[40px]"
    :class="pathIsMatched ? selectedSidebarItemStyle : defaultSidebarItemStyle" :to=itemPath>
    <div :class="pathIsMatched ? 'absolute bg-[#f5f6fb] h-6 w-full -top-6 right-0' : 'hidden'"></div>
    <div :class="pathIsMatched ? 'absolute bg-[#343951] h-6 w-full -top-6 right-0 rounded-br-[100px]' : 'hidden'"></div>
    <font-awesome-icon :icon=itemIcon />
    <p>{{ itemName }}</p>
    <div :class="pathIsMatched ? 'absolute bg-[#f5f6fb] h-6 w-full -bottom-6 right-0' : 'hidden'"></div>
    <div :class="pathIsMatched ? 'absolute bg-[#343951] h-6 w-full -bottom-6 right-0 rounded-tr-[100px]' : 'hidden'">
    </div>
  </router-link>
</template>


<style scoped></style>