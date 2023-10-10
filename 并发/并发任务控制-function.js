function asyncTask(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(time)
      resolve(time)
    }, time * 1000)
  })
}

const tasks = [
  () => asyncTask(10),
  () => asyncTask(5),
  () => asyncTask(3),
  () => asyncTask(4),
  () => asyncTask(5)
]

function asyncFlowControl(tasks, limit) {
  let results = [], // 记录任务结果
    isRunning = 0, // 记录正在执行的任务数量
    index = 0 // 当前执行任务的下标
  return new Promise((resolve, reject) => {
    function _run() {
      if (index >= tasks.length || isRunning >= limit) {
        // 达到并发限制或所有任务已执行完毕，返回结果
        if (results.length === tasks.length) {
          resolve(results)
        }

        return
      }

      while (isRunning < limit && index < tasks.length) {
        const task = tasks[index]
        isRunning++

        const currentIndex = index // 保存当前下标
        index++
        task()
          .then((result) => {
            results[currentIndex] = result
          })
          .catch((error) => {
            reject(error)
          })
          .finally(() => {
            isRunning--
            _run()
          })
      }
      // let task = tasks[index]
      // const currentIndex = index // 保存当前下标

      // index++
      // isRunning++

      // task()
      //   .then((result) => {
      //     results[currentIndex] = result
      //   })
      //   .catch((error) => {
      //     reject(error)
      //   })
      //   .finally(() => {
      //     isRunning--
      //     _run() // 递归执行下一个任务
      //   })

      // _run() // 递归执行下一个任务
    }

    _run()
  })
}

asyncFlowControl(tasks, 2)
  .then((results) => {
    console.log('All tasks completed:', results)
  })
  .catch((error) => {
    console.error('Error occurred:', error)
  })
