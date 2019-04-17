<template>
    <div class="app-container">
      <div class="header">
        <div>
          <el-form :inline="true" ref="searchForm" :model="searchForm" label-width="100px">
            <el-row>
              <el-form-item label="选择统计的时间段" label-width="150px" style="margin-bottom: 0;">
                <el-select size="small" style="width: 180px" v-model="timeOption_id" placeholder="时间选择">
                  <el-option v-for="timeOption in timeOptions" :key="timeOption.id" :label="timeOption.name" :value="timeOption.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="部门核算(建议每次只勾选1-2个)" label-width="220px" style="margin-bottom: 0;">
                <el-checkbox style="margin-top: 1px;" v-model="calculateDepartment_1">华建集团部门</el-checkbox>
                <el-checkbox style="margin-top: 1px;" v-model="calculateDepartment_2">华建电力部门</el-checkbox>
                <el-checkbox style="margin-top: 1px;" v-model="calculateDepartment_3">富华电力部门</el-checkbox>
                <el-checkbox style="margin-top: 1px;" v-model="calculateDepartment_4">华建物联部门</el-checkbox>
                <el-checkbox style="margin-top: 1px;" v-model="calculateDepartment_5">源通电力部门</el-checkbox>
                <el-checkbox style="margin-top: 1px;" v-model="calculateDepartment_6">华建云南部门</el-checkbox>
              </el-form-item>
            </el-row>
            <el-row style="margin-top: 5px;margin-bottom: 5px;margin-left: 30px">
                <el-button size="small" style="width: 150px" @click="onClickCreate" type="primary">生成报表</el-button>
                <el-checkbox style="margin-left: 30px" v-model="calculateBranch">显示分公司(非计算)</el-checkbox>
              <el-tag type="danger" size="small" style="background-color: #ffffff">提示: 本页面的分公司核算是以分组/项目的承建分公司来核算的,并非按报销人所属分公司!</el-tag>
              <el-tag type="danger" size="small" style="background-color: #ffffff">提示: 分公司其下的部门核算是以报销人所属部门来核算的!</el-tag>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="body">
        <el-row>
          <el-col>
            <el-table v-loading="loading" border stripe :data="accounts" show-summary :row-style="rowStyle" :cell-style="cellStyle" height="700">
              <el-table-column fixed="left" align="center" label="序号" width="60" prop="id"></el-table-column>
              <el-table-column fixed="left" align="center" label="科目名称" width="180" prop="subject_name"></el-table-column>
              <el-table-column fixed="left" align="right" label="总金额" width="150" prop="money_sum"></el-table-column>
              <el-table-column v-if="calculateBranch" align="right" label="华建集团" width="120" prop="HJJT_sum"></el-table-column>
              <el-table-column v-if="calculateBranch" align="right" label="华建电力" width="120" prop="HJDL_sum"></el-table-column>
              <el-table-column v-if="calculateBranch" align="right" label="富华电力" width="120" prop="FHDL_sum"></el-table-column>
              <el-table-column v-if="calculateBranch" align="right" label="华建物联" width="120" prop="HJWL_sum"></el-table-column>
              <el-table-column v-if="calculateBranch" align="right" label="源通电力" width="120" prop="YTDL_sum"></el-table-column>
              <el-table-column v-if="calculateBranch" align="right" label="华建云南" width="120" prop="HJYN_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_1" align="right" label="集团-总经办" width="120" prop="HJJT_zjb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_1" align="right" label="集团-财务部" width="120" prop="HJJT_cwb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_1" align="right" label="集团-经营部" width="120" prop="HJJT_jyb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_1" align="right" label="集团-综合部" width="120" prop="HJJT_zhb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_1" align="right" label="集团-项目部" width="120" prop="HJJT_xmb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_2" align="right" label="华建-综合部" width="120" prop="HJDL_zhb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_2" align="right" label="华建-新能院" width="120" prop="HJDL_xny_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_2" align="right" label="华建-云南" width="120" prop="HJDL_yn_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_2" align="right" label="华建-项目部" width="120" prop="HJDL_xmb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_2" align="right" label="华建-技经室" width="120" prop="HJDL_jjs_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_2" align="right" label="华建-设计部" width="120" prop="HJDL_sjb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_2" align="right" label="华建-设计一" width="120" prop="HJDL_sj1_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_2" align="right" label="华建-设计二" width="120" prop="HJDL_sj2_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_2" align="right" label="华建-设计三" width="120" prop="HJDL_sj3_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_2" align="right" label="华建-经营部" width="120" prop="HJDL_jyb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_3" align="right" label="富华-综合部" width="120" prop="FHDL_zhb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_3" align="right" label="富华-安全部" width="120" prop="FHDL_aqb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_3" align="right" label="富华-技术部" width="120" prop="FHDL_jsb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_3" align="right" label="富华-设计部" width="120" prop="FHDL_sjb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_3" align="right" label="富华-排查部" width="120" prop="FHDL_pcb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_3" align="right" label="富华-检测部" width="120" prop="FHDL_jcb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_4" align="right" label="物联-办公室" width="120" prop="HJWL_bgs_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_4" align="right" label="物联-平台部" width="120" prop="HJWL_ptb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_4" align="right" label="物联-研发部" width="120" prop="HJWL_yfb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_4" align="right" label="物联-测试部" width="120" prop="HJWL_csb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_4" align="right" label="物联-项目部" width="120" prop="HJWL_xmb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_5" align="right" label="源通-外协" width="120" prop="YTDL_wx_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_5" align="right" label="源通-工程部" width="120" prop="YTDL_gcb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_5" align="right" label="源通-办公室" width="120" prop="YTDL_ytdl_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_5" align="right" label="源通-成本中心" width="120" prop="YTDL_cb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_5" align="right" label="源通-技术部" width="120" prop="YTDL_jsb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_5" align="right" label="源通-综合部" width="120" prop="YTDL_zhb_sum"></el-table-column>
              <el-table-column v-if="calculateDepartment_6" align="right" label="云南-项目部" width="120" prop="HJYN_xmb_sum"></el-table-column>
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
  import { getAccountsSubject, createAccountsSubject } from '../../api/accounts'

  export default {
    data() {
      return {
        accounts: [],
        accounts_: [],
        searchForm: {},
        loading: false,
        calculateBranch: true,
        calculateDepartment_1: false,
        calculateDepartment_2: false,
        calculateDepartment_3: false,
        calculateDepartment_4: false,
        calculateDepartment_5: false,
        calculateDepartment_6: false,
        timeOption_id: -1,
        timeOptions: [
          { id: -1, name: '请选择时间', start_at: 1530374400, end_at: 1546272000 },
          { id: 0, name: '2018年07月', start_at: 1530374400, end_at: 1533052800 },
          { id: 1, name: '2018年08月', start_at: 1533052800, end_at: 1535731200 },
          { id: 2, name: '2018年09月', start_at: 1535731200, end_at: 1538323200 },
          { id: 3, name: '2018年10月', start_at: 1538323200, end_at: 1541001600 },
          { id: 4, name: '2018年11月', start_at: 1541001600, end_at: 1543593600 },
          { id: 5, name: '2018年12月', start_at: 1543593600, end_at: 1546272000 },
          { id: 6, name: '2019年01月', start_at: 1546272000, end_at: 1548950400 },
          { id: 7, name: '2019年02月', start_at: 1548950400, end_at: 1551369600 },
          { id: 8, name: '2019年03月', start_at: 1551369600, end_at: 1554048000 },
          { id: 9, name: '2019年04月', start_at: 1554048000, end_at: 1556640000 },
          { id: 10, name: '2019年05月', start_at: 1556640000, end_at: 1559318400 },
          { id: 11, name: '2019年06月', start_at: 1559318400, end_at: 1561910400 }
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
        if (this.timeOption_id === -1) {
          this.$message.error('错误: 请选择时间!')
          return false
        }
        let start_at = 0
        let end_at = 0
        let params = {}
        switch (this.timeOption_id) {
          case 0:
            start_at = 1530374400
            end_at = 1533052800
            break
          case 1:
            start_at = 1533052800
            end_at = 1535731200
            break
          case 2:
            start_at = 1535731200
            end_at = 1538323200
            break
          case 3:
            start_at = 1538323200
            end_at = 1541001600
            break
          case 4:
            start_at = 1541001600
            end_at = 1543593600
            break
          case 5:
            start_at = 1543593600
            end_at = 1546272000
            break
          case 6:
            start_at = 1546272000
            end_at = 1548950400
            break
          case 7:
            start_at = 1548950400
            end_at = 1551369600
            break
          case 8:
            start_at = 1551369600
            end_at = 1554048000
            break
          case 9:
            start_at = 1554048000
            end_at = 1556640000
            break
          case 10:
            start_at = 1556640000
            end_at = 1559318400
            break
          case 11:
            start_at = 1559318400
            end_at = 1561910400
            break
          default:
            this.$message.error('错误: 未知时间!')
            return
        }
        params = {
          start_at: start_at,
          end_at: end_at,
          calculateDepartment_1: this.calculateDepartment_1,
          calculateDepartment_2: this.calculateDepartment_2,
          calculateDepartment_3: this.calculateDepartment_3,
          calculateDepartment_4: this.calculateDepartment_4,
          calculateDepartment_5: this.calculateDepartment_5,
          calculateDepartment_6: this.calculateDepartment_6
        }
        this.loading = true
        createAccountsSubject(params).then(res => {
          if (res.data.bCode === 101) {
            this.$notify({ title: '生成成功', type: 'success', position: 'top-right' })
            this.fetchAccounts()
            this.loading = false
          } else {
            this.$notify({ title: '操作超时', type: 'warning', position: 'top-right' })
            this.fetchAccounts()
            this.loading = false
          }
        })
      },
      fetchAccounts() {
        this.accounts_ = []
        this.loading = true
        getAccountsSubject({ 'pageSize': 100, 'sort_name': 'id', 'sort': 4 }).then(res => {
          this.accounts = res.data._items
          this.loading = false
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
