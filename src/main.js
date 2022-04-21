import Vue from 'vue'
import App from './App.vue'
// import store from './Gstore'
import createRouter from './router/ssr-router'

Vue.config.productionTip = false

// new Vue({
//   router,
//   store,
//   render: h => h(App),
// }).$mount('#app')

// 返回一个应用程序工厂函数： 返回 Vue实例、Router实例、Store实例
export default function createApp(context) {
  // 先处理路由跳转
  const router = createRouter()
  const app = new Vue({
    router,
    context,
    render: h => h(App),
  })
  return { app, router }
}
