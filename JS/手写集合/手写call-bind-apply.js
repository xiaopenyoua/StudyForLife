//简单模拟Symbol属性
function jawilSymbol(obj) {
  var unique_proper = '00' + Math.random()
  if (obj.hasOwnProperty(unique_proper)) {
    jawilSymbol(obj) //如果obj已经有了这个属性，递归调用，直到没有这个属性
  } else {
    return unique_proper
  }
}

Function.prototype.myApply = function (context) {
  context = context || window // 需要判断 this 是否传入了

  let fn = Symbol() // 保证 this 上面没有 fn 这个属性 或者 Date.now().toString(36);

  // 首先要获取调用call的函数，用this 就可以
  context[fn] = this

  let args = arguments[1] //获取传入的数组参数

  let result
  if (args) {
    result = eval('context[fn](' + args.toString() + ')') //得到"context.fn(arg1,arg2,arg3...)"这个字符串在，最后用eval执行
  } else {
    //没有传入参数直接执行
    result = context[fn]()
  }

  delete context[fn]
  return result
}

Function.prototype.myCall = function (context) {
  context = context || window // 需要判断 [this] 是否传入了

  let fn = Symbol() // 保证 this 上面没有 fn 这个属性  或者 Date.now().toString(36);

  // 首先要获取调用call的函数，用this 就可以
  context[fn] = this

  let args = Array.from(arguments).slice(1) //获取传入的数组参数(arguments 类数组对象，没有Array 的方法）

  let result
  if (args) {
    result = eval('context[fn](' + args.toString() + ')') //得到"context.fn(arg1,arg2,arg3...)"这个字符串在，最后用eval执行
  } else {
    //没有传入参数直接执行
    result = context[fn]()
  }

  delete context[fn]
  return result
}

Function.prototype.myBind = function (context) {
  //这里的this就是调用bind的函数（普通函数this指向调用者）
  if (typeof this !== 'function') {
    throw new TypeError('Not a Function')
  }
  let that = this // 调用bind的函数
  let args = Array.from(arguments).slice(1) //获取传入的数组参数(arguments 类数组对象，没有Array 的方法）

  // let F = function () {}
  // F.prototype = this.prototype // 这里的 F.prototype 指的是 F 的一个名为 "prototype" 的常规属性。并不是原型链中的 prototype
  // 如果 F.prototype 是一个对象，那么 new 操作符会使用它 为新对象设置 [[Prototype]]。（这里的[[Prototype]]指的是 原型链的 prototype）
  // https://juejin.cn/post/6844904090615431176

  let bound = function () {
    // 这里的this 表示调用者 bound
    let bindArgs = Array.from(arguments).slice(1)
    // 柯里化
    let finalArgs = args.concat(bindArgs)
    // 这里区分里 返回的函数怎么调用
    // 1. 直接调用
    // 2. 通过 new
    // 通过new 某个构造函数时，构造函数里的this会指向一个新创建的对象，然后执行构造函数中的代码，这个对象的[[prototype]]会指向构造函数的prototype属性，那么此时只需要在绑定函数（bind的返回函数——bound，此时也是作为一个构造函数来使用的）内部判断this是否指向bound的原型即可。

    if (this instanceof bound) {
      // 当 bind 返回的函数作为构造函数的时候，bind绑定的this会失效，但是其他的参数依然有效
      return new that(...finalArgs)
    } else {
      return that.myApply(context || window, finalArgs)
    }
  }
  // 构造函数 bound 的原型 指向 this.prototype
  // new调用绑定函数时，绑定函数的prototype属性存在与返回的实例对象的原型链上
  // 这里和 obj.__proto__ = Fn.prototype 是一个意思 (继承构造函数的原型)
  bound.prototype = that.prototype
  return bound
}

//简单写一个不带参数的demo
var jawil = {
  name: 'jawil',
  sayHello: function (age) {
    console.log(this.name, age)
  }
}

var lulin = {
  name: 'lulin'
}

function sayHello(age) {
  return {
    name: this.name,
    age: age
  }
}

//看看结果：
jawil.sayHello.myApply(lulin, [24]) //lulin
jawil.sayHello.myCall(lulin, 24) //lulin

console.log(sayHello.myBind(lulin, 24)()) // 完美输出{name: "jawil", age: 24}
