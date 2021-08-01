// ! Dep 和 data 中的每一个key一一对应
class Dep {
  constructor() {
    this.deps = new Set()
  }
  
  addDep(watcher) {
    this.deps.add(watcher)
  }

  notify() {
    this.deps.forEach(watcher => watcher.update())
  }
}

const targetStack = []

function pushTarget (target) {
  targetStack.push(target)
  Dep.target = target
}

function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}