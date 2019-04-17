<template>
  <div class="app-container">
    <div id="search" style="width: 100%; display:inline-block">
      <el-form :inline="true" ref="searchForm" :model="searchForm" label-width="100px" style="width: 100%">
          <el-form-item label="项目名称">
            <el-input v-model="searchForm.name"></el-input>
          </el-form-item>
          <el-form-item label="项目编号">
            <el-input v-model="searchForm.project_no"></el-input>
          </el-form-item>
          <el-form-item label="项目类型" prop="origin_type" label-width="70px">
            <el-select v-model="searchForm.project_type_id" placeholder="合同类型">
              <el-option v-for="(val, key) in projectType" :key="key" :label="val.name" :value="val.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择时间" prop="flow_status" label-width="70px">
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
            <el-button type="primary" @click="onSubmitSearchForm()" icon="el-icon-search">搜索</el-button>
            <el-button type="primary" @click="onSearchNullForm()" icon="el-icon-search">查看工程总造价为空的项目</el-button>
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
    <table class="_table" border="0" cellpadding="0" cellspacing="0">
      <thead>
      <tr>
        <th>序号</th>
        <th width="100px">项目编号</th>
        <th width="250px">项目名称</th>
        <!--<th width="150">项目阶段</th>-->
        <th width="130px">计划完成时间</th>
        <!--<th>项目完成时间</th>-->
        <th>预算员</th>
        <th>工程总造价</th>
        <th>工程本体造价</th>
        <th>前期费</th>
        <th>可研费</th>
        <th>设计费</th>
        <th>勘察费</th>
        <th>造价编制费</th>
        <th>竣工图编制费</th>
        <!--<th>审核</th>-->
        <!--<th>校核</th>-->
        <!--<th>预算</th>-->
        <th width="120px">操作</th>
      </tr>
      </thead>
      <tbody  v-for="(item, key) in list" :key="key">
      <tr>
        <td>{{item.id}}</td>
        <td>{{item.project_no}}</td>
        <td>{{item.name}}</td>
        <!--<td v-if="item.flowType" width="130px"><div v-for="val in item.flowType" style="color: firebrick">{{val.flow_id !== null ? val.flow_id : '' | parseDesign}}:{{val.status !== null ? val.status : '' | parseStatus}}</div></td>-->
        <!--<td v-else style="color: #006400">还没有进行分配</td>-->
        <!--<td>{{item.origin_type | parseOriginType}}</td>-->
        <!--<td>{{item.design_stage | parseDesign}}</td>-->
        <td width="100px">{{item.plan_completed_at | parseTime}}</td>
        <!--<td>{{item.complete_at | parseTime}}</td>-->
        <td>{{item.budgeter}}</td>
        <td>{{item.project_total}}</td>
        <td>{{item.project_cost}}</td>
        <td>{{item.early_cost}}</td>
        <td>{{item.research_cost}}</td>
        <td>{{item.design_cost}}</td>
        <td>{{item.prospect_cost}}</td>
        <td>{{item.make_cost}}</td>
        <td>{{item.project_complete}}</td>
        <!--<td>{{item.checker}}</td>-->
        <!--<td>{{item.proofreader}}</td>-->
        <!--<td>{{item.figure}}</td>-->
        <td><el-button @click="onDialogUpdate(item)" icon="el-icon-edit" size="mini" style="margin-left: 10px">修&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;改</el-button><el-button icon="el-icon-edit" @click="onClickShowBtn(item)" size="mini" >显示子项目</el-button><el-button icon="el-icon-edit" @click="onChildDialogCreate(item)" size="mini">添加子项目</el-button></td>
      </tr>
      <tr v-for="_item in item.children" v-if="item.showReceival" style="width: 100%;background: #f0f0f0;">
        <td>{{_item.id}}</td>
        <td width="100px">{{_item.project_no}}</td>
        <td>{{_item.name}}</td>
        <!--<td v-if="_item.flowType" width="130px"><div v-for="val in item.flowType" style="color: firebrick">{{val.flow_id !== null ? val.flow_id : '' | parseDesign}}:{{val.status !== null ? val.status : '' | parseStatus}}</div></td>-->
        <!--<td v-else style="color: #006400">还没有进行分配</td>-->
        <!--<td>{{_item.origin_type | parseOriginType}}</td>-->
        <!--<td>{{_item.design_stage | parseDesign}}</td>-->
        <td>{{_item.plan_completed_at | parseTime}}</td>
        <!--<td>{{_item.complete_at | parseTime}}</td>-->
        <td>{{_item.budgeter}}</td>
        <td>{{_item.project_total}}</td>
        <td>{{_item.project_cost}}</td>
        <td>{{_item.early_cost}}</td>
        <td>{{_item.research_cost}}</td>
        <td>{{_item.design_cost}}</td>
        <td>{{_item.prospect_cost}}</td>
        <td>{{_item.make_cost}}</td>
        <td>{{_item.project_complete}}</td>
        <!--<td>{{_item.checker}}</td>-->
        <!--<td>{{_item.proofreader}}</td>-->
        <!--<td>{{_item.figure}}</td>-->
        <td v-if="_item.flow_status === 0"><el-button icon="el-icon-edit" @click="onChildDialogUpdate(_item)" size="mini" style="margin-left: 10px">修&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;改</el-button></td>
        <td v-if="_item.flow_status === 1"><el-button icon="el-icon-edit" @click="onChildDialogUpdate(_item)" size="mini" style="margin-left: 10px">修&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;改</el-button></td>
      </tr>
      <tr v-show="item.children!==undefined && item.children.length<=0 && item.showReceival" >
        <td style="color:green">没有子项目</td>
      </tr>
      </tbody>
    </table>
    <div id="add">
      <el-dialog
        title="修改"
        :visible.sync="visiable.dialogVisible"
        width="40%">
        <el-form ref="ruleForm" :model="ruleForm"  label-width="100px">
          <el-form-item label="项目名称" prop="early_cost">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="项目编号" prop="early_cost">
            <el-input v-model="ruleForm.project_no"></el-input>
          </el-form-item>
          <el-form-item label="工程总造价" prop="early_cost">
            <el-input v-model="ruleForm.project_total"></el-input>
          </el-form-item>
          <el-form-item label="工程本体造价" prop="early_cost">
            <el-input v-model="ruleForm.project_cost"></el-input>
          </el-form-item>
          <el-form-item label="竣工图编制费" prop="early_cost">
            <el-input v-model="ruleForm.project_complete"></el-input>
          </el-form-item>
          <el-form-item label="勘察费" prop="early_cost">
            <el-input v-model="ruleForm.prospect_cost"></el-input>
          </el-form-item>
          <el-form-item label="前期费" prop="early_cost">
            <el-input v-model.number="ruleForm.early_cost"></el-input>
          </el-form-item>
          <el-form-item label="可研费" prop="research_cost">
            <el-input v-model.number="ruleForm.research_cost"></el-input>
          </el-form-item>
          <el-form-item label="设计费" prop="design_cost">
            <el-input v-model.number="ruleForm.design_cost"></el-input>
          </el-form-item>
          <el-form-item label="造价编制" prop="make_cost">
            <el-input v-model.number="ruleForm.make_cost"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="visiable.dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="onSubmitForm('ruleForm')">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div id="child-update">
      <el-dialog
        title="修改项目进度"
        :visible.sync="visiable.dialogForm"
        width="40%">
        <el-form ref="ruleChildForm" :model="ruleChildForm" label-width="100px">
              <el-form-item label="项目名称" prop="early_cost">
                <el-input v-model="ruleChildForm.name"></el-input>
              </el-form-item>
              <el-form-item label="项目编号" prop="early_cost">
                <el-input v-model="ruleChildForm.project_no"></el-input>
              </el-form-item>
              <el-form-item label="工程总造价" prop="early_cost">
                 <el-input v-model="ruleChildForm.project_total"></el-input>
              </el-form-item>
              <el-form-item label="工程本体造价" prop="early_cost">
                <el-input v-model="ruleChildForm.project_cost"></el-input>
              </el-form-item>
              <el-form-item label="竣工图编制费" prop="early_cost">
               <el-input v-model="ruleChildForm.project_complete"></el-input>
              </el-form-item>
              <el-form-item label="勘察费" prop="early_cost">
                <el-input v-model="ruleChildForm.prospect_cost"></el-input>
              </el-form-item>
              <el-form-item label="前期费" prop="early_cost">
                <el-input v-model="ruleChildForm.early_cost"></el-input>
              </el-form-item>
              <el-form-item label="可研费" prop="research_cost">
                <el-input v-model="ruleChildForm.research_cost"></el-input>
              </el-form-item>
              <el-form-item label="设计费" prop="design_cost">
                <el-input v-model="ruleChildForm.design_cost"></el-input>
              </el-form-item>
              <el-form-item label="预算编制费" prop="make_cost">
                <el-input v-model="ruleChildForm.make_cost"></el-input>
              </el-form-item>
          <el-form-item>
            <el-button @click="visiable.dialogForm = false">取 消</el-button>
            <el-button type="primary" @click="onSubmitChildForm('ruleForm')">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div id="addUser">
      <el-dialog title="新增子项目" :visible.sync="visiable.childVisible">
        <el-form :model="ruleChild" :rules="rules" ref="ruleChild" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="项目名称" prop="name">
                <el-input v-model="ruleChild.name"></el-input>
              </el-form-item>
              <el-form-item label="项目来源" prop="origin_type">
                <el-select v-model="ruleChild.origin_type" placeholder="请选择" >
                  <el-option
                    v-for="item in origin_types"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="承建分公司" prop="branch_id">
                <el-select v-model="ruleChild.branch_id" placeholder="请选择">
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
                  v-model="ruleChild.leading_user_id"
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
              <el-form-item label="项目内容" prop="content">
                <el-input v-model="ruleChild.content"></el-input>
              </el-form-item>
              <el-form-item label="客户" prop="customer_id">
                <!--<el-input v-model="ruleForm.customer_id"></el-input>-->
                <el-select
                  v-model="ruleChild.customer_id"
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
              <el-form-item label="添加合同编号" prop="project_no">
                <el-input v-model="ruleChild.project_no"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划开始时间" prop="plan_started_at">
                <el-date-picker
                  v-model="ruleChild.plan_started_at"
                  type="date"
                  value-format = "timestamp"
                  placeholder="选择日期"
                  style="width: 100%;">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="计划完成时间" prop="plan_completed_at">
                <el-date-picker
                  v-model="ruleChild.plan_completed_at"
                  type="date"
                  value-format = "timestamp"
                  placeholder="选择日期"
                  style="width: 100%;">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="合同类型" prop="contract_type">
                <el-select v-model="ruleChild.contract_type" placeholder="请选择">
                  <el-option
                    v-for="item in contract_types"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    style="width: 100%;">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="合同金额" prop="money_total">
                <el-input v-model="ruleChild.money_total"></el-input>
              </el-form-item>
              <el-form-item label="付款方式" prop="money_pay_way">
                <el-input v-model="ruleChild.money_pay_way"></el-input>
              </el-form-item>
              <el-form-item label="管理费(%)" prop="fee_percentage">
                <el-input v-model="ruleChild.fee_percentage"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="submitChildForm()">提交</el-button>
            <el-button @click="visiable.childVisible = false">关闭</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问:         read_evolve_HJ            beforeMount()
    修改主项目及子项目: update_evolve_HJ          onDialogUpdate() onChildDialogUpdate()
    显示子项目:        read_evolveSon_HJ         onClickShowBtn()
    添加子项目:        create_evolveSon_HJ       onChildDialogCreate()
-->
<script>
  import { getProjects, parseOriginType, getProject, updateProject, getOriginTypes, getContractTypes } from '../../../api/project'
  import { getProjectChild, getProjectChildId, updateProjectChild, createProjectChild } from '../../../api/projectChild'
  import _ from 'lodash'
  import { parseTime } from '../../../utils/index'
  import { getUsers } from '../../../api/user'
  import { getCustomers } from '../../../api/customer'
  import { replyRes } from '../../../utils/res'

  const defaultRuleForm = {
    id: null,
    name: '',
    project_no: '',
    design_stage: null,
    plan_completed_at: null,
    complete_at: null,
    early_cost: null,
    design_cost: null,
    make_cost: null,
    project_total: null,
    project_cost: null,
    project_complete: null,
    prospect_cost: null,
    research_cost: null,
    figure: null
  }

  const defaultRuleChildForm = {
    name: '测试项目名称',
    origin_type: 1,
    branch_id: 2,
    leading_user_id: null,
    content: '测试内容',
    customer_id: null,
    plan_started_at: null,
    plan_completed_at: null,
    money_total: 500000,
    money_pay_way: '预付20%',
    fee_percentage: 15,
    contract_type: 1,
    project_id: null,
    project_no: ''
  }
  export default {
    name: 'evolve',
    data() {
      return {
        list: {},
        child: {},
        loading: {
          customers: false,
          users: false
        },
        customers: [],
        users: [],
        activeItem: null,
        contract_types: getContractTypes(),
        ruleForm: Object.assign({}, defaultRuleForm),
        ruleChildForm: Object.assign({}, defaultRuleForm),
        ruleChild: Object.assign({}, defaultRuleChildForm),
        searchForm: {
          project_type_id: null, // 项目类型
          name: null,
          start_at: null,
          end_at: null,
          project_no: '',
          branch_id: 2,
          page: 1,
          pageSize: 10,
          totalCount: 0,
          time: [],
          project_total: null
        },
        projectType: [
          { name: '全部', id: null },
          { name: '配电', id: 1 },
          { name: '迁改', id: 2 },
          { name: '配网', id: 3 },
          { name: '用电安全', id: 4 }
        ],
        rules: {},
        origin_types: getOriginTypes(),
        visiable: {
          dialogVisible: false,
          dialogForm: false,
          childVisible: false,
          dialogSign: false
        },
        value: null,
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
      // 将id转换为合同编号
      padStr: function(value) {
        return 'hj-' + _.padStart(value, 8, '0')
      },
      parseTime: function(value) {
        if (!value) return ''
        value = value.toString()
        return parseTime(value, '{y}年{m}月{d}日')
      },
      parseDesign: function(value) {
        if (value === 1) {
          return '项目建议书'
        }
        if (value === 2) {
          return '初设阶段'
        }
        if (value === 3) {
          return '施工图阶段'
        }
        if (value === 4) {
          return '可研阶段'
        }
        return value
      },
      parseStatus: function(value) {
        if (value === null) {
          return '未开始'
        }
        if (value === 0) {
          return '前期工作'
        }
        if (value === 1) {
          return '勘查设计'
        }
        if (value === 2) {
          return '内部校审'
        }
        if (value === 3) {
          return '概预算编制'
        }
        if (value === 4) {
          return '成果提交'
        }
        if (value === 5) {
          return '已完成'
        }
        return value
      },
      parseOriginType
    },
    mounted() {
      this.fetchProjects()
    },
    computed: {
      branches() {
        return this.$store.state.user.branches
      }
    },
    methods: {
      // 获取主项目
      fetchProjects() {
        getProjects(this.searchForm).then(res => {
          console.log(res)
          this.list = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      // 获取子项目信息
      fetchProjectChild(item) {
        getProjectChild({ project_id: item.id }).then(res => {
          this.$set(item, 'children', res.data._items)
          this.$set(item, 'showReceival', true)
        })
      },
      // 获取子项目修改界面信息
      fetchProjectChildId(id) {
        getProjectChildId({ id: id }).then(res => {
          this.ruleChildForm = Object.assign({}, res.data)
          this.ruleChildForm.figure = this.ruleChildForm.early_cost + this.ruleChildForm.design_cost + this.ruleChildForm.make_cost + this.ruleChildForm.research_cost
        })
      },
      // 获取弹窗页面进度信息
      fetchOne(id) {
        getProject({ id: id }).then(res => {
          this.ruleForm = Object.assign({}, res.data)
          this.ruleForm.figure = this.ruleForm.early_cost + this.ruleForm.design_cost + this.ruleForm.make_cost + this.ruleForm.research_cost
        })
      },
      // 显示当前项目的收款记录
      onClickShowBtn(item) {
        this.activeItem = item
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('read_evolveSon_HJ#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        if (item.children === undefined) {
          this.fetchProjectChild(item)
        } else {
          item.showReceival = !item.showReceival
        }
      },
      // 修改主项目
      onSubmitForm(formName) {
        this.visiable.dialogVisible = false
        this.$refs[formName].validate((valid) => {
          if (valid) {
            updateProject(this.ruleForm).then(res => {
              if (replyRes(res)) {
                this.fetchProjects()
              }
            })
          } else {
            return false
          }
        })
      },
      // 修改子项目
      onSubmitChildForm() {
        this.visiable.dialogForm = false
        updateProjectChild(this.ruleChildForm).then(res => {
          if (replyRes(res)) {
            this.fetchProjects()
            // this.onClickShowBtn(this.activeItem)
          }
        })
      },
      // 修改主项目信息
      onDialogUpdate(item) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_evolve_HJ#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.visiable.dialogVisible = true
        this.ruleForm.id = item.id
        this.fetchOne(item.id)
      },
      // 修改子项目信息
      onChildDialogUpdate(item) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_evolve_HJ#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.visiable.dialogForm = true
        this.ruleChildForm.id = item.id
        this.fetchProjectChildId(item.id)
      },
      // 添加子项目
      onChildDialogCreate(item) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('create_evolveSon_HJ#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.activeItem = item
        this.visiable.childVisible = true
        this.ruleChild.project_id = item.id
      },
      // 提交增加子项目
      submitChildForm() {
        createProjectChild(this.ruleChild).then(res => {
          this.visiable.childVisible = false
          if (replyRes(res)) {
            this.fetchProjects()
            this.onClickShowBtn(this.activeItem)
          }
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
        this.searchForm.project_total = null
        this.fetchProjects()
      },
      // 查询工程总造价为空的项目
      onSearchNullForm() {
        this.searchForm.project_total = 0
        this.fetchProjects()
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
      remoteMethodOfUser(query) {
        this.loading.users = true
        let params = {}
        if (query.trim() !== '') {
          params = { username: query.trim() }
        }
        getUsers(params).then(res => {
          this.users = res.data._items
          this.loading.users = false
        })
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
      }
    },
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_evolve_HJ#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style scoped>

</style>
