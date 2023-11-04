const arrayData = [
  { id: 2, title: '中国', parent_id: 0 },
  { id: 3, title: '广东省', parent_id: 2 },
  { id: 4, title: '广州市', parent_id: 3 },
  { id: 5, title: '天河区', parent_id: 4 },
  { id: 6, title: '湖南省', parent_id: 2 },
  { id: 1, title: '俄罗斯', parent_id: 0 }
]

function arrayToTree(tree, root) {
  const result = []
  const map = {}

  for (const item of tree) {
    map[item.id] = { ...item }
  }

  for (const item of tree) {
    const { id, parent_id } = item

    if (parent_id === root) {
      result.push(map[id])
    } else {
      map[parent_id].children
        ? map[parent_id].children.push(map[id])
        : (map[parent_id].children = [map[id]])
    }
  }

  return result
}

const tree = arrayToTree(arrayData, 0)
console.log(tree)
