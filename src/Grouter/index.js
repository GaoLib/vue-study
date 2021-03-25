import Vue from 'vue'
import VueRouter from './Gvue-router'
import Home from '../views/Home.vue'

// 1.VueRouter插件
// 内部install方法：
//    1）实现并声明两个组件router-view  router-link
//    2) 注册$router, this.$router可直接使用
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
  }
]

// 2.创建实例
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
