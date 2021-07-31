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
    this.$methods = options.methods
    // * 2. 对data响应式处理
    observe(this.$data)
    // * 3. 代理
    proxy(this)
    // * 4. 编译视图模板
    new Compile(options.el, this)
    // * 5. 调用 $mount
    // if (options.el) {
    //   this.$mount(options.el)
    // }
  }

  $mount(el) {
    this.$el = document.querySelector(el)
  
    const updateComponent = () => {
      // * 获取渲染函数
      const { render } = this.$options
      // * 得到真实dom
      const el = render.call(this)
      // * 获取父元素
      const parentElm = this.$el.parentElement
      // * 新元素插入
      parentElm.insertBefore(el, this.$el.nextSibling)
      // * 删除模板
      parentElm.removeChild(this.$el)
      // * 保存真实节点
      this.$el = el
    }

    new Watcher(this, updateComponent)
  }
}

Gvue.prototype.$set = set
Gvue.prototype.$delete = del

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
        this.compileElement(node)
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

  // ! 每当解析出依赖时
  update(node, exp, dir) {
    // ! 1. 初始化
    const fn = this[`${dir}Updater`]
    // ! obj.foo 嵌套对象情况
    fn && fn(node, parseObj(this.$vm, exp))
    // ! 2. 创建watcher实例
    new Watcher(this.$vm, exp, function(val) {
      fn && fn(node, val)
    })
  }

  // * {{ xxx }}
  compileText(node) {
    this.update(node, RegExp.$1.trim(), 'text')
  }

  textUpdater(node, val) {
    node.textContent = val
  }

  compileElement(node) {
    const nodeAttrs = node.attributes
    Array.from(nodeAttrs).forEach((attr) => {
      const attrName = attr.name
      const exp = attr.value
      if (this.isDir(attrName)) {
        const dir = attrName.substring(2)
        this[dir] && this[dir](node, exp)
      }
      if (this.isEvent(attrName)) {
        const eveName = attrName.substring(1)
        node.addEventListener(eveName, () => {
          this.$vm.$methods[exp].call(this.$vm)
        })
      }
    })
  }
  
  isDir(attr) {
    return attr.startsWith('g-')
  }

  isEvent(attr) {
    return attr[0] ===  '@'
  }

  // * g-text
  text(node, exp) {
    this.update(node, exp, 'text')
  }

  // * g-html
  html(node, exp) {
    this.update(node, exp, 'html')
  }

  // * g-model
  model(node, exp) {
    this.update(node, exp, 'model')
    node.addEventListener('input', (e) => {
      this.$vm[exp] = e.target.value
    })
  }

  htmlUpdater(node, val) {
    node.innerHTML = val
  }

  modelUpdater(node, val) {
    node.value = val
  }
}

function parseObj(data, exp) {
  let res = data[exp]
  const values = exp.split('.')
  if (values.length > 1 && data[values[0]]) {
    res = values.reduce((obj, value) => {
      return obj[value]
    }, data)
  }
  return res
}
