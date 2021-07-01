// * 数组响应式
// ! 1. 替换数组原型中改变原数组的7个方法
const originalProto = Array.prototype
// ! 2. 修改新的备份
const arrayProto = Object.create(originalProto);
['push', 'pop', 'shift', 'unshift', 'sort', 'splice', 'reverse'].forEach((method) => {
  arrayProto[method] = function() {
    // ! 执行原有操作
    originalProto[method].apply(this, arguments)
    // ! 通知更新
    console.log(`数组执行${method}操作` )
  }
})

// * 对象响应式
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

  if (Array.isArray(obj)) {
    // ! 覆盖原型，替换7个变更操作
    obj.__proto__ = arrayProto
    // ! 对数组内部元素执行响应式
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      observe(obj[i]);
    }
  }

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
let arr = [1,2,3]
observe(arr)
arr.push(4)
