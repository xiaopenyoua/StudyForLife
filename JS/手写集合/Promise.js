// https://juejin.cn/post/7043758954496655397#heading-28
// https://juejin.cn/post/7044088065874198536#heading-9
// **************
// https://juejin.cn/post/7255855848836464677?searchId=202310161658589CD5564DDC15C8114956#heading-8

class GPromise {
  static PENDING = 'pending' // 声明一个常量PENDING，表示Promise的初始状态
  static FULFILLED = 'fulfilled' // 声明一个常量FULFILLED，表示Promise的成功状态
  static REJECTED = 'rejected' // 声明一个常量REJECTED，表示Promise的失败状态

  constructor(func) {
    this.PromiseState = GPromise.PENDING // 初始化Promise的状态为PENDING
    this.PromiseResult = undefined // 初始化Promise的值为undefined

    // Promise是可以多次调用then方法的, 应当是个数组结构,接收多个then内传入的方法；
    this.onFulfilledCallbacks = [] // 存储Promise成功状态下的回调函数
    this.onRejectedCallbacks = [] // 存储Promise失败状态下的回调函数

    // func是同步执行resolve或者reject时，在调用.then时，状态已经不再是pending，则直接调用 onFulfilledCallback 或者 onRejectedCallback即可
    // 当func是异步执行resolve或者reject时，调用.then时状态还处于 pending。 需要将onFulfilledCallback、onRejectedCallback保存起来，通过resolve/reject来执行回调。

    // 定义resolve函数，用于将Promise状态改为FULFILLED，并执行成功状态下的回调函数
    const resolve = (result) => {
      if (this.PromiseState === GPromise.PENDING) {
        setTimeout(() => {
          this.PromiseState = GPromise.FULFILLED // 将Promise状态改为FULFILLED
          this.PromiseResult = result // 存储Promise成功时的值
          this.onFulfilledCallbacks.forEach((callback) => {
            callback(result)
          })
        })
      }
    }

    // 定义reject函数，用于将Promise状态改为REJECTED，并执行失败状态下的回调函数
    const reject = (reason) => {
      if (this.PromiseState === GPromise.PENDING) {
        setTimeout(() => {
          this.PromiseState = GPromise.REJECTED // 将Promise状态改为REJECTED
          this.PromiseResult = reason // 存储Promise失败时的原因
          this.onRejectedCallbacks.forEach((callback) => {
            callback(reason)
          })
        })
      }
    }

    try {
      func(resolve, reject) // 执行executor函数，并传入resolve和reject参数
    } catch (error) {
      reject(error) // 捕获错误，并将Promise状态改为REJECTED
    }
  }

  /**
   * Promise.resolve()
   * @param {[type]} value 要解析为 Promise 对象的值
   * 静态方法resolve，返回一个状态为FULFILLED的Promise实例
   */
  static resolve(value) {
    return new GPromise((resolve, reject) => {
      resolve(value)
    })
  }

  /**
   * Promise.reject()
   * @param {*} reason 表示Promise被拒绝的原因
   * @returns
   * 静态方法reject，返回一个状态为REJECTED的Promise实例
   */
  static reject(reason) {
    return new GPromise((resolve, reject) => {
      reject(reason)
    })
  }

  /**
   * [注册fulfilled状态/rejected状态对应的回调函数]
   * @param {function} onFulfilled  fulfilled状态时 执行的函数
   * @param {function} onRejected  rejected状态时 执行的函数
   * @returns {function} newPromsie  返回一个新的promise对象
   */
  // onFulfilled 和 onRejected 应该是微任务，会立即执行，不能达到异步的效果
  then(onFulfilled, onRejected) {
    // 如果onFulfilled不是一个函数，则将其更改为返回接收到的值的函数
    if (typeof onFulfilled !== 'function') {
      onFulfilled = function (value) {
        return value
      }
    }

    // 如果onRejected不是一个函数，则将其更改为抛出接收到的原因的函数
    if (typeof onRejected !== 'function') {
      onRejected = function (reason) {
        throw reason
      }
    }

    // then 方法中的难点就是处理异步, 使用 setTimeout 一旦对象的状态改变
    // 则执行相应then 中相应的回调函数(onfulfilled和onrejected)
    // 这样回调函数就能够插入事件队列末尾，异步执行
    let promise2 = new GPromise((resolve, reject) => {
      if (this.PromiseState === GPromise.FULFILLED) {
        setTimeout(() => {
          try {
            let value = onFulfilled(this.PromiseResult)
            resolve(value)
          } catch (err) {
            reject(err)
          }
        }, 0)
      } else if (this.PromiseState === GPromise.REJECTED) {
        setTimeout(() => {
          try {
            let value = onRejected(this.PromiseResult)
            // 这里使用resolve而不是reject
            // 是因为当我们在then方法中的onRejected 接收到了上一个错误，说明我们对预期的错误进行了处理，
            // 进行下一层传递时应该执行下一个then的onFulfilled，除非在执行本次resolve时又出现了其他错误
            resolve(value)
          } catch (err) {
            reject(err)
          }
        })
      } else if (this.PromiseState === GPromise.PENDING) {
        // 如果 Promise 当前的状态是 PENDING，则将回调函数添加到对应的回调数组中
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let value = onFulfilled(this.PromiseResult)
              // 如果 value 也是一个 GPromise 的话，那么promise2的状态就要取决于 value 的状态
              if (value instanceof GPromise) {
                value.then(resolve, reject)
              } else {
                resolve(value)
              }
            } catch (err) {
              reject(err)
            }
          }, 0)
        })

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let value = onRejected(this.PromiseResult)
              if (value instanceof GPromise) {
                value.then(resolve, reject)
              } else {
                resolve(value)
              }
            } catch (err) {
              reject(err)
            }
          }, 0)
        })
      }
    })

    return promise2 // 链式调用
  }

  /**
   * Promise.prototype.catch()
   * @param {*} onRejected
   * @returns
   */
  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  /**
   * Promise.prototype.finally()
   * @param {*} callBack 无论结果是fulfilled或者是rejected，都会执行的回调函数
   * @returns
   */
  finally(callBack) {
    return this.then(callBack, callBack)
  }

  /**
   * Promise.all()
   * @param {iterable} promises 一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入
   * @returns
   * 静态方法all，接收一个包含多个Promise实例的数组，返回一个新的Promise实例
   */
  static all(promises) {
    return new GPromise((resolve, reject) => {
      // 参数校验
      if (Array.isArray(promises)) {
        let result = [] // 存储每个Promise实例的执行结果
        let count = 0 // 计数器

        // 如果传入的参数是一个空的可迭代对象，则返回一个已完成（already resolved）状态的 Promise
        if (promises.length === 0) {
          return resolve(promises)
        }

        promises.forEach((item, index) => {
          //  判断参数是否为promise
          if (item instanceof GPromise) {
            item.then(
              (value) => {
                count++
                // 每个promise执行的结果存储在result中
                result[index] = value
                // Promise.all 等待所有都完成（或第一个失败）
                if (count === promises.length) {
                  resolve(result) // 当所有Promise实例都执行完毕时，返回包含所有结果的新的Promise实例
                }
              },
              (reason) => {
                /**
                 * 如果传入的 promise 中有一个失败（rejected），
                 * Promise.all 异步地将失败的那个结果给失败状态的回调函数，而不管其它 promise 是否完成
                 */
                reject(reason)
              }
            )
          } else {
            // 参数里中非Promise值，原样返回在数组里
            count++
            result[index] = item
            // Promise.all 等待所有都完成（或第一个失败）
            if (count === promises.length) {
              resolve(result) // 当所有Promise实例都执行完毕时，返回包含所有结果的新的Promise实例
            }
          }
        })
      } else {
        return reject(new TypeError('Argument is not iterable'))
      }
    })
  }

  /**
   * Promise.allSettled()
   * @param {iterable} promises 一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入
   * @returns
   */
  static allSettled(promises) {
    return new GPromise((resolve, reject) => {
      // 参数校验
      if (Array.isArray(promises)) {
        let result = [] // 存储结果
        let count = 0 // 计数器

        // 如果传入的是一个空数组，那么就直接返回一个resolved的空数组promise对象
        if (promises.length === 0) return resolve(promises)

        promises.forEach((item, index) => {
          // 非promise值，通过Promise.resolve转换为promise进行统一处理
          item.then(
            (value) => {
              count++
              // 对于每个结果对象，都有一个 status 字符串。如果它的值为 fulfilled，则结果对象上存在一个 value 。
              result[index] = {
                status: 'fulfilled',
                value
              }
              // 所有给定的promise都已经fulfilled或rejected后,返回这个promise
              if (count === promises.length) {
                resolve(result) // 当所有Promise实例都执行完毕时，返回包含所有结果的新的Promise实例
              }
            },
            (reason) => {
              count++
              /**
               * 对于每个结果对象，都有一个 status 字符串。如果值为 rejected，则存在一个 reason 。
               * value（或 reason ）反映了每个 promise 决议（或拒绝）的值。
               */
              result[index] = {
                status: 'rejected',
                reason
              }
              // 所有给定的promise都已经fulfilled或rejected后,返回这个promise
              if (count === promises.length) {
                resolve(result) // 当所有Promise实例都执行完毕时，返回包含所有结果的新的Promise实例
              }
            }
          )
        })
      } else {
        return reject(new TypeError('Argument is not iterable'))
      }
    })
  }

  /**
   * Promise.any()
   * @param {iterable} promises 一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入
   * @returns
   */
  static any(promises) {
    return new GPromise((resolve, reject) => {
      // 参数校验
      if (Array.isArray(promises)) {
        let errors = [] //
        let count = 0 // 计数器

        // 如果传入的参数是一个空的可迭代对象，则返回一个 已失败（already rejected） 状态的 Promise。
        if (promises.length === 0)
          return reject(new AggregateError([], 'All promises were rejected'))

        promises.forEach((item) => {
          // 非Promise值，通过Promise.resolve转换为Promise
          item.then(
            (value) => {
              // 只要其中的一个 promise 成功，就返回那个已经成功的 promise
              resolve(value)
            },
            (reason) => {
              count++
              errors.push(reason)
              /**
               * 如果可迭代对象中没有一个 promise 成功，就返回一个失败的 promise 和AggregateError类型的实例，
               * AggregateError是 Error 的一个子类，用于把单一的错误集合在一起。
               */
              count === promises.length &&
                reject(new AggregateError(errors, 'All promises were rejected'))
            }
          )
        })
      } else {
        return reject(new TypeError('Argument is not iterable'))
      }
    })
  }

  /**
   * Promise.race()
   * @param {iterable} promises 可迭代对象，类似Array。详见 iterable。
   * @returns
   * 静态方法race，接收一个包含多个Promise实例的数组，返回一个新的Promise实例
   */
  static race(promises) {
    return new GPromise((resolve, reject) => {
      // 参数校验
      if (Array.isArray(promises)) {
        // 如果传入的迭代promises是空的，则返回的 promise 将永远等待。
        if (promises.length > 0) {
          promises.forEach((item) => {
            /**
             * 如果迭代包含一个或多个非承诺值和/或已解决/拒绝的承诺，
             * 则 Promise.race 将解析为迭代中找到的第一个值。
             */
            item.then(resolve, reject)
          })
        }
      } else {
        return reject(new TypeError('Argument is not iterable'))
      }
    })
  }
}

/**
 * promise 是可连续执行的？
 * 是可以的！
 */

new GPromise((resolve, reject) => {
  console.log(1)
  // return reject();
  return resolve()
})
  .then(() => {
    console.log(2)
  })
  .then(() => {
    console.log(3)
  })
  .then(() => {
    console.log(4)
  })
  .catch(() => {
    console.log('catch')
  })
  .finally(() => {
    console.log('finally', '---------------------------')
  })

setTimeout(() => {
  const myPromise1 = GPromise.resolve('2-1')

  const myPromise2 = new GPromise((resolve, reject) => {
    console.log('2-2')
    resolve('2-2')
  }).then((res) => {
    console.log('2-3')
    return res
  })

  GPromise.all([myPromise1, myPromise2]).then((res) => {
    console.log('result', res)
    console.log('--------------------')
  })
}, 1000)

setTimeout(() => {
  const Promise1 = Promise.resolve('3-1')

  const Promise2 = new Promise((resolve, reject) => {
    console.log('3-2')
    resolve('3-2')
  }).then((res) => {
    console.log('3-3')
    return res
  })

  Promise.all([Promise1, Promise2]).then((res) => {
    console.log('result', res)
  })
}, 2000)
