<template>
  <div>
    <el-button @click="send"> 发送 </el-button>
    <hr />
    <el-button type="primary" @click="showFile">打开文件夹</el-button>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  watchEffect,
  computed
} from 'vue'
// import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

const chennel = new BroadcastChannel('test')

const send = () => {
  console.log(555)
  chennel.postMessage({
    name: '李白'
  })
}

async function showFile() {
  try {
    let handle = await showDirectoryPicker(),
      root = await processHandle(handle),
      fileHandle = root.children[4],
      file = await fileHandle.getFile(),
      reader = new FileReader()

    reader.onload = ({ target: { result } }) => {
      console.log(result)
    }

    reader.readAsText(file, 'utf-8')
  } catch (error) {
    console.log(error)
    // 用户拒绝的处理
  }
}

async function processHandle(handle) {
  if (handle.kind == 'file') {
    return handle
  }

  handle.children = []

  // 得到异步迭代器
  let iterator = handle.entries()

  for await (let iter of iterator) {
    handle.children.push(await processHandle(iter[1]))
  }

  return handle
}
/**
 * 仓库
 */
// const store = useStore()
/**
 * 路由对象
 */
const route = useRoute()
/**
 * 路由实例
 */
const router = useRouter()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive({})
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(() => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
})
watchEffect(() => {})
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data)
})
</script>
<style scoped lang="less"></style>
