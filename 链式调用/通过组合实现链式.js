// 模拟几个函数
function fn1(arg1) {
  // ...对arg1的操作逻辑
  console.log('fn1的参数：', arg1)
  let arg = arg1 + 30
  return arg
}
function fn2(arg2) {
  // ...对arg2的操作逻辑
  console.log('fn2的参数：', arg2)
  let arg = arg2 + 20
  return arg
}
function fn3(arg3) {
  // ...对arg3的操作逻辑
  console.log('fn3的参数：', arg3)
  let arg = arg3 + 10
  return arg
}
// 省略所有容错判断
function compose(fns) {
  let l = fns.length
  if (!l) throw new Error('至少得有一个函数呀...')

  // 一个，就直接返回这个函数...
  if (l === 1) return fns[0]

  // 数组迭代，返回一个函数，函数的实体为  后一个函数执行的返回值作为前一个函数的参数，然后前一个函数执行，最终返回第一个函数的返回值
  return fns.reduce(
    (a, b) =>
      (...arg) =>
        a(b(...arg))
  )
}

let fns = [fn1, fn2, fn3]

// 将函数组合，形成复杂函数
let fn = compose(fns)

// 执行
let r = fn(10) // 结果r为70
// 执行过程打印

const getUser = async () => {
  const res = await fetch()

  return res
}

setTimeout(() => {}, 0)
