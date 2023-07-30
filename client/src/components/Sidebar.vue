<script setup>
import SidebarItem from './SidebarItem.vue'



</script>

<template>
    <div class="bg-[#343951] text-white min-w-[280px] w-[280px] flex flex-col rounded-l-lg py-8">
        <div class="flex flex-row p-3 items-center justify-center">
            <img alt="Thermostats Logo" class="w-[100px] h-[auto]" src="@/assets/logo.png" />
            <div class="text-3xl font-extrabold">TH
                <br>
                Tracker
            </div>
        </div>
        <br>
        <br>
        <div class="flex flex-col gap-4 items-end ">
            <SidebarItem itemName="Historical Data" itemPath="/" :itemIcon="['fas', 'clock-rotate-left']" />
            <SidebarItem itemName="Realtime Data" itemPath="/realtime" :itemIcon="['fas', 'signal']" />
        </div>
    </div>
</template>


<style scoped></style>