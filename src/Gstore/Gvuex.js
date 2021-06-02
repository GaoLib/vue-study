let Vue
// state 属性 响应式
// commit, dispatch 方法
class Store {
  constructor(options) {
    // Vue.util.defineReactive(this, 'state', options.state)
    this._vm = new Vue({
      data: {
        $$state: options.state
      }
    })
    this._mutations = options.mutations
    this._actions = options.actions

    this.commit = this.commit.bind(this)   // 绑定上下文
    this.dispatch = this.dispatch.bind(this)
  }

  get state() {
    return this._vm.$data.$$state  // $$不会被代理,不能直接使用 this._vm.$$state
  }

  set state(v) {
    console.log('Can not set state')
  }

  commit(type, payload) {
    const entry = this._mutations[type]
    if (!entry) {
      console.log('Can not find this mutation')
      return
    }
    entry(this._vm.$data.$$state, payload)
  }

  dispatch(type, payload) {
    const entry = this._actions[type]
    if (!entry) {
      console.log('Can not find this action')
      return
    }
    entry(this, payload)
  }
}

function install(_Vue) {
  Vue = _Vue

  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default { Store, install }  // 对象为Vuex