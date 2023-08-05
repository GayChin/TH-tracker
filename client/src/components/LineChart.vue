<script setup>
import Chart from 'chart.js/auto';
import { onMounted, watch, ref } from 'vue';




const prop = defineProps({
    data: {
        type: Array,
        required: true
    },
    chartId: {
        type: String,
        required: true
    },
    timeSelected: {
        type: String,
        required: true
    }
})

const data = {
    datasets: [{
        data: prop.data,
        parsing: {
            xAxisKey: 'timestamp',
            yAxisKey: 'value'
        }
    }]
}

const plugin = {
    beforeInit(chart) {
        // Get reference to the original fit function
        const originalFit = chart.legend.fit;

        // Override the fit function
        chart.legend.fit = function fit() {
            // Call original function and bind scope in order to use `this` correctly inside it
            originalFit.bind(chart.legend)();
            // Change the height as suggested in another answers
            this.height += 30;
        }
    }
}
const config = ref({
    type: 'line',
    data: data,
    label: [],
    options: {
    },
    plugins: [plugin],
})

let chart;

onMounted(() => {
    chart = new Chart(document.getElementById(prop.chartId), config.value)
})


watch(() => prop.data, (newPropData) => {
    console.log('prop : ', newPropData)

    const newData = newPropData.map(data => {
        if (data.length === 0) {
            return undefined;
        }
        return {
            label: data[0].location,
            data: data,
            parsing: {
                xAxisKey: 'timestamp',
                yAxisKey: 'value'
            }
        }
    }).filter((data) => data !== undefined);

    // console.log(newData)
    let unit;
    let stepSize;
    switch (prop.timeSelected.value) {
        case '5m':
            unit = 'second'
            stepSize = '10'
            break;
        case '1h':
            unit = 'minute'
            stepSize = '1'
            break;
        case '6h':
            unit = 'minute'
            stepSize = '5'
            break;
        case '24h':
            unit = 'minute'
            stepSize = '15'
            break;
        case '30d':
            unit = 'hour'
            stepSize = '1'
            break;
        default:
            break;
    }

    const newOptions = {
        plugins: {
            legend: {
                display: true,
                labels: {
                    usePointStyle: true,
                    font: {
                        size: 15
                    },
                },
                position: 'top',
                align: 'start',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                position: 'nearest',
                backgroundColor: 'rgba(0,0,0,0.6)',
                titleMarginBottom: 10,
                titleFont: {
                    size: '16px'
                },
                bodyFont: {
                    size: 14
                },
                bodySpacing: 10,
            },
        },
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit
                },
                ticks: {
                    stepSize
                }
            }
        }
    }


    config.value = { ...config.value, data: { datasets: newData }, options: newOptions }
    if (chart) {
        chart.destroy()
        console.log('chart is destroyed! new value is : ', config.value.data)
        chart = new Chart(document.getElementById(prop.chartId), config.value)
        // chart.Legend.prototype.afterFit = function () {
        //     this.height = this.height + 50;
        // };
    }

})



</script>

<template>
    <canvas :id="prop.chartId" height="40px" width="40px"></canvas>
</template>


<style scoped></style>