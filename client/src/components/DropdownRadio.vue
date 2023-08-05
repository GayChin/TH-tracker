<script setup>
import { onMounted, ref, watch } from "vue";

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
    },
    isOpen: {
        type: Boolean,
        required: true
    },
    defaultSelected: {
        type: String,
        required: true
    }
});

const dropdownIsOpen = ref(false);
const optionsCheckedCount = ref(0);
const optionsChecked = ref([]);
const emit = defineEmits(['updateOptions', 'dropdownClick'])

function handleRadioButtonChange(item) {
    emit('updateOptions', optionsChecked.value, prop.field)
}

function selectDropdown() {
    dropdownIsOpen.value = !dropdownIsOpen.value
    emit('dropdownClick')
}

watch(() => prop.isOpen, (newIsOpen) => {
    if (!newIsOpen) dropdownIsOpen.value = false;
})

</script>

<template>
    <div>
        <button @click="selectDropdown"
            class="text-white bg-primary hover:bg-main-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center hover:brightness-110"
            :class="isOpen && dropdownIsOpen ? 'ring-[#96a3e9] ring-4' : ''" type="button">
            {{ title
            }}
            <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 4 4 4-4" />
            </svg>
        </button>

        <!-- Dropdown menu -->
        <div class="z-10 w-48bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 absolute bg-white mt-2"
            :class="isOpen && dropdownIsOpen ? '' : 'hidden'">
            <ul class="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200">
                <li v-for="(option, index) in options" :key="index">
                    <div class="flex items-center">
                        <input :checked="option.value === defaultSelected" :id="'radio-item-' + index" type="radio"
                            :value="option.value" v-model="optionsChecked" @change="handleRadioButtonChange(option)"
                            class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-main-500 dark:focus:ring-main-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                        <label :for="'radio-item-' + index"
                            class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{
                                option.name }}</label>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped></style>
