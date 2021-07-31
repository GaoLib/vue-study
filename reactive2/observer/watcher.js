// ! 收集更新函数，负责视图中依赖的更新
class Watcher {
  constructor(vm, key, updater) {
    this.$vm = vm
    this.$key = key
    this.$updater = updater

    // ! 尝试读取key,触发依赖收集
    // Dep.target = this
    pushTarget(this)
    // ? this.$vm[this.$key]
    parseObj(this.$vm, this.$key)
    // Dep.target = null
    popTarget()
  }

  // ! 会被Dep调用
  update() {
    const obj = parseObj(this.$vm, this.$key)
    this.$updater.call(this.$vm, obj)
  }
}