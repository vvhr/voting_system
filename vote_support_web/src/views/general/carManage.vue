<template>
  <div>
    车辆管理正在开发.....
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_carManage   beforeMount()
-->
<script>
  export default {
    name: 'carManage',
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_carManage#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style scoped>

</style>
