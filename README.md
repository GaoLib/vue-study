# vue-study
Vue2 实现原理

## vue-router
/src/Grouter
> hash，history模式

### vuex
/src/Gstore
> state, getters, commite, dispatch

### 数据响应式
reactive
> - Observer: data响应式
> - Compile: 编译模板
> - Watcher: 收集依赖及更新函数
> - Dep: 管理watcher，通知更新
