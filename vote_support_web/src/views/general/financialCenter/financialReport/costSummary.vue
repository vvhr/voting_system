<template>
  <div class="app-container">
    费用汇总
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_pageSummary   beforeMount()
-->
<script>
  export default {
    name: 'costSummary',
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_pageSummary#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style scoped>

</style>
