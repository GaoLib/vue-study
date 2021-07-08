# vue-study
Vue2 实现原理

/src/Grouter 简易版vue-router，实现hash，history模式
/src/Gstore  简易版vuex, 实现 state, getters, commite, dispatch

reactive 数据响应式
  Observer: data响应式
  Compile: 编译模板
  Watcher: 收集依赖及更新函数
  Dep: 管理watcher，通知更新