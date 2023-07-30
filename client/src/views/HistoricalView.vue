<script setup>
import { onMounted, ref } from 'vue';
import Content from '../components/Content.vue';
import LineChart from '../components/LineChart.vue'
import DropdownCheckbox from '../components/DropdownCheckbox.vue';
import { objectToQueryString } from '../utils/api.js'

const historicalData = ref([])
const queryOptions = ref({
    field: [],
    location: [],
    timeRange: [],
    agFunction: []
})
const apiUrl = import.meta.env.VITE_API_URL

const FIELD_OPTIONS = [{ name: 'temperature', value: 'temperature' }, { name: 'humidity', value: 'humidity' }]
const LOCATION_OPTIONS = [{ name: 'Office 1', value: 'Office 1' }, { name: 'Office 2', value: 'Office 2' }, { name: 'Office 3', value: 'Office 3' }]
const TIME_OPTIONS = [{ name: 'Past 5m ', value: '5m' }, { name: 'Past 1h', value: '1h' }, { name: 'Past 6h', value: '6h' }, { name: 'Past 24h', value: '24h' }, { name: 'Past 30 days', value: '30d' }]
const AG_OPTIONS = [{ name: 'mean', value: 'mean' }, { name: 'median', value: 'median' }]

async function fetchHistoricalData() {
    const queryString = objectToQueryString(queryOptions.value)

    try {
        const response = await fetch(`${apiUrl}?${queryString}`)
        const data = await response.json()
        historicalData.value = data;
    } catch (err) {
        console.error('Error fetching data: ', err)

    }
}

function handleUpdateOptions(newCheckedOptions, key) {
    console.log(newCheckedOptions)
    queryOptions.value[key] = newCheckedOptions;
    console.log(queryOptions.value)
}

onMounted(() => {
    fetchHistoricalData()
})

</script>

<template>
    <Content>

        <div class="flex flex-col gap-6 h-full">
            <ul class="list-none flex flex-row gap-6">
                <DropdownCheckbox title="Field" :options="FIELD_OPTIONS" @updateOptions="handleUpdateOptions"
                    field="field" />
                <DropdownCheckbox title="Location" :options="LOCATION_OPTIONS" @updateOptions="handleUpdateOptions"
                    field="location" />
                <DropdownCheckbox title="Time" :options="TIME_OPTIONS" @updateOptions="handleUpdateOptions"
                    field="timeRange" />
                <DropdownCheckbox title="Aggregate By" :options="AG_OPTIONS" @updateOptions="handleUpdateOptions"
                    field="agFunction" />
                <button type="button" @click="fetchHistoricalData"
                    class="text-gray-900 bg-white shadow-md  hover:bg-gray-100   font-medium rounded-2xl text-sm px-2 py-3 w-[80px]">Submit</button>
            </ul>
            <div class="bg-white min-h-[500px] h-full rounded-3xl p-9 shadow-lg">
                <LineChart />
            </div>
        </div>
    </Content>
</template>


<style scoped></style>