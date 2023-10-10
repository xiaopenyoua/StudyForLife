let arr = [
  { a: 1, b: 2 },
  { b: 2, a: 1 },
  { a: 1, b: 2, c: { a: 1, b: 2 } },
  { b: 2, a: 1, c: { b: 2, a: 1 } }
]

// let arr = [1, 2, 3, 4, 5, 6, 1, 2, 5, 2, 3, 4]

const newArr = [...arr]

const isObject = (v) => typeof v === 'object' && v != null

// 对象数组去重

for (let i = 0; i < newArr.length; i++) {
  for (let j = i + 1; j < newArr.length; j++) {
    if (equals(newArr[i], newArr[j])) {
      newArr.splice(j, 1)
      j--
    }
  }
}

function equals(v1, v2) {
  // 有一个不是对象就当常量来比较
  if (!isObject(v1) || !isObject(v2)) {
    return Object.is(v1, v2)
  }
  // 都是对象，引用地址相同
  if (v1 === v2) {
    return true
  }

  // 递归比较
  const keys1 = Object.keys(v1)
  const keys2 = Object.keys(v2)

  if (keys1.length != keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (!v2[key]) {
      return false
    }
    const res = equals(v1[key], v2[key])

    if (!res) {
      return false
    }
  }

  return true
}


const arr1 = [1, [2, 3], { name: 'John' }];
const arr2 = [1, [2, 3], { name: 'John' }];
const arr3 = [1, [2, 3], { name: 'LiBai' }];

console.log(equals(arr1, arr2)); // true
console.log(equals(arr1, arr3)); // false

console.log(newArr)


const obj1 = {
  name: 'John',
  age: 30,
  address: {
    street: '123 Main St',
    city: 'New York'
  }
};

const obj2 = {
  name: 'John',
  age: 30,
  address: {
    street: '123 Main St',
    city: 'New York'
  }
};

const obj3 = {
  name: 'Jane',
  age: 25,
  address: {
    street: '456 Park Ave',
    city: 'Los Angeles'
  }
};

console.log(equals(obj1, obj2)); // true
console.log(equals(obj1, obj3)); // false
