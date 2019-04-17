<template>
    <div class="app-container">
      <div class="header">
        <el-form :inline="true" ref="searchForm" :model="searchForm" label-width="100px">
          <el-form-item>
            <el-select size="small" style="width: 180px" v-model="timeOption_id" placeholder="时间选择">
              <el-option v-for="timeOption in timeOptions" :key="timeOption.id" :label="timeOption.name" :value="timeOption.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="onClickCreate" type="primary">生成报表</el-button>
            <el-tag type="primary">提示: 本页面的分公司和部门核算皆是由报销人所属部门和分公司来核算!</el-tag>
          </el-form-item>
        </el-form>
      </div>
      <div class="body">
        <el-row>
          <el-col :span="4" style="margin-right: 20px">
            <el-table border stripe fit :data="accounts_" show-summary :row-style="rowStyle" :cell-style="cellStyle">
              <el-table-column align="center" label="分公司" prop="name"></el-table-column>
              <el-table-column align="right" label="总金额" width="150" prop="money_total_sum"></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="18">
            <el-table border stripe :data="accounts" show-summary :row-style="rowStyle" :cell-style="cellStyle" height="700">
              <el-table-column align="center" label="序号" width="60" prop="id"></el-table-column>
              <el-table-column align="left" label="分公司 + 部门 + 时间" prop="name"></el-table-column>
              <el-table-column align="right" label="总金额" width="150" prop="money_total_sum"></el-table-column>
              <el-table-column align="right" label="基础报销" width="120" prop="money_basic_sum"></el-table-column>
              <el-table-column align="right" label="物资采购" width="120" prop="money_goods_sum"></el-table-column>
              <el-table-column align="right" label="综合报销" width="120" prop="money_general_sum"></el-table-column>
              <el-table-column align="right" label="工人付款" width="120" prop="money_laowu_sum"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_pageDepartmentAccounts   beforeMount()
    生成报表: create_departmentAccounts onClickCreate()
-->
<script>
  import { getAccountsDepartment, createAccountsDepartment } from '../../api/accounts'

  export default {
    data() {
      return {
        accounts: [],
        accounts_: [],
        searchForm: {},
        timeOption_id: -2,
        timeOptions: [
          { id: -2, name: '请选择时间', start_at: 1530374400, end_at: 1546272000 },
          { id: -1, name: '至今', start_at: 1530374400, end_at: Math.round(new Date() / 1000) },
          { id: 0, name: '2018年7-12月', start_at: 1530374400, end_at: 1546272000 },
          { id: 1, name: '2018年11月', start_at: 1541001600, end_at: 1543593600 },
          { id: 2, name: '2018年12月', start_at: 1543593600, end_at: 1546272000 },
          { id: 3, name: '2019年1月', start_at: 1546272000, end_at: 1548950400 },
          { id: 4, name: '2019年2月', start_at: 1548950400, end_at: 1551369600 },
          { id: 5, name: '2019年3月', start_at: 1551369600, end_at: 1554048000 },
          { id: 6, name: '2019年4月', start_at: 1554048000, end_at: 1556640000 },
          { id: 7, name: '2019年5月', start_at: 1556640000, end_at: 1559318400 },
          { id: 8, name: '2019年6月', start_at: 1559318400, end_at: 1561910400 }
        ]
      }
    },
    methods: {
      onClickCreate() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('create_departmentAccounts#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        let start_at = 0
        let end_at = 0
        let name = ''
        switch (this.timeOption_id) {
          case -2:
            this.$message.error('错误: 请选择时间!')
            return
          case -1:
            start_at = 1530374400
            end_at = Math.round(new Date() / 1000)
            name = '2018年7月至今'
            break
          case 0:
            start_at = 1530374400
            end_at = 1546272000
            name = '2018年7-12月'
            break
          case 1:
            start_at = 1541001600
            end_at = 1543593600
            name = '2018年11月'
            break
          case 2:
            start_at = 1543593600
            end_at = 1546272000
            name = '2018年12月'
            break
          case 3:
            start_at = 1546272000
            end_at = 1548950400
            name = '2019年1月'
            break
          case 4:
            start_at = 1548950400
            end_at = 1551369600
            name = '2019年2月'
            break
          case 5:
            start_at = 1551369600
            end_at = 1554048000
            name = '2019年3月'
            break
          case 6:
            start_at = 1554048000
            end_at = 1556640000
            name = '2019年4月'
            break
          case 7:
            start_at = 1556640000
            end_at = 1559318400
            name = '2019年5月'
            break
          case 8:
            start_at = 1559318400
            end_at = 1561910400
            name = '2019年6月'
            break
          default:
            this.$message.error('错误: 未知时间!')
            return
        }
        const params = { name: name, start_at: start_at, end_at: end_at }
        createAccountsDepartment(params).then(res => {
          if (res.data.bCode === 101) {
            this.$notify({
              title: '生成成功',
              type: 'success',
              position: 'top-right'
            })
            this.fetchAccounts()
          }
        })
      },
      fetchAccounts() {
        this.accounts_ = []
        getAccountsDepartment({ 'pageSize': 50, 'sort_name': 'id', 'sort': 4 }).then(res => {
          this.accounts = res.data._items
          this.branchAccounts(1, '华建集团')
          this.branchAccounts(2, '华建电力')
          this.branchAccounts(3, '富华电力')
          this.branchAccounts(4, '华建物联')
          this.branchAccounts(5, '源通电力')
          this.branchAccounts(6, '华建云南')
        })
      },
      // 分公司核算
      branchAccounts(branch_id, name) {
        getAccountsDepartment({ 'branch_id': branch_id }).then(res => {
          const accounts = res.data._items
          let money_sum = 0
          for (let i = 0; i < accounts.length; i++) {
            money_sum = (Number(money_sum) + Number(accounts[i].money_total_sum)).toFixed(2)
          }
          const accounts_0 = { id: branch_id, money_total_sum: money_sum, name: name }
          this.accounts_.push(accounts_0)
        })
      },
      /** -------- 表格样式类 -------- */
      rowStyle({ row, rowIndex }) {
        return 'height: 25px'
      },
      cellStyle({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 2) {
          return 'color: #dc6969;padding: 2px'
        }
        return 'padding: 2px'
      }
    },
    mounted() {
      this.fetchAccounts()
    },
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_pageDepartmentAccounts#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style scoped>

</style>
