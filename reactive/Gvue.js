function defineReactive(obj, key, val) {
  // ! 递归处理 
  observe(val)

  Object.defineProperty(obj, key, {
    get() {
      console.log('get', key)
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        console.log('set', key)
        // ! 处理newVal也是对象的情况
        observe(newVal)
        val = newVal
      }
    }
  })
}

// * 遍历obj中每个key，执行响应式定义
function observe(obj) {
  // ! 判断传入obj是否是对象
  if (typeof obj !== 'object' || obj === null) return

  new Observer(obj)
}

// * 传入obj, 判断obj类型，做不同响应式处理
class Observer {
  constructor(value) {
    if (Array.isArray(value)) {
      // todo
    } else {
      this.walk(value)
    }
  }

  walk(obj) {
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key])
    })
  }
}

class Gvue {
  constructor(options) {
    // * 1. 保存配置
    this.$options = options
    this.$data = options.data
    // * 2. 对data响应式处理
    observe(this.$data)
    // * 3. 编译试图模板
  }
}