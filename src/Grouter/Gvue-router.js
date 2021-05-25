// 监听pushState及replaceState
const _wrapper = type => {
  const origin = history[type]
  return function() {
    const event = new Event(type)
    event.arguments = arguments
    window.dispatchEvent(event)
    return origin.apply(this, arguments)
  }
}

history.pushState = _wrapper('pushState')
history.replaceState = _wrapper('replaceState')

let Vue
class VueRouter {
  constructor(options) {
    // 保存选项
    this.$options = options
    const initial = window.location.hash.substring(1) || "/"
    // 定义一个响应式数据  无嵌套路由时
    // 不可以用 $set、$watch, Vue.$set(obj, attr) => obj需要为响应式
    // Vue.util.defineReactive(this, 'current', initial)
    Vue.util.defineReactive(this, 'matches', [])
    this.current = initial
    this.matchRoutes()

    window.addEventListener('hashchange', () => {
      this.current = window.location.hash.substring(1)
      this.matches = []
      this.matchRoutes()
    })

    window.addEventListener('pushState', () => {
      this.current = window.location.pathname
      this.matches = []
      this.matchRoutes()
    })
  }

  matchRoutes(routes) {
    const curRoutes = routes || this.$options.routes
    for (const route of curRoutes) {
      if (route.path === '/' && this.current === '/') {
        this.matches.push(route)
        return
      }
      // /about/child 当前地址包含 /about, /child
      if (route.path !== '/' && this.current.indexOf(route.path) !== -1) {
        this.matches.push(route)
        if (route.children) this.matchRoutes(route.children)
        return
      }
    }
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
      // 无嵌套路由时
      // const current = this.$router.current
      // const comp = this.$router.$options.routes.find(comp => comp.path === current).component || null

      // 标记当前router-view深度m
      this.$vnode.data.routerView = true
      let depth = 0
      let parent = this.$parent

      while(parent) {
        const vnodeDate = parent.$vnode && parent.$vnode.data
        if (vnodeDate) {
          vnodeDate.routerView && depth++
        }
        parent = parent.$parent
      }
      // 找到 matches 数组中的组件
      const route = this.$router.matches[depth]
      const comp = route && route.component || null
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
      let component = this.$router.$options.mode === 'hash'
        ? h('a', {
          attrs: {
            href: `#${this.to}`,
          },
          style: {
            textDecoration: 'none',
          }
        }, this.$slots.default)
        : h('span', {
          style: {
            cursor: 'pointer',
          },
          on: {
            click: () => {
              history.pushState({}, '', this.to)
              this.$router.current = this.to
            }
          }
        }, this.$slots.default)
      return component
    }
  })
}

export default VueRouter