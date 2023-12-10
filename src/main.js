import Vue from 'vue'
import App from './App.vue'
import VueKonva from 'vue-konva';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')



Vue.use(VueKonva);