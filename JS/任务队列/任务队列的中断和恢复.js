// 依次顺序执行一系列任务
// 所有任务全部完成后可以得到每个任务的执行结果
// 需要返回两个方法，start 用于启动函数， pause 用于暂停函数
// 每个任务具有原子性，即不可中断，只能在两个任务之间中断

function processTasks(...tasks) {
  let isRunning = false, // 记录任务是否正在执行
    results = [],
    i = 0,
    prom = null // 用于保存 Promise 的状态
  function start() {
    return new Promise(async (resolve, reject) => {
      // 每次执行 start 之前判断一下 prom 是否有值，有值就直接返回结果值
      if (prom) {
        prom.then(resolve, reject)
        return
      }
      // 如果是运行状态就什么也不做
      if (isRunning) {
        return
      }

      isRunning = true
      // 依次执行任务
      while (i < tasks.length) {
        try {
          console.log(`任务${i + 1}开始`)
          results.push(await tasks[i]())
          console.log(`任务${i + 1}结束`)
        } catch (error) {
          isRunning = false // 重置 isRunning 的状态
          reject(error)

          prom = Promise.reject(err) // 失败的时候保存状态
          return
        }

        i++

        // 但是当我们执行的是最后一个任务的话中断也没有意义了，所以 i 必须小于 tasks.length
        // 暂停
        if (!isRunning && i < tasks.length) {
          return
        }
      }

      // 所有任务都结束了
      isRunning = false

      // 返回结果
      resolve(results)

      prom = Promise.resolve(result) // 成功的时候保存状态
    })
  }

  function pause() {
    console.log('------暂停')
    isRunning = false
  }

  return {
    start,
    pause
  }
}

let tasks = []

for (let i = 0; i < 5; i++) {
  tasks.push(() => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(i)
      }, 1000)
    )
  })
}

const proTask = processTasks(...tasks)

proTask.start()
setTimeout(() => {
  proTask.pause()
}, 1000)

// setTimeout(() => {
//   proTask.start()
// }, 2000)
