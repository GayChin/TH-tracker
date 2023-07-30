<script setup>
import { onMounted, ref } from "vue";

const prop = defineProps({
    title: {
        type: String,
        required: true,
    },
    options: {
        type: Array,
        required: true,
    },
    field: {
        type: String,
        required: true
    }
});

const dropdownIsOpen = ref(false);
const optionsCheckedCount = ref(0);
const optionsChecked = ref([]);
const emit = defineEmits(['updateOptions'])

function handleCheckboxChange(item) {
    optionsCheckedCount.value = optionsChecked.value.length
    console.log(prop.field)
    emit('updateOptions', optionsChecked.value, prop.field)
}

onMounted(() => console.log(prop.options));
</script>

<template>
    <div>
        <button @click="() => (dropdownIsOpen = !dropdownIsOpen)"
            class="text-white bg-primary hover:bg-main-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center hover:brightness-110"
            :class="dropdownIsOpen ? 'ring-secondary ring-4' : ''" type="button">
            {{ title
            }}
            <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 4 4 4-4" />
            </svg>
            <div class="ml-2.5 bg-secondary text-primary font-bold w-5 h-5 rounded-full flex flex-row justify-center"
                :class="optionsCheckedCount === 0 ? 'hidden' : ''">
                {{ optionsCheckedCount }}
            </div>
        </button>

        <!-- Dropdown menu -->
        <div class="z-10 w-48bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 absolute bg-white mt-2"
            :class="dropdownIsOpen ? '' : 'hidden'">
            <ul class="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200">
                <li v-for="(option, index) in options" :key="index">
                    <div class="flex items-center">
                        <input id="checkbox-item-1" type="checkbox" :value="option.value" v-model="optionsChecked"
                            @change="handleCheckboxChange(option)"
                            class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-main-500 dark:focus:ring-main-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                        <label for="checkbox-item-1" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{
                            option.name }}</label>
                    </div>
                </li>
                <!-- <li>
                <div class="flex items-center">
                    <input id="checkbox-item-3" type="checkbox" value=""
                        class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-main-500 dark:focus:ring-main-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                    <label for="checkbox-item-3" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Default
                        checkbox</label>
                </div>
        </li> -->
            </ul>
        </div>
    </div>
</template>

<style scoped></style>
