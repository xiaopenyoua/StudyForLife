function throttlo(fn, wait) {
  let previous = Date.now(),
    timer = null,
    context,
    args,
    remainning

  return function () {
    const now = Date.now()
    context = this
    args = arguments
    remainning = wait - (now - previous)

    if (remainning <= 0) {
      fn.apply(context, args)
      previous = now
    } else {
      if (timer) {
        clearTimeout(timer)
      }

      timer = setTimeout(() => {
        fn.apply(context, args)
        previous = Date.now()
        timer = null
      }, remainning)
    }
  }
}
