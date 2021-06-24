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
        val = newVal
        // update()
      }
    }
  })
}

// function update() {
//   app.innerText = obj.foo
// }
// * 遍历obj中每个key，执行响应式定义
function observe(obj) {
  // ! 判断传入obj是否是对象
  if (typeof obj !== 'object' || obj === null) return

  Object.keys(obj).forEach((key) => {
    defineReactive(obj, key, obj[key])
  })
}

const obj = {
  foo: 'foo',
  bar: 'bar',
  baz: {
    a: 'a',
  },
}
observe(obj)
obj.foo
obj.bar
obj.baz.a
// setInterval(() => {
//   obj.foo = new Date().toLocaleString()
// }, 1000)
