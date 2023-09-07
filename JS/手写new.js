// new的底层实现

// 1）创建一个空对象{}

// 2）将该空对象的原型指向构造函数的原型；

// 3）改变this指向，调用构造函数，为空对象添加属性和方法，获得构造函数的返回值；

// 4）判断返回值类型，如果为引用类型，则返回返回值；如果为简单数据类型，则返回该空对象。

function myNew(Fn, ...args) {
  // 1. 创建一个空对象
  let obj = {}
  // 将该空对象的原型指向构造函数的原型；
  // 2.把新对象的__proto__指向其 构造函数 的prototype
  obj.__proto__ = Fn.prototype

  // 创建一个空对象，让其继承构造函数的原型
  // let obj = Object.create(Fn.prototype) // 等价于上面两步

  // 改变this指向，调用构造函数，为空对象添加属性和方法，获得构造函数的返回值；
  // 执行构造函数，让this指向obj，使其具有构造函数的属性
  let res = Fn.call(obj, ...args)

  // 判断返回值类型，如果为引用类型，则返回返回值；如果为简单数据类型，则返回该空对象。
  // 判断result的类型，如果是object或者function则直接返回

  if (
    ['[object Object]', '[object Function]'].includes(
      Object.prototype.toString.call(res)
    )
  ) {
    return res
  } else {
    return obj
  }
}

function Person(name, age) {
  this.name = name
  this.age = age
  // 返回非对象类型不会对new造成影响
  // return this.name + this.age
}
Person.prototype.say = function () {
  console.log('我是' + this.name + ',今年' + this.age + '岁')
}
// var obj = new Person('xxx', 20)
// console.log(obj)
// obj.say()

// 测试

let obj1 = myNew(Person, '小明', 20)
console.log(obj1)
obj1.say()
