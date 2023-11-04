// https://www.jianshu.com/p/12c0c001f77f

function isAsyncFunction(func) {
  return func[Symbol.toStringTag] === 'AsyncFunction'
}

console.log(
  'function >>> ',
  isAsyncFunction(() => {})
)
console.log(
  'async function >>> ',
  isAsyncFunction(async () => {})
)
console.log(
  'function Promise >>> ',
  isAsyncFunction(() => {
    return new Promise()
  })
)
