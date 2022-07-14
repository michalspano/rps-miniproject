import { createApp } from 'vue'
import App from './App.vue'
import './main.css' // the custom tailwind css module

Vue.config.devtools = true;
createApp(App).mount('#app')
