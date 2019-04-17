<template>
  <div class="app-container">
    <div class="apply_header" style="background: #d3e8f1;padding-top: 5px;border-radius: 10px">
      <el-form size="mini" label-width="100px">
        <el-form-item label="搜索栏">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini" label-width="70px">
            <el-form-item>
              <el-input v-model="searchForm.name" placeholder="项目名称"></el-input>
            </el-form-item>
            <el-form-item label-width="70px">
              <el-input v-model="searchForm.fen_team" placeholder="分包队伍"></el-input>
            </el-form-item>
            <el-form-item prop="branch_id">
              <el-select v-model="searchForm.branch_id" placeholder="承建公司">
                <el-option v-for="(val, key) in branch" :key="key" :label="val.name" :value="val.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="flow_status">
              <el-date-picker
                v-model="searchForm.time"
                type="daterange"
                value-format = "timestamp"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmitSearch" size="mini" icon="el-icon-search" ></el-button>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="操作栏">
          <el-button size="mini" type="primary"  @click="onSubmitCheck">返回放上一页</el-button>
          <el-button size="mini"  @click="onAssociatedApply">关联申请记录</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div style="padding:0 10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page="searchForm.currentPage"
        :page-sizes="[10,30,50,100]"
        :page-size="searchForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="searchForm.totalCount">
      </el-pagination>
    </div>
    <!--列表-->
    <el-table
      :data="list"
      stripe
      border
      fit
      :status-icon="true"
      style="width: 100%"
      :row-style="rowStyle" :cell-style="cellStyle"
      size="mini">
      <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
      <el-table-column prop="project.project_no" label="发票编号" width="100" align="center"></el-table-column>
      <el-table-column prop="project.name" label="项目名称" min-width="100" align="center"></el-table-column>
      <el-table-column label="承建公司" align="center" width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.project.branch_id | parseBranch}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fen_team" label="分包队伍" width="100" align="center"></el-table-column>
      <el-table-column prop="repay_cost" label="已支付金额" width="100" align="center"></el-table-column>
      <el-table-column prop="work_num" label="工程量" width="100" align="center"></el-table-column>
      <el-table-column prop="username" label="创建者" width="100" align="center"></el-table-column>
      <el-table-column label="创建日期" align="center" width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.create_at | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="生成类型" align="center" width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.apply_id === null?'直录':('申请(ID:'+ scope.row.apply_id + ')')}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_laoWuHistory   beforeMount()

-->
<script>
  import { getLwDetails, associatedApply } from '../../api/lwDetail'
  import Store from '../../store'
  import { parseTime } from '../../utils'
  import { getBranches } from '../../api/branch'

  export default {
    name: 'laoWuHistory',
    data() {
      return {
        searchForm: {
          branch_id: null,
          name: '',
          fen_team: null,
          time: [],
          page: 1,
          pageSize: 10,
          totalCount: 1
        },
        branch: [
          { id: null, name: '承建公司' }
        ], // 承建单位
        list: [],
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    filters: {
      parseBranch: function(value) {
        const list = Store.state.user.branches
        for (const index in list) {
          if (parseInt(list[index].id) === value) {
            return list[index].name
          }
        }
        return value
      },
      parseTime: function(value) {
        if (value === null) {
          return '_________'
        }
        return parseTime(value, '{y}-{m}-{d}')
      }
    },
    mounted() {
      this.fetchLwDetails()
      this.fetchBranches()
    },
    methods: {
      fetchLwDetails() {
        getLwDetails(this.searchForm).then(res => {
          console.log(res)
          this.list = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      // 获取承建公司列表
      fetchBranches() {
        getBranches().then(res => {
          for (const x in res.data) {
            this.branch.push(res.data[x])
          }
        })
      },
      // 一页多少行
      handleSizeChange(pageSize) {
        this.searchForm.pageSize = pageSize
        this.fetchLwDetails()
      },
      // 翻页
      handlePageChange(currentPage) {
        this.searchForm.page = currentPage
        this.fetchLwDetails()
      },
      onSubmitCheck() {
        this.$router.go(-1)
      },
      onSubmitSearch() {
        this.fetchLwDetails()
      },
      /** 关联申请ID 被点击*/
      onAssociatedApply() {
        associatedApply().then(res => {
          console.log('正常关联:', res.data.success)
          console.log('关联失败:', res.data.failed)
          this.$message.success('已完成关联!')
        })
      },
      /** -------- 表格样式设置方法 -------- */
      rowStyle() {
        return 'height: 25px'
      },
      cellStyle() {
        return 'padding: 2px'
      }
    },
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_laoWuHistory#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style>
  .apply_header .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 6px;
  }
</style>
