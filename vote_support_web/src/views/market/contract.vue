<template>
  <div class="app-container">
    <div class="apply_header" style="background: #d3e8f1;padding-top: 5px;border-radius: 10px">
      <el-form size="mini" label-width="100px">
        <el-form-item label="搜索栏">
          <el-form ref="searchForm" :model="searchForm" label-width="100px" :inline="true" class="demo-form-inline" size="mini">
              <el-form-item l>
                <el-input v-model="searchForm.name" placeholder="项目名称"></el-input>
              </el-form-item>
              <el-form-item prop="progress_status" >
                <el-select v-model="searchForm.progress_status" placeholder="合同状态">
                  <el-option v-for="(val, key) in contractStatus" :key="key" :label="val.name" :value="val.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="progress_status"  placeholder="选择收款状态">
                <el-select v-model="searchForm.receive_status">
                  <el-option v-for="(val, key) in receive_status" :key="key" :label="val.name" :value="val.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="branch_id" >
                <el-select v-model="searchForm.branch_id" placeholder="选择分公司">
                  <el-option v-for="(val, key) in branch" :key="key" :label="val.name" :value="val.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="customer_id" >
                <!--<el-input v-model="ruleForm.customer_id"></el-input>-->
                <el-select
                  v-model="searchForm.customer_id"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="客户名称搜索，空格表示全部"
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
              <el-form-item prop="flow_status" >
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
              <el-form-item >
              <el-button @click="onSubmitSearchForm()" icon="el-icon-search" type="primary" style="float: right;margin-right: 50%">查询</el-button>
              </el-form-item>
          </el-form>
        </el-form-item>
      </el-form>
    </div>
    <el-row>
      <el-col :span="10">
        <!--分页器-->
        <div style="padding:0 10px">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
            :current-page="searchForm.page"
            :page-sizes="[10,30,50,100]"
            :page-size="searchForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="searchForm.totalCount">
          </el-pagination>
        </div>
      </el-col>
      <el-col :span="3">
        <el-button size="mini" @click="onClickCleanReceival()" style="float: right;margin-right: 50%">clean-invoice</el-button>
      </el-col>
    </el-row>
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
        <el-table-column label="收款记录" type="expand" width="70">
          <template slot-scope="scope">
            <el-form size="mini" label-width="100px">
              <el-form-item label="收款记录">
                  <el-table
                    border
                    fit
                    :data="scope.row.receival">
                    <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
                    <el-table-column prop="invoice_id" label="发票ID" width="100" align="center"></el-table-column>
                    <el-table-column prop="invoice_no" label="发票号" width="100" align="center"></el-table-column>
                    <el-table-column prop="invoice_id" label="发票ID" width="100" align="center"></el-table-column>
                    <el-table-column  label="收款日期" align="center" width="100">
                      <template slot-scope="scope">{{scope.row.invoice_company | parseTime}}</template>
                    </el-table-column>
                    <el-table-column  label="收款状态" align="center" width="100">
                      <template slot-scope="scope">{{scope.row.status === 0 ? '未到账' : '已到账'}}</template>
                    </el-table-column>
                    <el-table-column prop="money" label="收款金额" width="100" align="center"></el-table-column>
                    <el-table-column  label="发票代收金额" align="center" width="120">
                      <template slot-scope="scopes">
                        {{scope.row.invoice.invoice_no === null ? '无发票收款' : ((scope.row.invoice.invoice_money * 100) - (scope.row.invoice.received_money * 100)) / 100}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="invoice_id" label="审批备注"  align="center"></el-table-column>
                  </el-table>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="project_no" label="项目编号" width="110" align="center"></el-table-column>
        <el-table-column prop="name" label="项目名称" align="center"></el-table-column>
        <el-table-column  label="承建公司" align="center" width="100">
          <template slot-scope="scope">{{scope.row.branch_id | parseBranch}}</template>
        </el-table-column>
        <el-table-column prop="customer_name" width="100" label="委托单位" align="center"></el-table-column>
        <el-table-column  label="合同状态" align="center" width="100">
          <template slot-scope="scope">{{scope.row.progress_status | parseProjectType}}</template>
        </el-table-column>
        <el-table-column  label="收款状态" align="center" width="100">
          <template slot-scope="scope">{{scope.row.receive_status | receiveStatus}}</template>
        </el-table-column>
        <el-table-column prop="money_total" label="合同金额" width="100" align="center"></el-table-column>
        <el-table-column prop="open_ticket" label="开票金额" width="100" align="center"></el-table-column>
        <el-table-column prop="money_received" label="已收金额" width="100" align="center"></el-table-column>
        <el-table-column  label="未收金额" align="center" width="100">
          <template slot-scope="scope">{{scope.row.open_ticket-scope.row.money_received}}</template>
        </el-table-column>
        <el-table-column  label="备注" align="center" width="100">
          <template slot-scope="scope">{{scope.row.comment === null?'无':scope.row.comment}}</template>
        </el-table-column>
        <el-table-column  label="操作" align="center" width="90">
          <template slot-scope="scope">
            <el-button @click="onClickCreateBtn(scope.row)" type="primary" size="mini">增加收款</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--收款表单-->
    <el-dialog  :title="this.isAdd === true ? '新增收款' : '录入已收金额'" :visible.sync="visible.ruleForm" @close="closeDialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" size="mini">
        <el-form-item label="收款日期" prop="receive_date" v-if="this.isAdd">
          <el-date-picker
            v-model="ruleForm.receive_date"
            type="date"
            value-format = "timestamp"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收款状态" v-if="this.isAdd">
          <el-select v-model="ruleForm.receive_status" placeholder="选择收款状态" style="width: 100%;">
            <el-option :label="val.name" :value="val.id" v-for="(val, key) in receiveStatus" :key="key" @change="statusChange(val.id)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开票金额" prop="open_ticket" v-if="ruleForm_receive_status">
          <el-input v-model.number="ruleForm.open_ticket"></el-input>
        </el-form-item>
        <el-form-item label="收款金额" prop="money" v-if="ruleForm_receive_status">
          <el-input v-model.number="ruleForm.money"></el-input>
        </el-form-item>
        <el-form-item label="发票号" prop="invoice_no" v-if="ruleForm_receive_status">
          <el-input v-model="ruleForm.invoice_no"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="comment" v-if="this.isAdd">
          <el-input v-model="ruleForm.comment"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="visible.ruleForm = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_receipt   beforeMount()
    收款管理-增加收款: create_receipt onClickCreateBtn()
    收款管理-录入已收款金额: create_receipted onClickDialog()
    收款记录-修改记录: update_receipted onDialogSignFinish()
    查看收款记录: 待添加 onClickShowBtn()
-->
<script>
  import { getProjects, parseContractType, parseOriginType, updateProject, getProject } from '../../api/project'
  import { createReceival, updateReceival, getReceival } from '../../api/receival'
  import { cleanInvoice } from '../../api/invoice'
  import { replyRes } from '../../utils/res'
  import { parseTime } from '../../utils'
  import Store from '../../store'
  import _ from 'lodash'
  import { getCustomers } from '../../api/customer'
  import { getBranches } from '../../api/branch'

  /* -----------创建收款相关变量----------- */
  const defaultRuleForm = {
    project_id: null,
    money: 0,
    invoice_no: '',
    comment: '',
    receive_date: null,
    receive_status: 0, // 收款状态
    open_ticket: 0, // 开票金额
    status: 1
  }
  export default {
    data() {
      return {
        /* -----------列表相关状态--------------- */
        list: [],
        pageInfo: {
          page: 1,
          pageSize: 10,
          totalCount: 0
        },
        isAdd: false, // p判断增加还是修改
        isOpenTicket: false, // 判断开票中
        loading: {
          customers: false,
          users: false
        },
        branch: [
          { id: null, name: '全部' }
        ], // 承建单位
        customers: [],
        searchForm: {
          sign_status: null, // 合同签订
          progress_status: null, // 合同进度
          name: null,
          start_at: null,
          end_at: null,
          page: 1,
          pageSize: 10,
          totalCount: 0,
          time: []
        },
        /* -----------新增收款相关状态----------- */
        activeItem: {},
        activeReceivalId: 0,
        visible: {
          ruleForm: false
        },
        contractStatus: [
          { id: null, name: '合同状态' },
          { id: 0, name: '商务对接' },
          { id: 1, name: '生产中' },
          { id: 2, name: '完成生产' },
          { id: 3, name: '已完成' }
        ],
        receive_status: [
          { id: null, name: '收款状态' },
          { id: 0, name: '未收款' },
          { id: 1, name: '可收款' },
          { id: 2, name: '开票中' },
          { id: 3, name: '部分收款' },
          { id: 4, name: '完成收款' }
        ],
        receiveStatus: [
          { id: 0, name: '未收款' },
          { id: 1, name: '可收款' },
          { id: 2, name: '开票中' },
          { id: 3, name: '部分收款' },
          { id: 4, name: '完成收款' }
        ],
        rules: {
          receive_date: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          money: [
            { required: true, type: 'number', message: '请输入正确的金额', trigger: 'blur' }
          ],
          open_ticket: [
            { required: true, type: 'number', message: '请输入正确的金额', trigger: 'blur' }
          ],
          project_id: [
            { required: true, message: '请输入', trigger: 'blur' }
          ]
        },
        ruleForm: Object.assign({}, defaultRuleForm),
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
      // 将id转换为合同编号
      padStr: function(value) {
        return 'hj-' + _.padStart(value, 8, '0')
      },
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
          return '开票中'
        }
        if (value === 3) {
          return '部分收款'
        }
        if (value === 4) {
          return '完成收款'
        }
        return value
      }
    },
    mounted() {
      this.fetchBranches()
      this.fetchList()
    },
    computed: {
      ruleForm_receive_status() {
        return this.ruleForm.receive_status !== 2
      }
    },
    methods: {
      /** 开票状态选择框 选项被修改事件*/
      statusChange(valId) {
        console.log('事件触发')
        if (valId === 3) {
          this.ruleForm.open_ticket = 0
          this.ruleForm.money = 0
          this.isOpenTicket = true
        }
        this.isOpenTicket = false
      },
      /* -----------列表相关方法--------------- */
      fetchList() {
        if (this.$route.params.id !== null) {
          this.searchForm.id = this.$route.params.id
        } else this.searchForm.id = null
        getProjects(this.searchForm).then(res => {
          console.log(res)
          this.list = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      // 获取单条信息
      fetchReceival(id) {
        getReceival(id).then(res => {
          this.ruleForm = res.data
        })
      },
      // 获取收款状态的信息
      fetchProject(id) {
        getProject({ id: id }).then(res => {
          this.ruleForm.receive_status = res.data.receive_status
          console.log(this.ruleForm.receive_status)
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
        this.fetchList()
      },
      // 翻页
      handlePageChange(currentPage) {
        this.searchForm.page = currentPage
        this.fetchList()
      },
      /* -----------创建收款相关方法----------- */
      onClickCreateBtn(item) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('create_receipt#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.isAdd = true // 添加
        this.activeItem = item
        this.ruleForm.project_id = item.id
        this.fetchProject(item.id)
        this.visible.ruleForm = true
      },
      // 修改项目收款记录被点击事件
      onClickUpdate(id) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_receipted#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.$router.push({ name: 'marketReceival', params: { id }})
      },
      // 临时用,清理历史收款记录,生成历史开票申请
      onClickCleanReceival() {
        // 仅管理员可进行本操作
        if (this.$store.getters.userId === 33) {
          cleanInvoice().then(res => {
            console.log(res)
          })
        } else {
          this.$message.error('错误提示,您没有该操作的权限!')
        }
      },
      submitForm(formName) {
        const id = this.ruleForm.project_id
        const status = this.ruleForm.receive_status
        this.visible.ruleForm = false
        if (this.isAdd === true) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              // 字段符合规则，创建收款记录
              if (this.activeReceivalId === 0) {
                // 调用新增接口并响应
                return createReceival(this.ruleForm).then(res => {
                  if (replyRes(res)) {
                    this.fetchReceivalList(this.activeItem)
                    this.activeItem.money_received = this.activeItem.money_received * 1 + this.ruleForm.money * 1
                  }
                }).then(res => {
                  updateProject({ receive_status: status, id: id }).then(res => {
                    this.fetchList()
                  })
                })
              }
            } else {
              return false
            }
          })
        } else {
          updateReceival(this.ruleForm).then(res => {
            if (replyRes(res)) {
              this.fetchList()
            }
          })
        }
      },
      closeDialog() {
        this.ruleForm = Object.assign({}, defaultRuleForm)
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
      onSubmitSearchForm() {
        this.$route.params.id = null
        if (this.searchForm.time !== null && this.searchForm.time.length > 0) {
          this.searchForm.start_at = this.searchForm.time[0]
          this.searchForm.end_at = this.searchForm.time[1]
        } else {
          this.searchForm.start_at = null
          this.searchForm.end_at = null
        }
        this.fetchList()
      },
      // 修改收款状态
      onReceiveStatus(item) {
        if (item.receive_status === 1) {
          return updateProject({ id: item.id, receive_status: 2 }).then(res => {
            this.fetchList()
          })
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
      if (this.actionCheck_.actionCheck('read_receipt#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>
<style>
  .element_table .el-table__expand-icon{
    background: #dee2f9;
  }
</style>
