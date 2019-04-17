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
          <el-table-column  label="计划开始时间" width="110" align="center">
            <template slot-scope="scope">{{scope.row.plan_started_at | parseTime}}</template>
          </el-table-column>
          <el-table-column  label="计划完成时间" width="110" align="center">
            <template slot-scope="scope">{{scope.row.plan_completed_at | parseTime}}</template>
          </el-table-column>
          <el-table-column  label="项目完成时间" width="110" align="center">
            <template slot-scope="scope">{{scope.row.complete_at | parseTime}}</template>
          </el-table-column>
          <el-table-column prop="projectFh.project_manage" width="80" label="项目经理" align="center"></el-table-column>
          <el-table-column prop="projectFh.skiller" width="80" label="内业人员" align="center"></el-table-column>
          <el-table-column prop="projectFh.inner"  width="80"label="技术人员" align="center"></el-table-column>
          <el-table-column prop="projectFh.worker" width="80" label="工人" align="center"></el-table-column>
          <el-table-column  label="生产状态" width="80" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.projectFh !== null">{{scope.row.projectFh.status | parseStatus}}</div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="100">
            <!--isShowLeaderApply-->
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" type="primary" @click="onClickChange(scope.row)" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--修改页面-->
      <div id="dialog">
          <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" size="mini">
              <el-form-item label="项目类型">
                <el-select v-model="ruleForm.project_type_id" placeholder="请选择项目类型"  prop="itemType">
                  <el-option v-for="(item, key) in project_type" :label="item.name" :value="item.id" :key="key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目规模">
                <el-select v-model="ruleForm.projectFh.scale" placeholder="项目规模"  prop="itemType">
                  <el-option v-for="(item, key) in project_scale" :label="item.name" :value="item.id" :key="key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目经理">
                <el-select
                  v-model="ruleForm.projectFh.project_manage"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="关键词搜索，空格表示全部"
                  :remote-method="remoteMethod"
                  :loading="loading.customers"
                  style="width: 200px">
                  <el-option
                    v-for="item in user"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="技术人员">
                <el-select
                  v-model="ruleForm.projectFh.skiller"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="关键词搜索，空格表示全部"
                  :remote-method="remoteMethod"
                  :loading="loading.customers"
                  style="width: 200px">
                  <el-option
                    v-for="item in user"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="内业人员">
                <el-select
                  v-model="ruleForm.projectFh.inner"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="关键词搜索，空格表示全部"
                  :remote-method="remoteMethod"
                  :loading="loading.customers">
                  <el-option
                    v-for="item in user"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="工人">
                <el-select v-model="ruleForm.projectFh.worker" placeholder="请选择" prop="itemType" >
                  <el-option v-for="(item, key) in worker_group" :label="item.name" :value="item.name" :key="key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="计划开始时间">
                <el-date-picker
                  v-model="ruleForm.plan_started_at"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择完成日期"
                  style="width: 200px">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="计划完成时间">
                <el-date-picker
                  v-model="ruleForm.plan_completed_at"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择完成日期"
                  style="width: 200px">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="onSubmitForm">确 定</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>

      </div>
    </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_taskAllot_FH   beforeMount()
    修改分配: update_projectAssign_FH onSubmitForm()
-->
<script>
  import { parseTime } from '../../../utils'
  import { getProjects, updateProjectFh, getProject } from '../../../api/project'
  import { getUsers } from '../../../api/user'
  import { getCustomers } from '../../../api/customer'

  const defaultProjectFh = {
    id: null,
    scale: null, // 项目规模
    project_manage: '', // 项目经理
    project_id: null, // 项目关联ID
    skiller: '', // 技术人员
    inner: '', // 内业人员
    worker: '' // 工人,
  }
  const defaultRuleForm = {
    id: null,
    plan_started_at: null,
    plan_completed_at: null,
    project_type_id: null,
    flow_status: 1,
    projectFh: Object.assign({}, defaultProjectFh)
  }

  export default {
    name: 'taskAllot',
    data() {
      return {
        list: [],
        searchForm: {
          name: null,
          scale: null,
          project_type_id: null,
          time: [],
          branch_id: 3, // 富华电力
          start_at: null,
          end_at: null,
          origin_type: null, // 项目来源
          flow_status: null, // 分配状态
          page: 1,
          pageSize: 10,
          totalCount: 0
        },
        ruleForm: Object.assign({}, defaultRuleForm),
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
        if (value === 0 || value === '0') {
          return '小型'
        }
        if (value === 1 || value === '1') {
          return '中型'
        }
        if (value === 2 || value === '2') {
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
        return value
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
      this.fetchProjects()
    },
    methods: {
      // 获取页面信息
      fetchProjects() {
        getProjects(this.searchForm).then(res => {
          this.list = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      // 显示修改信息
      fetchProject(id) {
        return getProject({ id: id }).then(res => {
          res.data.plan_started_at > 0 ? res.data.plan_started_at *= 1000 : null
          res.data.plan_completed_at > 0 ? res.data.plan_completed_at *= 1000 : null
          this.ruleForm = Object.assign({}, res.data)
          this.ruleForm.projectFh === null ? this.ruleForm.projectFh = Object.assign({}, defaultProjectFh) : this.ruleForm = res.data
        })
      },
      // 提交修改
      onSubmitForm() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_projectAssign_FH#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.dialogVisible = false
        this.ruleForm.plan_started_at > 0 ? this.ruleForm.plan_started_at /= 1000 : null
        this.ruleForm.plan_completed_at > 0 ? this.ruleForm.plan_completed_at /= 1000 : null
        this.ruleForm.flow_status = 1
        updateProjectFh(this.ruleForm).then(res => {
          console.log('__', res)
          this.fetchProjects()
        })
      },
      // 打开修改界面
      onClickChange(item) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_projectAssign_FH#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.fetchProject(item.id).then(res => {
          this.ruleForm.projectFh.project_id = item.id
          this.ruleForm.id = item.id
          this.dialogVisible = true
          console.log(this.ruleForm)
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
          this.user = res.data._items
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
        console.log('2131', this.searchForm)
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
      if (this.actionCheck_.actionCheck('read_taskAllot_FH#') === false) {
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
