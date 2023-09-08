// 依次顺序执行一系列任务
// 所有任务全部完成后可以得到每个任务的执行结果
// 需要返回两个方法，start 用于启动函数， pause 用于暂停函数
// 每个任务具有原子性，即不可中断，只能在两个任务之间中断

function processTasks(...tasks) {
  let isRunning = false, // 记录任务是否正在执行
    results = [],
    i = 0
  function start() {
    return new Promise(async (resolve) => {
      // 有任务在执行
      if (isRunning) {
        return
      }

      isRunning = true
      // 依次执行任务
      while (i < tasks.length) {
        console.log(`任务${i + 1}开始`)
        results.push(await tasks[i]())
        console.log(`任务${i + 1}结束`)
        i++

        // 暂停
        if (!isRunning) {
          return
        }
      }

      // 所有任务都结束了
      isRunning = false

      // 返回结果
      resolve(results)
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
