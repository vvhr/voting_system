<template>
  <div class="app-container">
    <!--搜索表单-->
    <div>
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="分公司">
          <el-select v-model="searchForm.branch_id" placeholder="请选择所属分公司">
            <el-option label="所有" :value="0" :key="-1"></el-option>
            <el-option v-for="(branch, key) in branches" :label="branch.name" :value="parseInt(branch.id)" :key="key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="所有" :value="0" :key="-1"></el-option>
            <el-option v-for="(value, key) in taskStatus" :label="value" :value="parseInt(key)" :key="key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="创建日期">
          <el-date-picker
            v-model="searchForm.dateRange"
            value-format = "timestamp"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--任务列表-->
    <!--会议记录分页器-->
    <div style="padding:0 10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.currentPage"
        :page-sizes="[2,5,10,20,30]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.totalCount">
      </el-pagination>
    </div>
    <table class="_table" border="0" cellpadding="0" cellspacing="0">
      <thead>
      <tr>
        <th>Id</th>
        <th>任务名称</th>
        <th>任务状态</th>
        <th>分公司</th>
        <th>部门</th>
        <th>执行人</th>
        <th>创建日期</th>
        <!--<th>更新日期</th>-->
        <th>计划完成日期</th>
        <th>已执行天数</th>
        <th>剩余天数</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="(v, k) in tasks" :key="k">
        <td>{{v.id}}</td>
        <td>{{v.name}}</td>
        <td>{{taskStatus[v.status]}}</td>
        <td>{{v.branch_name}}</td>
        <td>{{v.department_name}}</td>
        <td>{{v.user_name}}</td>
        <td>{{v.created_at | parseTime}}</td>
        <!--<td>{{v.updated_at | parseTime}}</td>-->
        <td>{{v.ended_at | parseTime }}</td>
        <td>{{v.status === 2?Math.floor((v.updated_at - v.created_at)/86400):Math.floor(((new Date())/1000 - v.created_at)/86400+1) }}</td>
        <td>{{v.status === 2?'已完成':Math.floor((v.ended_at - (new Date())/1000)/86400)+1 }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  import { getTasks } from '../../api/task'
  import { parseTime } from '../../utils'

  export default {
    data() {
      return {
        // 带快捷键的时间选择器选项参数
        pickerOptions: {
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
        },
        pageInfo: {
          currentPage: 1,
          pageSize: 5,
          totalCount: 0
        },
        searchForm: {
          branch_id: 0,
          status: 0,
          dateRange: []
        },
        taskStatus: { 1: '执行中', 2: '已完成' },
        tasks: []
      }
    },
    filters: {
      parseTime: function(value) {
        if (!value) return ''
        value = value.toString()
        return parseTime(value, '{y}-{m}-{d}')
      }
    },
    computed: {
      branches() {
        return this.$store.state.user.branches
      },
      finalSearchForm() {
        const res = Object.assign({}, this.searchForm)
        res.expand = 'user_name,department_name,branch_name'
        if (res.dateRange !== null && res.dateRange.length > 0) {
          res.started_at = Math.floor(res.dateRange[0] / 1000)
          res.ended_at = Math.floor(res.dateRange[1] / 1000)
        } else {
          res.started_at = 0
          res.ended_at = 0
        }
        res.pageSize = this.pageInfo.pageSize
        res.page = this.pageInfo.currentPage
        console.log('___', res)
        return res
      }
    },
    mounted() {
      this.fetchTasks(this.finalSearchForm)
    },
    methods: {
      fetchTasks(parmas) {
        getTasks(parmas).then(res => {
          this.tasks = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
        })
      },
      onSearch() {
        this.fetchTasks(this.finalSearchForm)
      },
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize
        this.fetchTasks(this.finalSearchForm)
      },
      handleCurrentChange(currentPage) {
        this.pageInfo.currentPage = currentPage
        this.fetchTasks(this.finalSearchForm)
      }
    }
  }
</script>
