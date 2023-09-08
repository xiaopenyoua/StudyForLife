// 字节跳动

// delay 延时函数
function timeout(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

class SuperTask {
  constructor(count = 2) {
    this.count = count // 并发任务数量
    this.tasks = [] // 任务队列
    this.runningTask = 0 // 目前正在执行的任务
  }

  // 添加任务并返回一个Promise, （添加任务到队列，不会立即执行）
  add(task) {
    return new Promise((resolve, reject) => {
      this.tasks.push({ task, resolve, reject }) // 在一个函数里面创建的Promise，需要在另一个函数里面去执行（完成还是拒绝）
      this._run()
    })
  }

  // 执行任务
  _run() {
    // 一个任务执行完，会在队列取下一个任务来执行
    while (this.runningTask < this.count && this.tasks.length > 0) {
      const { task, resolve, reject } = this.tasks.shift()
      this.runningTask++
      task() // 任务是一个Promise函数，会返回一个Promise
        .then(resolve, reject) // task任务完成，也就是 add()也完成了
        .finally(() => {
          this.runningTask--
          this._run()
        })
    }
  }
}

const superTask = new SuperTask()

function addTask(time, name) {
  superTask
    .add(() => timeout(time)) // add()会返回一个 Promise
    .then(() => {
      console.log(`任务${name}完成`)
    })
}

addTask(10000, 1) // 10000m后输出：任务1完成
addTask(5000, 2) // 5000m后输出：任务2完成
addTask(3000, 3) // 8000m后输出：任务3完成
addTask(4000, 4) // 12000m后输出：任务4完成
addTask(5000, 5) // 15000m后输出：任务5完成
