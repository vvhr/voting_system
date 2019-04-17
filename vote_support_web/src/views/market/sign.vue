<template>
  <div class="app-container">
    <div class="apply_header" style="background: #d3e8f1;padding-top: 5px;border-radius: 10px">
      <el-form size="mini" label-width="100px">
        <el-form-item label="搜索栏">
          <el-form ref="searchForm" :model="searchForm"  :inline="true" class="demo-form-inline" size="mini">
            <el-form-item >
              <el-input v-model="searchForm.name" placeholder="项目名称关键字"></el-input>
            </el-form-item>
            <el-form-item prop="customer_id" >
              <!--<el-input v-model="ruleForm.customer_id"></el-input>-->
              <el-select
                v-model="searchForm.customer_id"
                filterable
                remote
                reserve-keyword
                placeholder="客户名称"
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
            <el-form-item prop="branch_id" >
              <el-select v-model="searchForm.branch_id" placeholder="承建公司" >
                <el-option v-for="(val, key) in branch" :key="key" :label="val.name" :value="val.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="project_type_id" >
              <el-select v-model="searchForm.project_type_id" placeholder="承建公司" >
                <el-option v-for="(val, key) in projectTypeId" :key="key" :label="val.name" :value="val.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item  prop="origin_type" label-width="70px">
              <el-select v-model="searchForm.sign_status" placeholder="签订状态"  >
                <el-option v-for="(val, key) in contractSign" :key="key" :label="val.name" :value="val.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item  prop="origin_type" label-width="70px">
              <el-select v-model="searchForm.receive_status" placeholder="收款状态"  >
                <el-option v-for="(val, key) in receive_status" :key="key" :label="val.name" :value="val.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item  prop="progress_status" label-width="70px">
              <el-select v-model="searchForm.progress_status" placeholder="合同状态" >
                <el-option v-for="(val, key) in contractStatus" :key="key" :label="val.name" :value="val.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item >
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
        :data="list._items"
        stripe
        border
        fit
        :status-icon="true"
        style="width: 100%"
        :row-style="rowStyle" :cell-style="cellStyle"
        size="mini">
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="project_no" label="合同编号" width="110" align="center"></el-table-column>
        <el-table-column prop="name" label="项目名称" align="center"></el-table-column>
        <el-table-column  label="合同类型" align="center" width="100">
          <template slot-scope="scope">{{scope.row.origin_type | parseOriginType}}</template>
        </el-table-column>
        <el-table-column  label="承建公司" align="center" width="100">
          <template slot-scope="scope">{{scope.row.branch_id | parseBranch}}</template>
        </el-table-column>
        <el-table-column prop="customer_name" label="委托单位" width="100" align="center"></el-table-column>
        <el-table-column  label="签订时间" align="center" width="100">
          <template slot-scope="scope">{{scope.row.sign_at | parseTime}}</template>
        </el-table-column>
        <el-table-column  label="项目类型" align="center" width="100">
          <template slot-scope="scope">{{scope.row.project_type_id | parseProjectStatus}}</template>
        </el-table-column>
        <el-table-column  label="合同状态" align="center" width="100">
          <template slot-scope="scope">{{scope.row.sign_status === 0 ? '未签订' : '已签订'}}</template>
        </el-table-column>
        <el-table-column  label="收款状态" align="center" width="100">
          <template slot-scope="scope">{{scope.row.receive_status | receiveStatus}}</template>
        </el-table-column>
        <el-table-column  label="生产详情" align="center" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.flowType !== null">{{scope.row.flowType.flow_id | flowName}}:{{scope.row.flowType.status | productStatus}}:{{scope.row.flowType.checkStatus | parseCheckStatus}}</div>
            <div v-else-if="scope.row.projectFh !== null">{{scope.row.projectFh.status | parseProjectFh}}</div>
            <div v-else-if="scope.row.projectYt !== null">{{scope.row.projectYt.status | parseProjectFh}}</div>
            <div v-else></div>
          </template>
        </el-table-column>
        <el-table-column  label="操作" align="center" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button @click="onDialogSign(scope.row)" size="mini" type="primary">合同签订</el-button><el-button @click="onDialogSignFinish(scope.row)" type="primary" size="mini">合同状态</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div id="dialog">
      <!--签订状态日期-->
      <el-dialog
        title="请选择签订日期"
        :visible.sync="visiable.dialogVisible"
        width="30%">
        <el-form ref="ruleFormSign" :model="ruleFormSign" :rules="rules" label-width="80px">
          <el-form-item label="合同状态" prop="origin_type">
            <el-select v-model="ruleFormSign.sign_status" placeholder="请选择合同状态">
              <el-option v-for="(val, key) in SignStatus" :key="key" :label="val.name" :value="val.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="签订日期" prop="sign_at">
            <el-date-picker
              v-model="ruleFormSign.sign_at"
              type="date"
              value-format="timestamp"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="visiable.dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="onSubmitForm('ruleFormSign')">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--合同状态日期-->
      <el-dialog
        title="请选择完成日期"
        :visible.sync="visiable.DialogFinish"
        width="30%">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
          <el-form-item label="合同状态" prop="origin_type">
            <el-select v-model="ruleForm.progress_status" placeholder="请选择合同状态">
              <el-option v-for="(val, key) in projectType" :key="key" :label="val.name" :value="val.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="完成日期" prop="complete_at">
            <el-date-picker
              v-model="ruleForm.complete_at"
              type="date"
              value-format="timestamp"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="visiable.DialogFinish = false">取 消</el-button>
            <el-button type="primary" @click="onSubmitComplete('ruleForm')">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_contract   beforeMount()
    修改签订状态: update_signStatus onDialogSign()
    修改合同状态: update_contractStatus onDialogSignFinish()
-->

<script>
  import { getProjects, updateProject, parseOriginType, getProject } from '../../api/project'
  import _ from 'lodash'
  import Store from '../../store'
  import { parseTime } from '../../utils'
  import { getCustomers } from '../../api/customer'
  import { getBranches } from '../../api/branch'
  import { replyRes } from '../../utils/res'

  const defaultValue = {
    id: 0,
    sign_status: 1,
    progress_status: null,
    sign_at: null,
    complete_at: null
  }

  export default {
    name: 'sign',
    data() {
      return {
        list: {},
        visiable: {
          dialogVisible: false,
          DialogFinish: false,
          DialogEdit: false
        },
        receive_status: [
          { id: null, name: '全部' },
          { id: 0, name: '未收款' },
          { id: 1, name: '可收款' },
          { id: 2, name: '收款中' },
          { id: 3, name: '部分收款' },
          { id: 4, name: '完成收款' }
        ],
        customers: {},
        loading: {
          customers: false,
          users: false
        },
        branch: [
          { id: null, name: '承建公司' }
        ], // 承建单位
        projectType: [
          { id: 0, name: '商务对接' },
          { id: 1, name: '生产中' },
          { id: 2, name: '完成生产' },
          { id: 3, name: '已完成' }
        ],
        contractStatus: [
          { id: null, name: '合同状态' },
          { id: 0, name: '商务对接' },
          { id: 1, name: '生产中' },
          { id: 2, name: '完成生产' },
          { id: 3, name: '已完成' }
        ],
        SignStatus: [
          { id: 0, name: '未签订' },
          { id: 1, name: '已签订' }
        ],
        contractSign: [
          { id: null, name: '签订状态' },
          { id: 0, name: '未签订' },
          { id: 1, name: '已签订' }
        ],
        ruleForm: Object.assign({}, defaultValue),
        ruleFormSign: Object.assign({}, defaultValue),
        rules: {
          sign_at: [
            { required: true, message: '日期不能为空', trigger: 'blur' }
          ],
          complete_at: [
            { required: true, message: '日期不能为空', trigger: 'blur' }
          ]
        },
        projectTypeId: [
          { id: null, name: '项目类型' },
          { id: 1, name: '配电' },
          { id: 2, name: '迁改' },
          { id: 3, name: '配网' },
          { id: 4, name: '用电安全' },
          { id: 5, name: '电力施工' },
          { id: 6, name: '电力物探' },
          { id: 7, name: '电力物联' },
          { id: 8, name: '排查' },
          { id: 9, name: '检测' }
        ],
        searchForm: {
          name: null,
          start_at: null,
          project_type_id: null,
          end_at: null,
          sign_status: null, // 合同签订
          progress_status: null, // 合同进度
          customer_id: null,
          branch_id: null,
          page: 1,
          pageSize: 10,
          totalCount: 0
        }
      }
    },
    mounted() {
      this.fetchProjects()
      this.fetchBranches()
    },
    filters: {
      // 将id转换为合同编号
      padStr: function(value) {
        return 'hj-' + _.padStart(value, 8, '0')
      },
      parseBranch: function(value) {
        const list = Store.state.user.branches
        for (const index in list) {
          if (parseInt(list[index].id) === value) {
            return list[index].name
          }
        }
        return value
      },
      flowName: function(value) {
        if (value === 1 || value === '1') {
          return '项目建议书'
        }
        if (value === 2 || value === '2') {
          return '可研阶段'
        }
        if (value === 3 || value === '3') {
          return '初设阶段'
        }
        if (value === 4 || value === '4') {
          return '施工图阶段'
        }
        return value
      },
      productStatus: function(value) {
        if (value === 0) {
          return '未开始'
        }
        if (value === 1) {
          return '前期工作'
        }
        if (value === 2) {
          return '勘查设计'
        }
        if (value === 3) {
          return '内部校审'
        }
        if (value === 4) {
          return '概预算编制'
        }
        if (value === 5) {
          return '成果提交'
        }
        if (value === 6) {
          return '已完成'
        }
        return value
      },
      parseCheckStatus: function(value) {
        if (value === null) {
          return '未开始'
        }
        if (value === 0 || value === '0') {
          return '送校核'
        }
        if (value === 1 || value === '1') {
          return '返回设计'
        }
        if (value === 2 || value === '2') {
          return '送审核'
        }
        if (value === 3 || value === '3') {
          return '送批准'
        }
        if (value === 4 || value === '4') {
          return '返回审核'
        }
        if (value === 5 || value === '5') {
          return '已完成'
        }
        return value
      },
      parseTime: function(value) {
        if (value === null) {
          return '暂无数据'
        }
        return parseTime(value, '{y}-{m}-{d}')
      },
      parseOriginType,
      parseProjectType: function(value) {
        if (value === 0) {
          return '商务对接'
        }
        if (value === 1) {
          return '生产中'
        }
        if (value === 2) {
          return '完成生产'
        }
        if (value === 3) {
          return '已完成'
        }
        return value
      },
      receiveStatus: function(value) {
        if (value === 0) {
          return '未收款'
        }
        if (value === 1) {
          return '可收款'
        }
        if (value === 2) {
          return '收款中'
        }
        if (value === 3) {
          return '部分收款'
        }
        if (value === 4) {
          return '完成收款'
        }
        return value
      },
      parseProjectStatus: function(value) {
        if (value === 1) {
          return '配电'
        }
        if (value === 2) {
          return '迁改'
        }
        if (value === 3) {
          return '配网'
        }
        if (value === 4) {
          return '用电安全'
        }
        if (value === 5) {
          return '电力施工 '
        }
        if (value === 6) {
          return '电力物探'
        }
        if (value === 7) {
          return '电力物联'
        }
        if (value === 8) {
          return '排查'
        }
        if (value === 9) {
          return '检测'
        }
        return value
      },
      parseProjectFh: function(value) {
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
      parseProjectYt: function(value) {
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
      }
    },
    methods: {
      // 获取合同列表
      fetchProjects() {
        getProjects(this.searchForm).then(res => {
          this.list = res.data
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
      fetchProject(id) {
        getProject({ id: id }).then(res => {
          res.data.complete_at > 0 ? res.data.complete_at *= 1000 : null
          res.data.sign_at > 0 ? res.data.sign_at *= 1000 : null
          this.ruleFormSign = Object.assign({}, { id: res.data.id, sign_at: res.data.sign_at, sign_status: res.data.sign_status })
          this.ruleForm = Object.assign({}, { id: res.data.id, complete_at: res.data.complete_at, progress_status: res.data.progress_status })
        })
      },
      // 打开合同签订窗口
      onDialogSign(item) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_signStatus#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.fetchProject(item.id)
        this.visiable.dialogVisible = true
      },
      // 合同状态窗口
      onDialogSignFinish(item) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_contractStatus#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.fetchProject(item.id)
        this.visiable.DialogFinish = true
      },
      // 获取修改日期
      // 合同窗口确认修改
      onSubmitForm(forName) {
        this.$refs[forName].validate(valid => {
          if (valid) {
            console.log(this.ruleForm)
            this.ruleFormSign.sign_at /= 1000
            updateProject(this.ruleFormSign).then(res => {
              if (replyRes(res)) {
                this.fetchProjects()
                this.visiable.dialogVisible = false
                this.visiable.DialogFinish = false
              }
            })
          } else {
            return false
          }
        })
      },
      // 合同状态修改
      onSubmitComplete(forName) {
        this.$refs[forName].validate(valid => {
          if (valid) {
            console.log(this.ruleForm)
            this.ruleForm.complete_at /= 1000
            updateProject(this.ruleForm).then(res => {
              if (replyRes(res)) {
                this.fetchProjects()
                this.visiable.DialogFinish = false
              }
            })
          } else {
            return false
          }
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
        getCustomers(params).then(res => {
          this.customers = res.data._items
          this.loading.customers = false
        })
      },
      // 搜索
      onSubmitSearchForm() {
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
      if (this.actionCheck_.actionCheck('read_contract#') === false) {
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
