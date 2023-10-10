function getdata() {
  return fetch('https://tenapi.cn/v2/api')
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
  // 重写 fetch
  const oldFetch = fetch,
    caches = []
  let i = 0

  window.fetch = (...args) => {
    // 判断缓存是否存在
    if (caches[i]) {
      if (caches[i].status === 'fulfilled') {
        return caches[i].value
      } else if (caches[i].status === 'rejected') {
        throw caches[i].error
      }
    }

    // 发送真实请求
    const result = {
      status: 'pending',
      value: null,
      error: null
    }

    // 设置 caches[0] = result, 然后 i++
    caches[i] = result
    ++i
    const promise = fetch(...args)
      .then((res) => res.json())
      .then(
        (res) => {
          result.status = 'fulfilled'
          result.value = res
        },
        (err) => {
          result.status = 'rejected'
          result.error = err
        }
      )

    // 抛出错误，后面会捕获
    throw promise
  }

  try {
    func()
  } catch (error) {
    if (error instanceof Promise) {
      const reRun = () => {
        i = 0
        func()
      }
      // 这里的error 就是上面抛出 promise
      error.then(reRun, reRun).finally(() => (window.fetch = oldFetch))
    }
  }
}

run(main)
