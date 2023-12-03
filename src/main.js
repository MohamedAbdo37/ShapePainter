import { createApp } from 'vue'
import App from './App.vue'
import VueKonva from 'vue-konva';

createApp(App).mount('#app')
App.use(VueKonva);
App.mount('#app');
