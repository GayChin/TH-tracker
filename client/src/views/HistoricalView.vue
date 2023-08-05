<script setup>
import { onMounted, ref } from 'vue';
import Content from '../components/Content.vue';
import LineChart from '../components/LineChart.vue'
import DropdownCheckbox from '../components/DropdownCheckbox.vue';
import DropdownRadio from '../components/DropdownRadio.vue';
import { objectToQueryString } from '../utils/api.js'
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';


const defaultTimeRange = '30d'
const defaultAgFunction = 'mean'

const historicalTemperatureData = ref([])
const historicalHumidityData = ref([])

const queryOptions = ref({
    field: [],
    location: [],
    timeRange: defaultTimeRange,
    agFunction: defaultAgFunction
})
const currentDropdown = ref(null);

const apiUrl = import.meta.env.VITE_API_URL
const timeSelected = ref({ name: 'Past 30 days', value: '30d' })

const LOCATION_OPTIONS = [{ name: 'Office 1', value: 'Office 1' }, { name: 'Office 2', value: 'Office 2' }, { name: 'Office 3', value: 'Office 3' }]
const TIME_OPTIONS = [{ name: 'Past 5 minutes', value: '5m' }, { name: 'Past 1 hour', value: '1h' }, { name: 'Past 6 hours', value: '6h' }, { name: 'Past 24 hours', value: '24h' }, { name: 'Past 30 days', value: '30d' }]
const AG_OPTIONS = [{ name: 'Mean', value: 'mean' }, { name: 'Median', value: 'median' }]

async function fetchHistoricalData(field) {
    const queryString = objectToQueryString({ ...queryOptions.value, field })
    try {
        const response = await fetch(`${apiUrl}?${queryString}`)
        const data = await response.json()
        switch (field) {
            case 'temperature':
                historicalTemperatureData.value = data;
                break;
            case 'humidity':
                historicalHumidityData.value = data;
                break;
            default:
                break;
        }
        currentDropdown.value = null;
    } catch (err) {
        console.error('Error fetching data: ', err)

    }
}

function handleUpdateOptions(newCheckedOptions, key) {
    console.log(newCheckedOptions)
    queryOptions.value[key] = newCheckedOptions;
    console.log(queryOptions.value)
}

function handleDropdownClick(dropdownName) {
    currentDropdown.value = dropdownName;
};

function fetchHistoricalDatas() {
    fetchHistoricalData('temperature')
    fetchHistoricalData('humidity')
    timeSelected.value = TIME_OPTIONS.filter((item) =>
        item.value === queryOptions.value.timeRange
    )[0]
}

onMounted(() => {
    fetchHistoricalDatas()
})


</script>


<template>
    <Content>

        <div class="flex flex-col gap-6 h-full">
            <ul class="list-none flex flex-row gap-6">
                <DropdownCheckbox title="Location" :options="LOCATION_OPTIONS" @updateOptions="handleUpdateOptions"
                    field="location" @dropdownClick="handleDropdownClick('location')"
                    :isOpen="currentDropdown === 'location'" />
                <DropdownRadio title="Time" :options="TIME_OPTIONS" @updateOptions="handleUpdateOptions" field="timeRange"
                    @dropdownClick="handleDropdownClick('timeRange')" :isOpen="currentDropdown === 'timeRange'"
                    defaultSelected="30d" />
                <DropdownRadio title="Aggregate By" :options="AG_OPTIONS" @updateOptions="handleUpdateOptions"
                    field="agFunction" @dropdownClick="handleDropdownClick('agFunction')"
                    :isOpen="currentDropdown === 'agFunction'" defaultSelected="mean" />
                <button type="button" @click="fetchHistoricalDatas"
                    class="text-gray-900 bg-white shadow-md  hover:bg-gray-100   font-medium rounded-2xl text-sm px-2 py-3 w-[80px]">Submit</button>
            </ul>
            <div class="text-xl font-bold text-primary">Temperature(°C) - {{ timeSelected.name }} </div>
            <div class="bg-white min-h-[500px] h-full rounded-3xl p-9 shadow-lg">
                <LineChart :data="historicalTemperatureData" chartId="historical-temperature-chart"
                    :timeSelected="timeSelected" />
            </div>
            <div class="text-xl font-bold text-primary">Humidity(g/m3) - {{ timeSelected.name }} </div>
            <div class="bg-white min-h-[500px] h-full rounded-3xl p-9 shadow-lg">
                <LineChart :data="historicalHumidityData" chartId="historical-humidity-chart"
                    :timeSelected="timeSelected" />
            </div>
        </div>
    </Content>
</template>


<style scoped></style>