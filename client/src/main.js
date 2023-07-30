import './assets/style.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {faSignal, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'; 
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)


library.add(faSignal, faClockRotateLeft);
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
