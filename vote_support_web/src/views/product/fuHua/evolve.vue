<template>
    <div class="app-container">
      <div class="apply_header" style="background: #d3e8f1;padding-top: 5px;border-radius: 10px">
        <el-form size="mini" label-width="100px">
          <el-form-item label="搜索栏">
            <el-form ref="searchForm" :model="searchForm" label-width="100px" :inline="true" class="demo-form-inline" size="mini">
              <el-form-item label-width="70px" style="margin-right: 20px">
                <el-input v-model="searchForm.name" placeholder="项目名称"></el-input>
              </el-form-item>
              <el-form-item prop="customer_id" label-width="70px">
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
              <el-form-item  prop="origin_type" label-width="70px">
                <el-select v-model="searchForm.project_type_id" placeholder="项目类型">
                  <el-option v-for="(val, key) in project_type" :key="key" :label="val.name" :value="val.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item  prop="scale" label-width="70px">
                <el-select v-model="searchForm.scale" placeholder="项目规模">
                  <el-option v-for="(val, key) in project_scale" :key="key" :label="val.name" :value="val.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="flow_status" label-width="70px">
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
              <el-form-item label="" label-width="40px">
                <el-button type="primary" @click="onSubmitSearchForm()" icon="el-icon-search" circle ></el-button>
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
            <template slot-scope="scope">{{scope.row.project_type_id | parseType}}</template>
          </el-table-column>
          <el-table-column prop="name" label="项目规模" width="110" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.projectFh !== null">{{scope.row.projectFh.scale | projectScale}}</div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column prop="projectFh.project_manage" width="80" label="项目经理" align="center"></el-table-column>
          <el-table-column  label="计划开始时间" width="110" align="center">
            <template slot-scope="scope">{{scope.row.plan_started_at | parseTime}}</template>
          </el-table-column>
          <el-table-column  label="计划完成时间" width="110" align="center">
            <template slot-scope="scope">{{scope.row.plan_completed_at | parseTime}}</template>
          </el-table-column>
          <el-table-column  label="生产状态" width="80" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.projectFh !== null">{{scope.row.projectFh.status | parseStatus}}</div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column  label="预警提示" width="80" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.projectFh ===  null"></div>
              <div v-else-if="scope.row.projectFh.status < 6 && scope.row.plan_completed_at > 0"><el-tooltip :content="scope.row.plan_completed_at | parseHint" placement="top" ><div align="center" :class="(scope.row.plan_completed_at - time) | getAlertClass"></div></el-tooltip></div>
              <div v-else><el-tooltip content="该阶段已完成"><el-progress type="circle" :width="30" :stroke-width="2" :percentage="100" status="success"></el-progress></el-tooltip></div>
            </template>
          </el-table-column>
          <el-table-column prop="comment" label="备注" width="120" align="center"></el-table-column>
          <el-table-column label="生产状态详情" align="center" width="100">
            <template slot-scope="scope">
              <taskChild :id="scope.row.id" v-if="checkAccess.taskChild"></taskChild><a v-if="!checkAccess.taskChild">没有查看权限</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_evolve_FH   beforeMount()
    查看记录: read_projectHistory_FH checkAccessTaskChild()
-->
<script>
  import { parseTime } from '../../../utils'
  import { getProjects, updateProjectFh } from '../../../api/project'
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
          time: [],
          scale: null,
          project_type_id: null,
          branch_id: 3, // 富华电力
          start_at: null,
          end_at: null,
          origin_type: null, // 项目来源
          flow_status: null, // 分配状态
          page: 1,
          pageSize: 10,
          totalCount: 0
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
          { name: '排查', id: 8 },
          { name: '检测', id: 9 }
        ],
        worker_group: [
          { name: '盘永健', id: 0 },
          { name: '唐裕安', id: 1 }
        ],
        project_scale: [
          { id: null, name: '项目规模' },
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
        },
        checkAccess: {
          taskChild: true
        }
      }
    },
    filters: {
      parseTime: function(value) {
        if (value === null) {
          return '_________'
        }
        return parseTime(value, '{y}-{m}-{d}')
      },
      projectScale: function(value) {
        if (value === 0) {
          return '小型'
        }
        if (value === 1) {
          return '中型'
        }
        if (value === 2) {
          return '大型'
        }
        return value
      },
      parseStatus: function(value) {
        if (value === null) {
          return '尚未生产'
        }
        if (value === 0 || value === '0') {
          return '前期准备'
        }
        if (value === 1 || value === '1') {
          return '外业排查'
        }
        if (value === 2 || value === '2') {
          return '内业报告'
        }
        if (value === 3 || value === '3') {
          return '报告编制'
        }
        if (value === 4 || value === '4') {
          return '报告审核'
        }
        if (value === 5 || value === '5') {
          return '报告出版'
        }
        if (value === 6 || value === '6') {
          return '项目完成'
        }
        if (value === 7 || value === '7') {
          return '复查阶段'
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
      },
      parseType: function(value) {
        if (value === 8 || value === '8') {
          return '排查'
        }
        if (value === 9 || value === '9') {
          return '检测'
        }
        return value
      }
    },
    mounted() {
      this.checkAccessTaskChild()
      this.fetchProjects()
    },
    components: {
      taskChild
    },
    methods: {
      /** 检查查看记录的权限 */
      checkAccessTaskChild() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('read_projectHistory_FH#') === false) {
          this.checkAccess.taskChild = false
        }
      },
      fetchProjects() {
        getProjects(this.searchForm).then(res => {
          // console.log('____', res.data._items)
          this.list = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      // 打开修改界面???页面未应用
      onClickChange(item) {
        this.ruleForm.project_id = item.id
        this.ruleForm.id = item.id
        this.dialogVisible = true
      },
      // 提交修改???未应用
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
        console.log(this.searchForm)
        if (this.searchForm.time.length > 0) {
          this.searchForm.start_at = this.searchForm.time[0]
          this.searchForm.end_at = this.searchForm.time[1]
        }
        this.fetchProjects()
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
      if (this.actionCheck_.actionCheck('read_evolve_FH#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style scoped>
  .alertGreen{
    width: 30px;height: 30px; background: green; border-radius:30px;
  }

  .alertYellow{
    width: 30px;height: 30px; background: #8a6d3b; border-radius:30px;
  }

  .alertRed{
    width: 30px;height: 30px; background: red; border-radius:30px;
  }

  .alertPurple{
    width: 30px;height: 30px; background: black; border-radius:30px;
  }
</style>

<style>
  .apply_header .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 6px;
  }
</style>
