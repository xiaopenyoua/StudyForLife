// 节流
function throttlo(fn, wait) {
  let previous = Date.now()
  let time = null,
    context,
    args,
    remaining

  // 普通函数的this 指向 window

  return function () {
    let now = Date.now()

    // 这里的this 主要看 返回的匿名函数是作为谁的回调函数，this 就指向谁
    context = this
    args = arguments
    remaining = wait - (now - previous) // 剩余的还需要等待的时间

    if (remaining <= 0) {
      fn.apply(context, args)
      previous = now // 重置 “上一次执行” 的时间
    } else {
      // 否则继续等待，结尾执行一次
      if (time) {
        clearTimeout(time)
      }

      time = setTimeout(() => {
        fn.apply(context, args)
        time = null
        previous = Date.now() // 重置 “上一次执行” 的时间
      }, remaining) //等待还需等待的时间
    }
  }
}

function test() {
  console.log('test')
  // console.log(this)
}

throttlo(test, 1000)()
