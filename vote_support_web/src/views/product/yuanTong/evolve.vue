<template>
    <div class="app-container">
      <div class="apply_header" style="background: #d3e8f1;padding-top: 5px;border-radius: 10px">
        <el-form size="mini" label-width="100px">
          <el-form-item label="搜索栏">
            <el-form :inline="true" ref="searchForm" :model="searchForm" size="mini">
              <el-form-item>
                <el-input style="width: 300px" v-model="searchForm.name" placeholder="项目名称"></el-input>
              </el-form-item>
              <el-form-item  prop="customer_id">
                <!--<el-input v-model="ruleForm.customer_id"></el-input>-->
                <el-select
                  v-model="searchForm.customer_id"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="客户名称关键词搜索"
                  :remote-method="remoteMethodCustomer"
                  :loading="loading.customers">
                  <el-option
                    v-for="item in customers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item  prop="project_type_id">
                <el-select v-model="searchForm.project_type_id" placeholder="项目类型">
                  <el-option v-for="(val, key) in project_type" :key="key" :label="val.name" :value="val.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item  prop="flow_status">
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
                <el-button  type="primary" @click="onSubmitSearchForm()" icon="el-icon-search">搜索</el-button>
              </el-form-item>

            </el-form>
          </el-form-item>
        </el-form>
      </div>
      <!--分页器-->
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
      <div class="element_table">
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
          <el-table-column prop="project_no" label="项目编号" width="110" align="center"></el-table-column>
          <el-table-column prop="name" label="项目名称" align="center"></el-table-column>
          <el-table-column  label="项目类型" width="110" align="center">
            <template slot-scope="scope">{{scope.row.project_type_id | projectType}}</template>
          </el-table-column>
          <el-table-column prop="projectYt.project_manage" label="项目经理" width="110" align="center"></el-table-column>
          <el-table-column prop="projectYt.yt_scale" label="项目造价" width="110" align="center"></el-table-column>
          <el-table-column prop="projectYt.money_closing" label="结算金额" width="110" align="center"></el-table-column>
          <el-table-column  label="计划开始时间" width="110" align="center">
            <template slot-scope="scope">{{scope.row.plan_started_at | parseTime}}</template>
          </el-table-column>
          <el-table-column  label="计划完成时间" width="110" align="center">
            <template slot-scope="scope">{{scope.row.plan_completed_at | parseTime}}</template>
          </el-table-column>
          <el-table-column  label="项目完成时间" width="110" align="center">
            <template slot-scope="scope">{{scope.row.complete_at | parseTime}}</template>
          </el-table-column>
          <el-table-column label="项目进度" width="120" align="center">
            <template slot-scope="scope">
              <el-progress :percentage="parseInt(scope.row.projectYt.percent)" :stroke-width="3" color="green"></el-progress>
            </template>
          </el-table-column>
          <el-table-column label="预警提示" width="100" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.status ===  null"></div>
              <div v-else-if="scope.row.status < 7 && scope.row.flow_at > 0"><el-tooltip :content="scope.row.flow_at | parseHint" placement="top"><div :class="(scope.row.flow_at - time) | getAlertClass"></div></el-tooltip></div>
              <div v-else><el-tooltip content="该阶段已完成"><el-progress type="circle" :width="30" :stroke-width="2" :percentage="100" status="success"></el-progress></el-tooltip></div>
            </template>
          </el-table-column>
          <el-table-column label="生产状态" width="120" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.projectYt !== null">{{scope.row.projectYt.status > 0 ? scope.row.projectYt.status : '未开始' | parseStatus}}</div>
            </template>
          </el-table-column>
          <el-table-column label="生产记录" width="120" align="center">
            <template slot-scope="scope">
              <taskChild :id="scope.row.id"></taskChild>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--列表-->
      <!--<table class="_table" border="0" cellpadding="0" cellspacing="0" style="width: 100%">-->
        <!--<thead>-->
        <!--<tr>-->
          <!--<th>序号</th>-->
          <!--<th width="150px">项目编号</th>-->
          <!--<th width="150px">项目名称</th>-->
          <!--<th>项目类型</th>-->
          <!--<th>项目经理</th>-->
          <!--<th>项目造价</th>-->
          <!--<th>结算金额</th>-->
          <!--<th>计划开始时间</th>-->
          <!--<th>计划完成时间</th>-->
          <!--<th>实际完成时间</th>-->
          <!--<th>项目完成进度</th>-->
          <!--<th>项目预警</th>-->
          <!--<th>生产状态</th>-->
          <!--<th>生产记录详情</th>-->
        <!--</tr>-->
        <!--</thead>-->
        <!--<tr v-for="(item, key) in list" :key="key">-->
          <!--<td>{{item.id}}</td>-->
          <!--<td>{{item.project_no}}</td>-->
          <!--<td>{{item.name}}</td>-->
          <!--<td>{{item.project_type_id | projectType}}</td>-->
          <!--<td v-if="item.projectYt !== null">{{item.projectYt.project_manage}}</td>-->
          <!--<td v-else></td>-->
          <!--<td v-if="item.projectYt !== null">{{item.projectYt.yt_scale}}</td>-->
          <!--<td v-else></td>-->
          <!--<td v-if="item.projectYt !== null">{{item.projectYt.money_closing}}</td>-->
          <!--<td v-else></td>-->
          <!--<td>{{item.plan_started_at | parseTime}}</td>-->
          <!--<td>{{item.plan_completed_at | parseTime}}</td>-->
          <!--<td>{{item.complete_at | parseTime}}</td>-->
          <!--<td v-if="item.projectYt !== null">{{item.projectYt.percent}}%</td>-->
          <!--<td v-else></td>-->
          <!--<td v-if="item.projectYt ===  null"></td>-->
          <!--<td v-else-if="item.projectYt.status < 6 && item.plan_completed_at > 0"><el-tooltip :content="item.plan_completed_at| parseHint" placement="top"><div :class="(item.plan_completed_at - time) | getAlertClass"></div></el-tooltip></td>-->
          <!--<td v-else><el-tooltip content="该阶段已完成"><el-button type="success"  size="mini" icon="el-icon-check" circle></el-button></el-tooltip></td>-->
          <!--<td v-if="item.projectYt !== null">{{item.projectYt.status > 0 ? item.projectYt.status : '未开始' | parseStatus}}</td>-->
          <!--<td v-else></td>-->
          <!--<td><taskChild :id="item.id"></taskChild></td>-->
        <!--</tr>-->
      <!--</table>-->
    </div>
</template>
<!--
    Permissions on this page:
    页面访问: 	read_evolve_YT   beforeMount()
    查看进度: read_projectHistory_YT   onClickChange()

-->
<script>
  import { parseTime } from '../../../utils'
  import { getProjects, updateProjectFh, getProjectsAtTheTime } from '../../../api/project'
  import { getUsers } from '../../../api/user'
  import { getCustomers } from '../../../api/customer'
  import taskChild from './module/taskChild'

  export default {
    name: 'taskAllot',
    data() {
      return {
        list: [],
        searchForm: {
          name: null,
          // 计划完成时间
          time: [],
          yt_scale: null,
          project_type_id: null,
          branch_id: 5, // 富华电力
          start_at: null,
          end_at: null,
          origin_type: null, // 项目来源
          flow_status: null, // 分配状态
          page: 1,
          pageSize: 10,
          totalCount: 0,
          // 显示时段进度 选择框
          checked: false
        },
        time: Date.parse(new Date()) / 1000,
        user: [], // 获取用户
        customers: {}, // 获取客户
        loading: {
          customers: false,
          users: false
        },
        project_type: [
          { id: null, name: '项目类型' },
          { name: '电力施工', id: 5 },
          { name: '电力物探', id: 6 },
          { name: '电力物联', id: 7 },
          { name: '货物购销', id: 8 }
        ],
        worker_group: [
          { name: '盘永健', id: 0 },
          { name: '唐裕安', id: 1 }
        ],
        project_scale: [
          { id: null, name: '全部' },
          { name: '小型', id: 0 },
          { name: '中型', id: 1 },
          { name: '大型', id: 2 }
        ],
        dialogVisible: false,
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
    components: {
      taskChild
    },
    filters: {
      parseTime: function(value) {
        if (value === null) {
          return '_________'
        }
        return parseTime(value, '{y}-{m}-{d}')
      },
      parseStatus: function(value) {
        if (value === 0 || value === '0') {
          return '前期'
        }
        if (value === 1 || value === '1') {
          return '施工准备'
        }
        if (value === 2 || value === '2') {
          return '进场施工'
        }
        if (value === 3 || value === '3') {
          return '中间查验'
        }
        if (value === 4 || value === '4') {
          return '完工竣工'
        }
        if (value === 5 || value === '5') {
          return '竣工验收'
        }
        if (value === 6 || value === '6') {
          return '结算中'
        }
        if (value === 7 || value === '7') {
          return '完成结算'
        }
        return value
      },
      projectType: function(value) {
        if (value === 5 || value === '5') {
          return '电力施工'
        }
        if (value === 6 || value === '6') {
          return '电力物探'
        }
        if (value === 7 || value === '7') {
          return '电力物联'
        }
        if (value === 8 || value === '8') {
          return '货物购销'
        }
        return value
      },
      parseHint: function(value) {
        const time = Date.parse(new Date()) / 1000
        const timeDiffer = value - time
        if (timeDiffer > 5 * 86400) {
          return '距离完成时间超过5天'
        }
        if (5 * 86400 >= timeDiffer && timeDiffer > 2 * 86400) {
          return '距离完成时间2到5天'
        }
        if (2 * 86400 >= timeDiffer && timeDiffer > 0) {
          return '距离完成时间0到2天'
        }
        if (timeDiffer <= 0) {
          return '已超期'
        }
      },
      getAlertClass(time) {
        if (time >= 5 * 24 * 60 * 60) {
          return ['alertGreen']
        } else if (time >= 2 * 24 * 60 * 60 && time < 5 * 24 * 60 * 60) {
          return ['alertYellow']
        } else if (time >= 0 && time < 2 * 24 * 60 * 60) {
          return ['alertRed']
        }
        return ['alertPurple']
      }
    },
    mounted() {
      this.fetchProjects()
    },
    methods: {
      fetchProjects() {
        getProjects(this.searchForm).then(res => {
          this.list = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      fetchProjectsAtTheTime() {
        getProjectsAtTheTime(this.searchForm).then(res => {
          this.list = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      // 打开修改界面
      onClickChange(item) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('read_projectHistory_YT#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.ruleForm.project_id = item.id
        this.ruleForm.id = item.id
        this.dialogVisible = true
      },
      // 提交修改
      onSubmitForm() {
        updateProjectFh(this.ruleForm).then(res => {
          this.fetchProjects()
          this.dialogVisible = false
        })
      },
      // 一页多少行
      handleSizeChange(pageSize) {
        this.searchForm.pageSize = pageSize
        this.fetchProjects()
      },
      // 翻页
      handlePageChange(currentPage) {
        this.searchForm.page = currentPage
        this.fetchProjects()
      },
      /** 远程搜索客户列表方法 */
      remoteMethod(query) {
        this.loading.customers = true
        let params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getUsers(params).then(res => {
          this.customers = res.data._items
          this.loading.customers = false
        })
      },
      /** 远程搜索客户列表方法 */
      remoteMethodCustomer(query) {
        this.loading.customers = true
        let params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getCustomers(params).then(res => {
          console.log(res)
          this.customers = res.data._items
          this.loading.customers = false
        })
      },
      // 搜索
      onSubmitSearchForm() {
        if (this.searchForm.time.length > 0) {
          this.searchForm.start_at = this.searchForm.time[0]
          this.searchForm.end_at = this.searchForm.time[1]
          if (this.checked === true) {
            // 获取项目当时的进度信息
            this.fetchProjectsAtTheTime()
          } else this.fetchProjects()
        } else this.fetchProjects()
      },
      /** -------- 表格样式设置方法 -------- */
      rowStyle() {
        return 'height: 25px'
      },
      cellStyle() {
        return 'padding: 2px'
      }
    },
    // 页面权限检查 如无权限则跳转至404
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_evolve_YT#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style scoped>
  .alertGreen{
    width: 38px;height: 39px; background: green; border-radius:39px;
  }

  .alertYellow{
    width: 38px;height: 39px; background: #8a6d3b; border-radius:39px;
  }

  .alertRed{
    width: 38px;height: 39px; background: red; border-radius:39px;
  }

  .alertPurple{
    width: 38px;height: 39px; background: black; border-radius:39px;
  }
</style>
