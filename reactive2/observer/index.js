// * 数组响应式
const originalProto = Array.prototype
const arrayProto = Object.create(originalProto);
['push', 'pop', 'shift', 'unshift', 'sort', 'splice', 'reverse'].forEach((method) => {
  arrayProto[method] = function() {
    originalProto[method].apply(this, arguments)
    this.__ob__.dep.notify()
  }
})

function defineReactive(obj, key, val) {
  // ! 递归处理 
  let childOb = observe(val)

  // ! 创建对应的Dep实例
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    get() {
      // ! 添加依赖
      // Dep.target && dep.addDep(Dep.target)
      if (Dep.target) {
        dep.addDep(Dep.target)
        if (childOb) {
          childOb.dep.addDep(Dep.target)
        }
        if (Array.isArray(val)) {
          dependArray(val)
        }
      }
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        // ! 处理newVal也是对象的情况
        observe(newVal)
        val = newVal

        dep.notify()
      }
    }
  })
}

// * 遍历obj中每个key，执行响应式定义
function observe(value) {
  // ! 判断传入obj是否是对象
  if (typeof value !== 'object' || value === null) return

  if (value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    ob = new Observer(value)
  }
  return ob
}

// * 传入obj, 判断obj类型，做不同响应式处理
class Observer {
  constructor(value) {
    this.value = value
    this.dep = new Dep()
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      value.__proto__ = arrayProto
      const keys = Object.keys(value)
      for (let i = 0; i < keys.length; i++) {
        observe(value[i]);
      }
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

function def(obj, key, val, enumerable = false) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  })
}

function dependArray (value) {
  value && value.__ob__ && value.__ob__ && value.__ob__.dep.addDep(Dep.target)
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep && e.__ob__.dep.addDep(Dep.target)
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}

function set(target, key, val) {
  if (Array.isArray(target)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = target.__ob__
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}

function del(target, key) {
  if (Array.isArray(target)) {
    target.splice(key, 1)
    return
  }
  delete target[key]
  const ob = target.__ob__
  if (ob) ob.dep.notify()
}
