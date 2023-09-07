function myInstanceOf(left, right) {
  // 左侧是基础数据类型直接返回 false

  if (left !== null && !['object', 'function'].includes(typeof left)) {
    return false
  }

  let proto = left.__proto__,
    prototype = right.prototype

  // 这两个值不相等就一直往上找 __proto__
  while (proto != prototype) {
    proto = proto.__proto__

    if (proto === null) {
      break
    }
  }

  return true
}

let str1 = 'string',
  str2 = new String('string'),
  arr = ['string']

console.log(myInstanceOf(str1, String))
console.log(myInstanceOf(str2, String))
console.log(myInstanceOf(arr, Array))
