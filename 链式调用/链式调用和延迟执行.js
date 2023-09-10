function arrange(name) {
  // 等到调这个方法才会执行execute()，所有有任务队列
  const task = []

  // 调用这个方法会先 添加一个方法
  task.push(() => {
    console.log(`${name} is notified`)
  })

  function doSomething(name) {
    task.push(() => {
      console.log(`Start to ${name}`)
    })

    return this // 链式调用一般方法
  }

  function wait(time) {
    task.push(() => {
      return new Promise((resolve) => {
        // 这里没有写 setTimeout(() => {})
        // 因为resolve本身就是一个 resolve: (value: any) => void 箭头函数
        setTimeout(resolve(), time * 1000)
      })
    })

    return this
  }

  function waitFirst(time) {
    task.unshift(() => {
      return new Promise((resolve) => {
        setTimeout(resolve(), time * 1000)
      })
    })

    return this
  }

  // 存在异步函数
  async function execute() {
    for (const t of task) {
      await t()
    }

    return this
  }

  // 这里返回这些方法，是因为调用arrange这个方法后还会继续调用其他方法
  return {
    do: doSomething,
    wait,
    waitFirst,
    execute
  }
}

arrange('William').execute()
// > William is notified

arrange('William').do('commit').execute()
// // > William is notified
// // > Start to commit

arrange('William').wait(5).do('commit').execute()
// // > William is notified
// // 等待 5 秒
// // > Start to commit
arrange('William').waitFirst(5).do('push').execute()
// 等待 5 秒
// > William is notified
// > Start to commit
