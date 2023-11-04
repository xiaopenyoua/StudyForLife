const arrayData = [
  { id: 2, title: '中国', parent_id: 0 },
  { id: 3, title: '广东省', parent_id: 2 },
  { id: 4, title: '广州市', parent_id: 3 },
  { id: 5, title: '天河区', parent_id: 4 },
  { id: 6, title: '湖南省', parent_id: 2 },
  { id: 1, title: '俄罗斯', parent_id: 0 }
]

function arrayToTree(list, root) {
  const result = [] // 用于存放结果
  const map = {} // 用于存放 list 下的节点

  // 1. 遍历 list，将 list 下的所有节点以 id 作为索引存入 map
  for (const item of list) {
    map[item.id] = { ...item } // 浅拷贝
  }

  // 2. 再次遍历，将根节点放入最外层，子节点放入父节点
  for (const item of list) {
    // 3. 获取节点的 id 和 父 id
    const { id, parent_id } = item // ES6 解构赋值
    // 4. 如果是根节点，存入 result
    if (item.parent_id === root) {
      result.push(map[id])
    } else {
      // 5. 反之，存入到父节点
      map[parent_id].children
        ? map[parent_id].children.push(map[id])
        : (map[parent_id].children = [map[id]])
    }
  }

  // 将结果返回
  return result
}

// function arrayToTree(list, root) {
//   const result = []
//   getChildren(list, result, root)
//   return result

//   function getChildren(list, result, pid) {
//     for (const item of list) {
//       if (item.parent_id === pid) {
//         const newItem = {
//           children: [],
//           ...item
//         }

//         result.push(newItem)
//         getChildren(list, newItem.children, item.id)
//       }
//     }
//   }
// }

const tree = arrayToTree(arrayData, 0)
console.log(tree, '---------------------')

function treeToArray(tree) {
  const result = []
  handle(tree)

  function handle(data) {
    for (const item of data) {
      if (item.children) {
        handle(item.children)
        delete item.children
      }

      result.push(item)
    }
  }

  return result
}

const arr = treeToArray(tree)
console.log(arr)
