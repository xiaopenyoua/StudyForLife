// 需要注意的是，for...of 循环只能用于可迭代对象，并且会遍历对象的迭代器方法（即 Symbol.iterator），而 for...in 循环会遍历对象的所有可枚举属性，包括原型链上的属性。(https://github.com/pro-collection/interview-question/issues/520)

let obj = {
  a: 1,
  b: 2,
  c: 3
}

obj.__proto__[Symbol.iterator] = function* values() {
  console.log(this, 'this')
  for (const key in this) {
    // for...in 循环会遍历对象的所有可枚举属性，包括原型链上的属性。所以会判断 属性值存在与否
    if (obj.hasOwnProperty(key)) {
      yield [key, this[key]] // yield 关键字使生成器函数执行暂停，yield 关键字后面的表达式的值返回给生成器的调用者。它可以被认为是一个基于生成器的版本的 return 关键字。
    }
  }
}

for (const iterator of obj) {
  console.log(iterator)
}

// 数组扁平化

function* iteArr(arr) {
  if (Array.isArray(arr)) {
    for (const i in arr) {
      yield* iteArr(arr[i]) // 递归
    }
  } else {
    // 离开
    yield arr
  }
}

// 使用 for-of 遍历：
let arr = ['a', ['b', 'c'], ['d', ['e', ['f', 'g']]]]

let gen = iteArr(arr)

// 这里会执行 生成器函数，并把状态改为 closed
console.log([...gen], '---------------')

// 上面改变了状态为 cloaed，所以这里不会执行
for (const ite of gen) {
  console.log(ite, 'ite')
}
