<script setup>
import Chart from 'chart.js/auto';
import { onMounted } from 'vue';

const prop = defineProps({
    data: {
        type: Array,
        required: true
    },
})

const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
    }]
}

const config = {
    type: 'line',
    data: data,
    options: {}
}

onMounted(() => {
    new Chart(document.getElementById('myChart'), config);
})

</script>

<template>
    <canvas id="myChart" height="40px" width="40px"></canvas>
</template>


<style scoped></style>