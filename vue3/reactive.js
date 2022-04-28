// Vue3 reative 实现
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      console.log('get', key)
      // 依赖收集
      track(target, key)
      // 实现懒操作，只有获取再向下处理
      return (typeof res === 'object') ? reactive(res) : res
    },
    set(target, key, val, receiver) {
      const res = Reflect.get(target, key, val, receiver)
      console.log('set', key)
      // 触发更新
      trigger(target, key)
      return res
    },
    deleteProperty(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      console.log('deleteProperty', key)
      // 触发更新
      trigger(target, key)
      return res
    },
  })
}

const effectStack = []

const createReactiveEffect = (fn) => {
  const effect = (...args) => {
    try {
      effectStack.push(fn)
      return fn(...args)
    } finally {
      effectStack.pop()
    }
  }

  return effect
}


const effect = (fn) => {
  const e = createReactiveEffect(fn)
  e()
  return e
}

const targetMap = new WeakMap()

const track = (target, key) => {
  const effect = effectStack[effectStack.length - 1]
  if (effect) {
    // 根据 target 获取对应的map
    let depMap = targetMap.get(target)
    if (!depMap) {
      depMap = new Map()
      targetMap.set(target, depMap)
    }

    // 根据 key 获取对应的副作用函数
    let deps = depMap.get(key)
    if (!deps) {
      deps = new Set()
      depMap.set(key, deps)
    }

    deps.add(effect)
  }
}

const trigger = (target, key) => {
  const depMap = targetMap.get(target)
  if (!depMap) return

  const deps = depMap.get(key)
  if (deps) {
    deps.forEach(dep => dep())
  }
}

const state = reactive({
  foo: 'foo',
  bar: {
    baz: 'baz'
  }
})

effect(() => {
  console.log('effect1', state.foo)
})

effect(() => {
  console.log('effect2', state.foo, state.bar.baz)
})

state.foo = 1
// state.foo = 'foooooo'
// state.bar = 'bar'
// delete state.bar
state.bar.baz = 10
