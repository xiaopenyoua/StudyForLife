<template>
  <div>
    <h3>拼音标注</h3>
    <div>
      {{ tip }}
    </div>

    <hr />
    <!-- <rb> - 下方内容主体， <rt> - 上方标注内容 <rp> - 当浏览器不兼容时备选显示内容 -->
    <ruby>
      <rb>汉字</rb>
      <rt>Han zi</rt>
      <rp>Han zi</rp>
    </ruby>

    <hr />
    <ruby>
      {{ word }}
      <rt>{{ pinyin }}</rt>
    </ruby>
    <hr />
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
import Pinyin from 'pinyin'

const tip = ref(
  '<rb> - 下方内容主体， <rt> - 上方标注内容 <rp> - 当浏览器不兼容时备选显示内容'
)

const word = ref('我爱中国')
const pinyin = ref('')
const pinyins = ref([])

function getPinyin() {
  let arr = Pinyin(word.value)
  pinyins.value = arr
  pinyin.value = arr.join('')
}

getPinyin()
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
