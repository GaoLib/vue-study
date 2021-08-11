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
    // * 4. 调用 $mount
    if (options.el) {
      this.$mount(options.el)
    }
  }

  $mount(el) {
    this.$el = document.querySelector(el)
  
    const updateComponent = () => {
      // * 获取渲染函数
      const { render } = this.$options
      // * dom
      // * 得到真实dom
      // const el = render.call(this, this.$createElement)
      // * 获取父元素
      // const parentElm = this.$el.parentElement
      // * 新元素插入
      // parentElm.insertBefore(el, this.$el.nextSibling)
      // * 删除模板
      // parentElm.removeChild(this.$el)
      // * 保存真实节点
      // this.$el = el

      // * vdom
      const vnode = render.call(this, this.$createElement)
      this._update(vnode)
    }

    new Watcher(this, updateComponent)
  }

  $createElement(tag, obj, children) {
    let props = obj
    if (props) {
      const { styles, on, attrs } = props
      props = {styles, on, attrs}
    }
    return {tag, props, children}
  }

  _update(vnode) {
    // 获取上一次vnode
    const prevVode = this._vnode

    if (!prevVode) {
      // * init
      this.__patch__(this.$el, vnode)
    } else {
      // * update
      this.__patch__(prevVode, vnode)
    }
  }

  __patch__(oldVnode, vnode) {
    // ! init
    if (oldVnode.nodeType) {
      // * oldVnode 是dom
      const parent = oldVnode.parentElement
      const refEle = oldVnode.nextSibling
      // * vnode转换为dom
      const el = this.createEle(vnode)
      parent.insertBefore(el, refEle)
      parent.removeChild(oldVnode)
    } else {
      // ! update
      // * 获取要更新的vnode
      const el = vnode.el = oldVnode.el
      // * props
      const oldStyles = oldVnode.props && oldVnode.props.styles
      const styles = oldVnode.props && vnode.props.styles
      for (let key in styles) {
        if (styles[key] !== oldStyles[key]) {
          el.style.setProperty(key, styles[key])
        }
      }
      // * children
      const oldCh = oldVnode.children
      const newCh = vnode.children
      if (!newCh || typeof newCh === 'string') {
        if (typeof oldCh === 'string') {
          // * 两个都为text
          if (newCh !== oldCh) el.textContent = newCh
        } else {
          // * newCh为text,oldCh为array
          el.textContent = newCh
        }
      } else {
        if (typeof oldCh === 'string') {
          // * newCh为array,oldCh为text
          el.innerHTML = ''
          newCh.forEach(child => {
            el.appendChild(this.createEle(child))
          })
        } else {
          this.updateChildren(el, oldCh, newCh)
        }
      }
    }

    // ! 保存vnode,更新使用
    this._vnode = vnode
  }

  updateChildren(parentEle, oldCh, newCh) {
    if (typeof newCh[0] !== 'object') {
      parentEle.textContent = newCh
      return
    }
    const len = Math.min(oldCh.length, newCh.length)
    // ! 遍历较短数组,直接更新
    for (let i=0;i<len;i++) {
      this.__patch__(oldCh[i], newCh[i])
    }
    if (newCh.length > oldCh.length) {
      newCh.slice(len).forEach(child => {
        parentEle.appendChild(this.createEle(child))
      })
    } else if (newCh.length < oldCh.length) {
      oldCh.slice(len).forEach(child => {
        parentEle.removeChild(child.el)
      })
    }
  }

  createEle(vnode) {
    // ! dom创建
    // * 1.创建根节点
    const el = document.createElement(vnode.tag)
    // * 2.props
    if (vnode.props) {
      const { styles, on, attrs } = vnode.props
      if (styles) {
        for (const key in styles) {
          el.style.setProperty(key, styles[key])
        }
      }
      if (attrs) {
        for (const key in attrs) {
          el.setAttribute(key, attrs[key])
        }
      }
      if (on) {
        for (const key in on) {
          const fn = this.$options.methods[on[key]]
          el.addEventListener(key, () => {
            fn.call(this)
          })
        }
      }
    }
    // * 3.children
    if(vnode.children) {
      if (typeof vnode.children === 'string') {
        // * text
        el.textContent = vnode.children
      } else {
        // * array
        if (typeof vnode.children[0] === 'object') {
          vnode.children.forEach((child) => {
            const childDom = this.createEle(child)
            el.appendChild(childDom)
          })
        } else {
          el.textContent = vnode.children
        }
      }
    }
    // * 4.保存
    vnode.el = el

    return el
  }
}

Gvue.prototype.$set = set
Gvue.prototype.$delete = del


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
