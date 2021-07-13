# vue-study
Vue2 实现原理

## vue-router
/src/Grouter
> hash，history模式

## vuex
/src/Gstore
> state, getters, commite, dispatch

## 数据响应式
reactive
> - Observer: data响应式
> - Compile: 编译模板
> - Watcher: 收集依赖及更新函数
> - Dep: 管理watcher，通知更新
### 源码
#### src\platforms\web\entry-runtime-with-compiler.js
> 入口文件
> - 扩展$mount: 解析 el 和 template, 编译render

#### src\platforms\web\runtime\index.js
> 平台运行时主页
> - 实现 mount 方法,执行挂载组件
> - 安装 patch 函数

#### src\core\index.js
> 通用运行时主页
> - 全局api初始化

#### src\core\instance\index.js
> 实例首页
> - 声明Vue构造函数
> - 扩展Vue实例方法

#### src\core\instance\init.js
> 实例初始化
