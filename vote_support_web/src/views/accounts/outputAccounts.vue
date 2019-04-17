<template>
   <div>产值核算</div>
</template>
<!--
    Permissions on this page:
    页面访问: read_outputAccounts   beforeMount()
    更新核算: update_outputAccounts onclick()
-->
<script>
  export default {
    name: 'outputAccounts',
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_outputAccounts#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style scoped>

</style>
