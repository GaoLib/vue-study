function defineReactive(obj, key, val) {
  // ! 递归处理  ==> L43
  observe(val)

  Object.defineProperty(obj, key, {
    get() {
      console.log('get', key)
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        console.log('set', key)
        // ! 处理newVal也是对象的情况  ==>  L51
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

  Object.keys(obj).forEach((key) => {
    defineReactive(obj, key, obj[key])
  })
}

// ! 初始obj未定义的属性  ==> L55
function set(obj, key, val) {
  defineReactive(obj, key, val)
}

// const obj = {
//   foo: 'foo',
//   bar: 'bar',
//   baz: {
//     a: 'a',
//   },
// }
// observe(obj)
// obj.foo
// obj.bar
// obj.baz.a
// obj.baz = {
//   a: 10
// }
// obj.baz.a
// set(obj, 'dong', 'dong')
// obj.dong
