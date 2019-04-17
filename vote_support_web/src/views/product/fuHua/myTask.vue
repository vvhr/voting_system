<template>
    <div class="app-container">
      <div class="apply_header" style="background: #d3e8f1;padding-top: 5px;border-radius: 10px">
        <el-form size="mini" label-width="100px">
          <el-form-item label="搜索栏">
            <el-form ref="searchForm" :model="searchForm" label-width="100px" class="demo-form-inline" :inline="true" size="mini">
                <el-form-item label-width="70px">
                  <el-input v-model="searchForm.name" placeholder="请填写项目名称"></el-input>
                </el-form-item>
                <el-form-item prop="customer_id" label-width="70px">
                  <!--<el-input v-model="ruleForm.customer_id"></el-input>-->
                  <el-select
                    v-model="searchForm.customer_id"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="关键词搜索客户名称，空格表示全部"
                    :remote-method="remoteMethod"
                    :loading="loading.customers">
                    <el-option
                      v-for="item in customers"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="origin_type" label-width="70px">
                  <el-select v-model="searchForm.project_type_id" placeholder="项目类型">
                    <el-option v-for="(val, key) in searchType" :key="key" :label="val.name" :value="val.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="scale" label-width="70px">
                  <el-select v-model="searchForm.scale" placeholder="项目规模">
                    <el-option v-for="(val, key) in searchScale" :key="key" :label="val.name" :value="val.id"></el-option>
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
                <el-form-item label-width="40px">
                <el-button @click="onSubmitSearchForm()" icon="el-icon-search" circle ></el-button>
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
          <el-table-column prop="project.project_no" label="项目编号" width="120" align="center"></el-table-column>
          <el-table-column prop="project.name" label="项目名称"  align="center"></el-table-column>
          <el-table-column prop="project.name" label="项目类型" width="100" align="center">
            <template slot-scope="scope">
              {{scope.row.project.project_type_id | parseType}}
            </template>
          </el-table-column>
          <el-table-column prop="project.name" label="项目规模" width="100" align="center">
            <template slot-scope="scope">
              {{scope.row.scale | parseScale}}
            </template>
          </el-table-column>
          <el-table-column prop="project.name" label="项目计划完成时间" width="120" align="center">
            <template slot-scope="scope">
              {{scope.row.project.plan_completed_at | parseTime}}
            </template>
          </el-table-column>
          <el-table-column prop="project.name" label="排查计划完成时间" width="120" align="center">
            <template slot-scope="scope">
              {{scope.row.fhComplete_at | parseTime}}
            </template>
          </el-table-column>
          <el-table-column prop="project.name" label="项目进度" width="120" align="center">
            <template slot-scope="scope">
              <el-progress :percentage="parseInt(scope.row.percent)" :stroke-width="3" color="green"></el-progress>
              <!--<el-progress type="circle" :percentage="parseInt(scope.row.percent)" :width="40" :stroke-width="2" color="green"></el-progress>-->
            </template>
          </el-table-column>
          <el-table-column prop="project.name" label="收款状态" width="100" align="center">
            <template slot-scope="scope">
              <el-button type="danger" @click="onReceiveStatus(item)" size="mini">{{scope.row.project.receive_status | receiveStatus}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="project.name" label="生产状态" width="100" align="center">
            <template slot-scope="scope">
              {{scope.row.status | parseStatus}}
            </template>
          </el-table-column>
          <el-table-column prop="project.name" label="操作记录" width="100" align="center">
            <template slot-scope="scope">
              <taskChild :id="scope.row.project_id"></taskChild>
            </template>
          </el-table-column>
          <el-table-column label="预警提示" width="100" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.status ===  null"></div>
              <div v-else-if="scope.row.status < 6 && scope.row.fhPlan_start_at > 0"><el-tooltip :content="scope.row.fhPlan_start_at | parseHint" placement="top"><div :class="(scope.row.fhPlan_start_at - time) | getAlertClass"></div></el-tooltip></div>
              <div v-else><el-tooltip content="该阶段已完成"><el-progress type="circle" :width="30" :stroke-width="2" :percentage="100" status="success"></el-progress></el-tooltip></div>
            </template>
          </el-table-column>
          <el-table-column prop="project.name" label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="onDialog(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--<table class="_table" border="0" cellpadding="0" cellspacing="0" style="width: 100%">-->
        <!--<thead>-->
        <!--<tr>-->
          <!--<th>序号</th>-->
          <!--<th>项目编号</th>-->
          <!--<th width="200px">项目名称</th>-->
          <!--<th>项目类型</th>-->
          <!--<th>项目规模</th>-->
          <!--<th>项目计划完成时间</th>-->
          <!--<th>排查计划完成时间</th>-->
          <!--<th>排查完成时间</th>-->
          <!--<th>项目进度</th>-->
          <!--<th>收款状态</th>-->
          <!--<th>生产状态</th>-->
          <!--<th>操作记录</th>-->
          <!--<th>预警提示</th>-->
          <!--<th>操作</th>-->
        <!--</tr>-->
        <!--</thead>-->
        <!--<tr v-for="(item, key) in list" :key="key">-->
          <!--<td>{{item.id}}</td>-->
          <!--<td>{{item.project.project_no}}</td>-->
          <!--<td>{{item.project.name}}</td>-->
          <!--<td>{{item.project.project_type_id | parseType}}</td>-->
          <!--<td>{{item.scale | parseScale}}</td>-->
          <!--<td>{{item.project.plan_completed_at | parseTime}}</td>-->
          <!--<td>{{item.fhPlan_start_at| parseTime}}</td>-->
          <!--<td>{{item.fhComplete_at | parseTime}}</td>-->
          <!--<td>{{item.percent}}%</td>-->
          <!--<td><el-button type="danger" @click="onReceiveStatus(item)">{{item.project.receive_status | receiveStatus}}</el-button></td>-->
          <!--<td>{{item.status | parseStatus}}</td>-->
          <!--<td><taskChild :id="item.project_id"></taskChild></td>-->
          <!--<td v-if="item.status ===  null"></td>-->
          <!--<td v-else-if="item.status < 6 && item.fhPlan_start_at > 0"><el-tooltip :content="item.fhPlan_start_at | parseHint" placement="top"><div :class="(item.fhPlan_start_at - time) | getAlertClass"></div></el-tooltip></td>-->
          <!--<td v-else><el-tooltip content="该阶段已完成"><el-button type="success"  size="mini" icon="el-icon-check" circle></el-button></el-tooltip></td>-->
          <!--<td> <el-button type="primary" icon="el-icon-edit" size="mini" @click="onDialog(item)"></el-button></td>-->
        <!--</tr>-->
      <!--</table>-->
      <!--修改页面-->
      <div id="dialog2">
        <el-dialog
          title="任务分配"
          :visible.sync="dialogVisible"
          width="30%">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px">
            <el-form-item label="项目完成情况" prop="status">
              <el-select v-model="ruleForm.status" placeholder="选择完成情况" style="width: 100%" >
                <el-option v-for="(item, key) in projectStatus" :label="item.name" :value="item.id" :key="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="完成进度(%)" prop="percent">
              <el-input type="text" auto-complete="off" v-model="ruleForm.percent"></el-input>
            </el-form-item>
            <el-form-item label="排查计划完成日期" prop="fhPlan_start_at">
              <el-date-picker
                v-model="ruleForm.fhPlan_start_at"
                type="date"
                value-format="timestamp"
                placeholder="选择完成日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="排查完成日期" v-if="completeTime" prop="fhComplete_at">
              <el-date-picker
                v-model="ruleForm.fhComplete_at"
                type="date"
                value-format="timestamp"
                placeholder="选择完成日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="修改项目备注">
              <el-input
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 10}"
                placeholder="请输入项目备注"
                v-model="ruleForm.project.comment">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="onSubmitForm('ruleForm')">确定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import { projectFhTask, projectFhView, projectFhUpdate } from '../../../api/projectFh'
  import { parseTime } from '../../../utils/index'
  import { getCustomers } from '../../../api/customer'
  import { replyRes } from '../../../utils/res'
  import { projectFhHistoryCreate } from '../../../api/projectFhHistory'
  import taskChild from './module/taskChild'
  import { updateProject } from '../../../api/project'

  export default {
    name: 'taskAllot',
    data() {
      return {
        list: [],
        searchForm: {
          start_at: null,
          end_at: null,
          name: null,
          scale: null,
          project_type_id: null,
          time: [],
          branch_id: 3,
          pageSize: 10,
          page: 1,
          totalCount: 0,
          textarea: ''
        },
        rules: {
          fhPlan_start_at: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          fhComplete_at: [
            { required: true, message: '请输入', trigger: 'blur' }
          ]
        },
        customers: {}, // 获取客户
        loading: {
          customers: false,
          users: false
        },
        searchScale: [
          { id: null, name: '项目规模' },
          { id: 0, name: '小型' },
          { id: 1, name: '中型' },
          { id: 2, name: '大型' }
        ],
        searchType: [
          { id: null, name: '项目类型' },
          { id: 8, name: '排查' },
          { id: 9, name: '检测' }
        ],
        dialogVisible: false,
        ruleForm: {
          id: null,
          status: 0,
          percent: null,
          fhPlan_start_at: null,
          fhComplete_at: null,
          project: {
            comment: ''
          }
        },
        projectStatus: [
          { id: 0, name: '前期准备' },
          { id: 1, name: '外业排查' },
          { id: 2, name: '报告编制' },
          { id: 3, name: '内业报告' },
          { id: 4, name: '报告审核' },
          { id: 5, name: '报告出版' },
          { id: 6, name: '项目完成' },
          { id: 7, name: '复查阶段' }
        ],
        time: Date.parse(new Date()) / 1000,
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
    computed: {
      completeTime() {
        if (this.ruleForm.status === 6) {
          this.ruleForm.percent = 100
          return true
        }
        return false
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
      parseType: function(value) {
        if (value === 8 || value === '8') {
          return '排查'
        }
        if (value === 9 || value === '9') {
          return '检测'
        }
        return value
      },
      parseScale: function(value) {
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
      receiveStatus: function(value) {
        if (value === 0 || value === '0') {
          return '未收款'
        }
        if (value === 1 || value === '1') {
          return '可收款'
        }
        if (value === 2 || value === '2') {
          return '收款中'
        }
        if (value === 3 || value === '3') {
          return '部分收款'
        }
        if (value === 4 || value === '4') {
          return '完成收款'
        }
        return value
      }
    },
    mounted() {
      this.fetchProjectFhTask()
    },
    methods: {
      // 获取列表
      fetchProjectFhTask() {
        projectFhTask(this.searchForm).then(res => {
          this.list = res.data._items
          console.log(this.list)
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      // 获取单条信息(显示修改信息)
      fetchProjectFhView(id) {
        projectFhView({ project_id: id }).then(res => {
          res.data.fhPlan_start_at > 0 ? res.data.fhPlan_start_at *= 1000 : null
          res.data.fhComplete_at > 0 ? res.data.fhComplete_at *= 1000 : null
          this.ruleForm = Object.assign(this.ruleForm, res.data)
        })
      },
      // 打开窗口
      onDialog(item) {
        this.fetchProjectFhView(item.project_id)
        this.dialogVisible = true
      },
      // 提交修改
      onSubmitForm(forName) {
        this.dialogVisible = false
        this.ruleForm.fhPlan_start_at > 0 ? this.ruleForm.fhPlan_start_at /= 1000 : null
        this.ruleForm.fhComplete_at > 0 ? this.ruleForm.fhComplete_at /= 1000 : null
        this.$refs[forName].validate((valid) => {
          if (valid) {
            return projectFhUpdate(this.ruleForm).then(res => {
              if (replyRes(res)) {
                console.log(res)
              }
              this.fetchProjectFhTask()
            }).then(res => {
              projectFhHistoryCreate(this.ruleForm).then(res => {
                console.log(res)
              })
            })
          } else {
            return false
          }
        })
      },
      // 一页多少行
      handleSizeChange(pageSize) {
        this.searchForm.pageSize = pageSize
        this.fetchProjectFhTask()
      },
      // 翻页
      handlePageChange(currentPage) {
        this.searchForm.page = currentPage
        this.fetchProjectFhTask()
      },
      /** 远程搜索客户列表方法 */
      remoteMethod(query) {
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
        }
        this.fetchProjectFhTask()
      },
      onReceiveStatus(item) {
        updateProject({ id: item.project_id, receive_status: 1 }).then(res => {
          if (replyRes(res)) {
            this.fetchProjectFhTask()
          }
        })
      },
      /** -------- 表格样式设置方法 -------- */
      rowStyle() {
        return 'height: 25px'
      },
      cellStyle() {
        return 'padding: 2px'
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

<style>
  .apply_header .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 6px;
  }
</style>
