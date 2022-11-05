<template>
  <el-breadcrumb separator="|" style="position: fixed;top: 60px;left: 60px;">
    <el-breadcrumb-item :to="{ path: '/home/index' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><slot></slot></el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "bread"
}
</script>

<style scoped>
:deep(.el-breadcrumb__inner.is-link:hover) {
  color: #111 !important;
}
</style>