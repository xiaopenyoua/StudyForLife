function myInstanceOf(left, right) {
  // 判断左侧是否为基数据类型，如果是直接返回 false
  if (left !== null && !['object', 'function'].includes(typeof left)) {
    return false
  }

  // 获取左侧对象的原型和右侧构造函数的原型
  let proto = left.__proto__,
    prototype = right.prototype

  // 如果两个值不相等，则继续向上查找原型链的 __proto__ 属性，直到找到相等的值或原型链的根对象
  while (proto != prototype) {
    proto = proto.__proto__

    // 如果原型链的根对象被找到，则返回 false
    if (proto === null) {
      return false
    }
  }

  // 返回 true，表示左侧对象是右侧构造函数创建的对象
  return true
}

let str1 = 'string',
  str2 = new String('string'),
  arr = ['string']

console.log(myInstanceOf(str1, String)) // str1只是一个以string为数据类型的值，但并不属于String对象的实例
console.log(myInstanceOf(str2, String))
console.log(myInstanceOf(arr, Array))
