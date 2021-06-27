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

function proxy(vm) {
  Object.keys(vm.$data).forEach((key) => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key]
      },
      set(v) {
        vm.$data[key] = v
      }
    })
  })
}

class Gvue {
  constructor(options) {
    // * 1. 保存配置
    this.$options = options
    this.$data = options.data
    // * 2. 对data响应式处理
    observe(this.$data)
    // * 3. 代理
    proxy(this)
    // * 4. 编译试图模板
    new Compile(options.el, this)
  }
}

class Compile {
  constructor(el, vm) {
    this.$vm = vm
    this.$el = document.querySelector(el)

    if (this.$el) this.compile(this.$el)
  }
  
  compile(el) {
    // * 对el dom数递归遍历
    // ! children 只返回HTML节点，不返回文本节点
    el.childNodes.forEach((node) => {
      // * 元素
      if (node.nodeType === 1) {
        console.log('元素节点', node.nodeName)
        if (node.childNodes.length) this.compile(node)
      }
      // * 文本
      if (this.isInter(node)) {
        this.compileText(node)
      }
    })
  }

  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }

  compileText(node) {
    node.textContent = this.$vm[RegExp.$1.trim()]
  }
}