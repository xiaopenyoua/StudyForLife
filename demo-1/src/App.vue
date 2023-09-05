<script setup>
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>

<template>
  <el-menu
    :default-active="activeIndex2"
    class="el-menu-demo"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
    @select="handleSelect"
  >
    <el-menu-item index="/">首页</el-menu-item>
    <el-sub-menu index="2">
      <template #title>学海无涯</template>
      <el-menu-item index="item-1">拼音标注</el-menu-item>
      <el-menu-item index="item-2">item two</el-menu-item>
      <el-menu-item index="item-3">item three</el-menu-item>
      <el-sub-menu index="item-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="3" disabled>Info</el-menu-item>
    <el-menu-item index="item-1">Orders</el-menu-item>
  </el-menu>

  <div>
    <router-view></router-view>
  </div>
</template>
