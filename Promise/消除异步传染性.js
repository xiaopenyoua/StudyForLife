function getdata() {
  return fetch('./data.js')
}
function m1() {
  return getdata()
}
function m2() {
  return m1()
}
function m3() {
  return m2()
}
function main() {
  const data = m3()
  console.log(data)
}

function run(func) {
  const catchs = [], // 记录多个缓存
    oldFetch = fetch // 记录原始的缓存，发送原始请求
  let i = 0

  // 重写 fetch，在执行到 fetch('./data.js') 时，使用的就是这个重写的fetch
  window.fetch = (...args) => {
    // 判断缓存是否存在
    if (catchs[i]) {
      if (caches[i].status === 'success') {
        return catchs[i].value
      } else if (catchs[i].status === 'error') {
        throw catchs[i].err
      }
    }

    const result = {
      status: 'pending', // pending success error
      value: null,
      err: null
    }
    // 设置 caches[0] = result, 然后 i++
    caches[i++] = result
    // 发送真是请求
    const promise = oldFetch(...args)
      .then((res) => res.json())
      .then(
        // 成功设置缓存
        (res) => {
          result.status = 'success'
          result.value = res
        },
        // 失败 更改状态
        (err) => {
          result.status = 'error'
          result.err = err
        }
      )

    // 抛出错误
    throw promise
  }

  try {
    func()
  } catch (error) {
    // 这里的error 就是上面的 抛出的 promise
    if (error instanceof Promise) {
      const reRun = () => {
        i = 0
        error()
      }
      error.then(reRun, reRun).finally(() => {
        window.fetch = oldFetch
      })
    }
  }
}

run(main)
