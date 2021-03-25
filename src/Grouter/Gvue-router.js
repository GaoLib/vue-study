let Vue
class VueRouter {
  constructor(options) {
    // 保存选项
    this.$options = options
    const initial = window.location.hash.substring(1) || "/"
    // 定义一个响应式数据
    Vue.util.defineReactive(this, 'current', initial)
    this.current = initial

    window.addEventListener('hashchange', () => {
      this.current = window.location.hash.substring(1)
    })
  }
}

// 实现install方法
VueRouter.install = (_Vue) => {
  Vue = _Vue
  
  // 注册this.$router
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      }
    }
  })

  // 实现router-view组件
  Vue.component('router-view', {
    render(h) {
      const current = this.$router.current
      const comp = this.$router.$options.routes.find(comp => comp.path === current).component || null
      return h(comp)
    }
  })

  // 实现router-link组件
  Vue.component('router-link', {
    // <router-view :to="/about">About</router-view>
    // 转成 <a :href="/about">About</a>
    props: {
      to: {
        type: String,
        required: true,
      },
    },
    render(h) {
      return h('a', {
        attrs: {
          href: `#${this.to}`,
        },
        style: {
          textDecoration: 'none',
        }
      }, this.$slots.default)
    }
  })
}

export default VueRouter