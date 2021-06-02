import Vue from 'vue'
import App from './App.vue'
import store from './Gstore'
import router from './Grouter'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
