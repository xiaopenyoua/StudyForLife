// 立即执行  immediate
function debounce(fn, wait, immediate) {
  let timer = null,
    context,
    args

  let debounced = function () {
    context = this //传给目标函数
    args = arguments
    if (timer) {
      clearTimeout(timer)
    }

    if (immediate) {
      // 立即执行的代码
      if (!timer) {
        // 第一次就立即执行，则 timer 必然是不存在的
        fn.apply(context, args)
      }

      timer = setTimeout(() => {
        timer = null // timer 作为闭包引用的上层函数的变量，是不会自动回收的。手动将其设置为 null ，让它脱离执行环境，以便垃圾收集器下次运行是将其回收。
      }, wait)
    } else {
      // 不立即执行的代码
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, wait)
    }
  }

  // 取消立即执行
  debounced.cancel = function () {
    clearTimeout(timer)
    timer = null
  }

  return debounced
}

const fn = debounce(
  function (i) {
    console.log(i, 11111111)
  },
  1000,
  false
)

fn(1)
fn(2)
fn(3)
fn(4)
