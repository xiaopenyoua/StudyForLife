// 节流
function throttlo(fn, wait) {
  let previous = Date.now()
  let time = null,
    context,
    args,
    remaining

  return function () {
    let now = Date.now()
    context = this
    args = arguments
    remaining = wait - (now - previous) // 剩余的还需要等待的时间

    if (remaining <= 0) {
      fn.apply(context, args)
      previous = now // 重置 “上一次执行” 的时间
    } else {
      if (!time) {
        time = setTimeout(() => {
          fn.apply(context, args)
          time = null
          previous = Date.now() // 重置 “上一次执行” 的时间
        }, remaining) //等待还需等待的时间
      } else {
        clearTimeout(time)
      }
    }
  }
}
