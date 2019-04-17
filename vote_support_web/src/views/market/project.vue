<template>
  <div class="app-container">
    <div id="app" class="apply_header" style="background: #dcdfe6;padding-top: 5px;border-radius: 10px">
      <el-form size="mini" label-width="100px">
        <el-form-item label="搜索栏">
          <el-form ref="searchForm" :model="searchForm" label-width="100px" size="mini" :inline="true" class="demo-form-inline">
              <el-form-item label-width="70px">
                <el-input v-model="searchForm.name" placeholder="项目名称"></el-input>
              </el-form-item>
              <el-form-item  prop="customer_id">
                <!--<el-input v-model="ruleForm.customer_id"></el-input>-->
                <el-select
                  v-model="searchForm.customer_id"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="关键词搜索，空格表示全部"
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
              <el-form-item  prop="origin_type" label-width="70px">
                <el-select v-model="searchForm.origin_type" placeholder="合同类型">
                  <el-option v-for="(val, key) in contract" :key="key" :label="val.origin_type" :value="val.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item  prop="branch_id" label-width="70px">
                <el-select v-model="searchForm.branch_id" placeholder="合同类型">
                  <el-option v-for="(val, key) in branch" :key="key" :label="val.name" :value="val.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item  prop="flow_status" label-width="70px">
                <el-select v-model="searchForm.flow_status" placeholder="合同状态">
                  <el-option v-for="(val, key) in status" :key="key" :label="val.name" :value="val.id"></el-option>
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
              <el-form-item  label-width="40px">
              <el-button @click="onSubmitSearchForm()" icon="el-icon-search" style="margin-left: 30px;" type="primary" size="mini">搜索</el-button>
              </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="操作栏">
          <el-button size="mini" type='primary' @click = "onClickCreateBtn"><i class="el-icon-circle-plus-outline"></i> 新建项目</el-button>
          <el-checkbox border size="mini" v-model="showDealUser">显示经营部负责人</el-checkbox>
          <el-checkbox border size="mini" v-model="showProjectNo">显示项目编号</el-checkbox>
          <el-checkbox border size="mini" v-model="showPayWay">显示付款方式</el-checkbox>
        </el-form-item>
      </el-form>
    </div>
    <!--编辑表单-->
    <el-dialog :title="this.activeId===0?'新增项目':'编辑项目'" :visible.sync="visible.ruleForm" @close="closeDialog()">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" size="mini">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目名称" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="项目来源" prop="origin_type">
              <el-select v-model="ruleForm.origin_type" placeholder="请选择">
                <el-option
                  v-for="item in origin_types"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="承建分公司" prop="branch_id">
              <el-select v-model="ruleForm.branch_id" placeholder="请选择">
                <el-option
                  v-for="item in branches"
                  :key="item.id"
                  :label="item.name"
                  :value="parseInt(item.id)">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产负责人" prop="leading_user_id">
              <!--<el-input v-model="ruleForm.leading_user_id"></el-input>-->
              <el-select
                v-model="ruleForm.leading_user_id"
                filterable
                remote
                reserve-keyword
                placeholder="关键词搜索，空格表示全部"
                :remote-method="remoteMethodOfUser"
                :loading="loading.users">
                <el-option
                  v-for="item in users"
                  :key="item.id"
                  :label="item.username"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="经营负责人1" prop="deal_user1_id">
              <el-select
                v-model="ruleForm.deal_user1_id"
                filterable
                remote
                reserve-keyword
                placeholder="选择经营部员工"
                :loading="loading.users">
                <el-option
                  v-for="item in dealUsers"
                  :key="item.id"
                  :label="item.username"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="经营负责人2" prop="deal_user2_id">
              <el-select
                v-model="ruleForm.deal_user2_id"
                filterable
                remote
                reserve-keyword
                placeholder="选择经营部员工"
                :loading="loading.users">
                <el-option
                  v-for="item in dealUsers"
                  :key="item.id"
                  :label="item.username"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button type="text" @click="cleanDealUser('2')">移除</el-button>
            </el-form-item>
            <el-form-item label="经营负责人3" prop="deal_user3_id">
              <el-select
                v-model="ruleForm.deal_user3_id"
                filterable
                remote
                reserve-keyword
                placeholder="选择经营部员工"
                :loading="loading.users">
                <el-option
                  v-for="item in dealUsers"
                  :key="item.id"
                  :label="item.username"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button type="text" @click="cleanDealUser('3')">移除</el-button>
            </el-form-item>
            <el-form-item label="项目内容" prop="content">
              <el-input v-model="ruleForm.content"></el-input>
            </el-form-item>
            <el-form-item label="客户" prop="customer_id">
              <!--<el-input v-model="ruleForm.customer_id"></el-input>-->
              <el-select
                v-model="ruleForm.customer_id"
                filterable
                remote
                reserve-keyword
                placeholder="关键词搜索，空格表示全部"
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
            <el-form-item label="项目编号" prop="project_no">
              <el-input v-model="ruleForm.project_no"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划开始时间" prop="plan_started_at">
              <el-date-picker
                v-model="ruleForm.plan_started_at"
                type="date"
                value-format = "timestamp"
                placeholder="选择日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="计划完成时间" prop="plan_completed_at">
              <el-date-picker
                v-model="ruleForm.plan_completed_at"
                type="date"
                value-format = "timestamp"
                placeholder="选择日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="合同类型" prop="contract_type">
              <el-select v-model="ruleForm.contract_type" placeholder="请选择">
                <el-option
                  v-for="item in contract_types"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <div v-if="orangeType">
              <el-form-item label="挂靠公司"  prop="team_worker">
                <el-input v-model="ruleForm.team_worker"></el-input>
              </el-form-item>
            </div>
            <el-form-item label="合同金额" prop="money_total">
              <el-input v-model="ruleForm.money_total"></el-input>
            </el-form-item>
            <!--<el-form-item label="付款方式" prop="money_pay_way">-->
              <!--<el-input v-model="ruleForm.money_pay_way"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="付款方式" prop="pay_way">
              <el-input v-model="ruleForm.pay_way" placeholder="请输入付款方式"></el-input>
            </el-form-item>
            <el-form-item label="备注/公益性" prop="free">
              <el-input v-model="ruleForm.free" placeholder="此处填写项目备注,如公益免费项目等!!"></el-input>
            </el-form-item>
            <el-form-item label="操作栏">
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              <el-button @click="visible.ruleForm = false">关闭</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
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
    <!--列表-->
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
        <el-table-column prop="name" label="项目名称" align="center"></el-table-column>
        <el-table-column prop="project_no" label="项目编号" align="center" width="100" v-if="showProjectNo"></el-table-column>
        <el-table-column  label="项目来源" align="center" width="100">
          <template slot-scope="scope">{{scope.row.origin_type | parseOriginType}}</template>
        </el-table-column>
        <el-table-column  label="承建公司" align="center" width="100">
          <template slot-scope="scope">{{scope.row.branch_id | parseBranch}}</template>
        </el-table-column>
        <el-table-column prop="leading_user_name" label="生产负责人" align="center" width="100"></el-table-column>
        <el-table-column label="经营负责人" align="center" width="100" v-if="showDealUser">
          <template slot-scope="scope">
            {{scope.row.dealUser1 === null ? '__' : scope.row.dealUser1.name}}
            <br>
            {{scope.row.dealUser2 === null ? '__' : scope.row.dealUser2.name}}
            <br>
            {{scope.row.dealUser3 === null ? '__' : scope.row.dealUser3.name}}
          </template>
        </el-table-column>
        <el-table-column  label="项目类型" align="center" width="100">
          <template slot-scope="scope">{{scope.row.project_type_id | parseProjectType}}</template>
        </el-table-column>
        <el-table-column prop="customer_name" label="客户名称" align="center" width="100"></el-table-column>
        <el-table-column  label="计划开始时间" align="center" width="100">
          <template slot-scope="scope">{{scope.row.plan_started_at | parseTime}}</template>
        </el-table-column>
        <el-table-column  label="计划完成时间" align="center" width="100">
          <template slot-scope="scope">{{scope.row.plan_completed_at | parseTime}}</template>
        </el-table-column>
        <el-table-column  label="合同类型" align="center" width="100">
          <template slot-scope="scope">{{scope.row.parseContractType | parseContractType}}</template>
        </el-table-column>
        <el-table-column prop="money_total" label="合同金额" align="center" width="100"></el-table-column>
        <el-table-column prop="pay_way" label="付款方式" align="center" width="100" v-if="showPayWay"></el-table-column>
        <el-table-column prop="free" label="备注" align="center" width="100"></el-table-column>
        <el-table-column  label="操作" align="center" width="190" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="onClickEditBtn(scope.row.id)"><i class="el-icon-edit"></i> 修改</el-button>
            <el-button size="mini" type="info" @click="onClickDeleteBtn(scope.row.id)"><i class="el-icon-delete"></i> 禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_project   beforeMount()
    新增按钮: create_project onClickCreateBtn()
    修改按钮: update_project onClickEditBtn()
    禁用按钮: delete_project onClickDeleteBtn()
-->
<script>
  import { createProject, getProjects, getProject, updateProject, getContractTypes, parseContractType, getOriginTypes, parseOriginType } from '../../api/project'
  import { replyRes } from '../../utils/res'
  import { parseTime } from '../../utils'
  import Store from '../../store'
  import { getCustomers } from '../../api/customer'
  import { getUsers } from '../../api/user'
  import { getBranches } from '../../api/branch'

  const defaultRuleForm = {
    name: '测试项目名称',
    origin_type: 1,
    branch_id: 2,
    leading_user_id: null,
    content: '测试内容',
    customer_id: null,
    plan_started_at: null,
    plan_completed_at: null,
    money_total: 500000,
    pay_way: '',
    // fee_percentage: 15,
    team_worker: '',
    contract_type: 1,
    project_no: '', // 项目标号
    free: '否', // 公益性项目特别备注
    deal_user1_id: null,
    deal_user2_id: null,
    deal_user3_id: null
  }
  export default {
    data() {
      return {
        /**
         * 创建表单相关变量
         */
        activeId: 0,
        visible: {
          ruleForm: false
        },
        loading: {
          customers: false,
          users: false
        },
        contract_types: getContractTypes(),
        origin_types: getOriginTypes(),
        customers: [],
        users: [],
        dealUsers: [],
        rules: {
          name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' }
          ],
          project_no: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          deal_user1_id: [
            { required: true, message: '请至少选择一个经营部负责人', trigger: 'blur' }
          ],
          customer_id: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          branch_id: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          origin_type: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          contract_type: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          leading_user_id: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          // plan_started_at: [
          //   { required: true, message: '请输入', trigger: 'blur' }
          // ],
          // plan_completed_at: [
          //   { required: true, message: '请输入', trigger: 'blur' }
          // ],
          money_total: [
            { required: true, message: '请输入', trigger: 'blur' }
          ]
          // money_pay_way: [
          //   { required: true, message: '请输入', trigger: 'blur' }
          // ],
        },
        ruleForm: Object.assign({}, defaultRuleForm),
        /**
         * 项目列表相关变量
         */
        searchForm: {
          name: null,
          start_at: null,
          end_at: null,
          origin_type: null, // 合同类型
          flow_status: null, // 分配状态
          branch_id: null,
          page: 1,
          pageSize: 10,
          totalCount: 0,
          time: []
        },
        branch: [
          { id: null, name: '分公司' }
        ], // 承建单位
        delForm: {
          id: null,
          valid: 0
        },
        contract: [
          { origin_type: '合同类型', id: null },
          { origin_type: '合同签订', id: 1 },
          { origin_type: '委托书', id: 2 },
          { origin_type: '中标通知书', id: 3 },
          { origin_type: '口头订单', id: 4 }
        ],
        status: [
          { id: null, name: '分配状态' },
          { id: 0, name: '未分配' },
          { id: 1, name: '已分配' }
        ],
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
        },
        showDealUser: false,
        showProjectNo: false,
        showPayWay: false
      }
    },
    computed: {
      branches() {
        return this.$store.state.user.branches
      },
      // 是否显示挂靠公司
      orangeType() {
        return this.ruleForm.contract_type === 2
      }
    },
    filters: {
      parseTime: function(value) {
        if (value === null) {
          return '暂无数据'
        }
        return parseTime(value, '{y}-{m}-{d}')
      },
      parseContractType,
      parseOriginType,
      parseBranch: function(value) {
        const list = Store.state.user.branches
        for (const index in list) {
          if (parseInt(list[index].id) === value) {
            return list[index].name
          }
        }
        return value
      },
      parseProjectType: function(value) {
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
      }
    },
    mounted() {
      this.fetchList()
      this.fetchBranches()
      this.fetchDealUsers()
    },
    methods: {
      /**
       * 项目列表相关命令
       */
      fetchList() {
        getProjects(this.searchForm).then(res => {
          this.list = res.data._items
          console.log(res.data._items)
          this.searchForm.totalCount = res.data._meta.totalCount
          // 利用拉取的项目列表，初始化customers列表，注意要去重复数据
          const tempCustomers = []
          const tempLeadingUsers = []
          const tempArr0 = []
          const tempArr1 = []
          for (const index in this.list) {
            // 去重
            if (tempArr0.indexOf(this.list[index].customer_id) < 0) {
              tempArr0.push(this.list[index].customer_id)
              const tempCustomer = {
                id: this.list[index].customer_id,
                name: this.list[index].customer_name
              }
              tempCustomers.push(tempCustomer)
            }
            if (tempArr1.indexOf(this.list[index].leading_user_id) < 0) {
              tempArr1.push(this.list[index].leading_user_id)
              const tempLeadingUser = {
                id: this.list[index].leading_user_id,
                username: this.list[index].leading_user_name
              }
              tempLeadingUsers.push(tempLeadingUser)
            }
          }
          this.customers = tempCustomers
          this.users = tempLeadingUsers
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
      fetchOne() {
        return getProject({ id: this.activeId }).then(res => {
          this.ruleForm = Object.assign({}, res.data)
          this.ruleForm.plan_started_at > 0 ? this.ruleForm.plan_started_at *= 1000 : null
          this.ruleForm.plan_completed_at > 0 ? this.ruleForm.plan_completed_at *= 1000 : null
        })
      },
      fetchDealUsers() {
        getUsers({ department_id: 53 }).then(res => {
          this.dealUsers = res.data._items
          this.loading.users = false
        })
      },
      // 一页多少行
      handleSizeChange(pageSize) {
        this.searchForm.pageSize = pageSize
        this.fetchList()
      },
      // 翻页
      handlePageChange(currentPage) {
        this.searchForm.page = currentPage
        this.fetchList()
      },
      /**
       * 创建编辑相关命令
       * */
      onClickCreateBtn() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('create_project#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.activeId = 0
        this.visible.ruleForm = true
      },
      onClickEditBtn(id) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_project#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.activeId = id
        this.fetchOne()
        this.visible.ruleForm = true
      },
      onClickDeleteBtn(id) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('delete_project#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.delForm.id = id
        // 调用更新接口并响应
        updateProject(this.delForm).then(res => {
          console.log(res)
          this.fetchList()
          if (res.data.bCode === 101) {
            this.$message({
              message: '恭喜你修改成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '很抱歉修改,修改失败',
              type: 'warning'
            })
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ruleForm.plan_started_at > 0 ? this.ruleForm.plan_started_at /= 1000 : null
            this.ruleForm.plan_completed_at > 0 ? this.ruleForm.plan_completed_at /= 1000 : null
            if (this.activeId === 0) {
              // 调用新增接口并响应
              createProject(this.ruleForm).then(res => {
                if (replyRes(res)) {
                  this.visible.ruleForm = false
                }
              })
            } else {
              // 调用更新接口并响应
              updateProject(this.ruleForm).then(res => {
                if (replyRes(res)) {
                  this.visible.ruleForm = false
                }
              })
            }
          } else {
            return false
          }
        })
      },
      closeDialog() {
        this.ruleForm = Object.assign({}, defaultRuleForm)
        this.fetchList()
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
      /** 远程搜索客户列表方法 */
      remoteMethodOfUser(query) {
        this.loading.users = true
        let params = {}
        if (query.trim() !== null) {
          params = { username: query.trim() }
        }
        getUsers(params).then(res => {
          this.users = res.data._items
          this.loading.users = false
        })
      },
      onSubmitSearchForm() {
        if (this.searchForm.time !== null && this.searchForm.time.length > 0) {
          this.searchForm.start_at = this.searchForm.time[0]
          this.searchForm.end_at = this.searchForm.time[1]
        } else {
          this.searchForm.start_at = null
          this.searchForm.end_at = null
        }
        this.fetchList()
      },
      // 清空经营负责人2和3
      cleanDealUser(value) {
        if (value === '2') {
          this.ruleForm.deal_user2_id = null
        }
        if (value === '3') {
          this.ruleForm.deal_user3_id = null
        }
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
      if (this.actionCheck_.actionCheck('read_project#') === false) {
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
