// Hash值，用来记录已经克隆过的对象，避免无限递归
// 用Map在垃圾回收机制中为强引用;即使cloneObject = null，Map中还是有对cloneObject原堆地址（内存地址索引）引用
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || obj === undefined) {
    // 如果是null或者undefined我就不进行拷贝操作
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj)
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj)
  }

  if (typeof obj !== 'object') {
    // 可能是对象或者普通的值  如果是函数的话是不需要深拷贝
    return obj
  }

  // 是对象的话就要进行深拷贝
  if (hash.has(obj)) {
    // 如果对象已经存在Hash表，则直接返回Hash表中该对象的克隆副本，避免重复克隆
    return hash.get(obj)
  }

  let cloneObj = new obj.constructor() // 找到的是所属类原型上的constructor,而原型上的 constructor指向的是当前类本身(构造函数)

  // 将对象与目标对象存入哈希表中，建立对象到目标对象的映射关系
  hash.set(obj, cloneObj)

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 实现一个递归拷贝
      cloneObj[key] = deepClone(obj[key], hash)
    }
  }

  return cloneObj
}

const obj1 = {
  name: 'init',
  arr: [1, [2, 3], 4],
  now: Date.now()
}

// 形成环引用
obj1.loop = obj1

const obj4 = deepClone(obj1) // 一个深拷贝方法
obj4.name = 'update'
obj4.arr[1] = [5, 6, 7] // 新对象跟原对象不共享内存
obj4.now = Date.now().toString(36)

console.log('obj1', obj1) // obj1 { name: 'init', arr: [ 1, [ 2, 3 ], 4 ] }
console.log('obj4', obj4) // obj4 { name: 'update', arr: [ 1, [ 5, 6, 7 ], 4 ] }

// const obj = {
//   // 基本类型
//   str: 'test',
//   num: 18,
//   boolean: true,
//   sym: Symbol('独一无二key'),

//   // 引用类型(以下8种数据对象均需进行真正意义上的深拷贝)
//   obj_object: { name: 'squirrel' },
//   arr: [123, '456'],
//   func: (name, age) => console.log(`姓名：${name}，年龄：${age}岁`),

//   map: new Map([
//     ['t', 100],
//     ['s', 200]
//   ]),
//   set: new Set([1, 2, 3]),
//   date: new Date(),
//   reg: new RegExp(/test/g)
// }

// // 形成环引用
// obj.loop = obj

// const result = deepClone(obj)
// console.log('手写deepClone结果:', result)
