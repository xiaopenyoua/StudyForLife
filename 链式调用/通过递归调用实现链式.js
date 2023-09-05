// https://juejin.cn/post/6844903992711987208

// 模拟一系列函数
function fn1(ctx, next) {
  console.log('函数fn1执行...') // 打印顺序 1
  next()
  console.log('fn1 ending') // 打印顺序 6
}
function fn2(ctx, next) {
  console.log('函数fn2执行...') // 打印顺序 2
  next()
  console.log('fn2 ending') // 打印顺序 5
}
function fn3(ctx, next) {
  console.log('函数fn3执行...') // 打印顺序 3
  next()
  console.log('fn3 ending') // 打印顺序 4
}

// 1，实现一个包装函数，此函数的功能就是返回一个新函数fn，并在其内部执行数组的第一个函数
// 2，在每个函数内部遇到next则终止当前函数逻辑，执行下一个函数形成链式因此，我们期望的结果应该是这样的：const fn = wrap(fns); fn(ctx) // 即可调用到所有的函数。

function wrap(arr) {
  // 必然会返回一个函数
  return (ctx) => {
    let l = arr.length
    // 调用时从第一个函数开始
    return next(0)
    function next(i) {
      // 最后一个函数已经执行
      if (i === l) return

      let fn = arr[i]
      // 执行当下函数，将参数透传过来，每个函数的next是一个函数，因此通过 bind 返回(不会立即执行)，留在每个函数内部调用，并保留参数，实现递归
      return fn(ctx, next.bind(null, i + 1))
    }
  }
}

// 依然是上面三个函数的数组
let arr = [fn1, fn2, fn3]
// 组合后的函数
let fn = wrap(arr)

fn('ddd')
