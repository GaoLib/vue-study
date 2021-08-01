// ! 收集更新函数，负责视图中依赖的更新
class Watcher {
  constructor(vm, fn) {
    this.vm = vm
    this.getter = fn

    this.get()
  }

  get() {
    // ! 尝试读取key,触发依赖收集
    pushTarget(this)
    this.getter.call(this.vm)
    popTarget()
  }

  // ! 会被Dep调用
  update() {
    this.get()
  }
}