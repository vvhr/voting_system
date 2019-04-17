<template>
  <div class="app-container">
    <div class="header">
      <!--搜索组件-->
      <el-row>
        <el-form ref="searchForm" :model="searchForm" label-width="100px">
          <el-col :span="6">
            <el-form-item label="项目名称" label-width="70px">
              <el-input v-model="searchForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="项目ID" label-width="70px">
              <el-input v-model="searchForm.id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="收款状态" label-width="90px">
              <el-select v-model="searchForm.receive_status">
                <el-option v-for="(val, key) in receive_status" :key="key" :label="val.name" :value="val.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!--<el-form-item label="搜索" label-width="40px">-->
            <el-button @click="onSubmitSearchForm()" icon="el-icon-search" style="margin-left: 30px;" type="primary">点击搜索</el-button>
            <el-button @click="resetSearchForm" icon="el-icon-close" style="margin-left: 0;" type="primary">清空</el-button>
            <!--</el-form-item>-->
          </el-col>
        </el-form>
      </el-row>
      <!--分页器-->
      <el-row>
        <div style="padding:0 10px">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
            :current-page="searchForm.currentPage"
            :page-sizes="[15,25,50,100]"
            :page-size="searchForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="searchForm.totalCount">
          </el-pagination>
        </div>
      </el-row>
    </div>
    <!--表格-->
    <div class="body">
      <el-tabs type="border-card">
        <el-tab-pane label="项目开票">
          <div>
            <el-radio-group v-model="radio.openTicket" size="small" @change="radioChange">
              <el-radio-button label="1">我的待开票项目</el-radio-button>
              <el-radio-button label="2">我的已开票项目</el-radio-button>
            </el-radio-group>
          </div>
          <div class="my-table-myTask">
            <el-table
              v-loading="table_loading"
              stripe fit
              :data="projects" id="market-myTask"
              :row-style="rowStyle" :cell-style="cellStyle">
              <el-table-column align="center" prop="id" label="项目ID" width="65"></el-table-column>
              <el-table-column align="center" prop="project_no" label="项目编号" width="150"></el-table-column>
              <el-table-column align="center" prop="name" label="项目名称" width="365"></el-table-column>
              <el-table-column align="center" prop="progress_status" label="合同状态" width="100" :formatter="progressStatusFormat"></el-table-column>
              <el-table-column align="center" prop="money_total" label="合同金额" width="100"></el-table-column>
              <el-table-column align="center" prop="receive_status" label="收款状态" width="100" :formatter="receiveStatusFormat"></el-table-column>
              <el-table-column align="center" prop="open_ticket" label="开票金额" width="100"></el-table-column>
              <el-table-column align="center" prop="money_received" label="已收金额" width="100"></el-table-column>
              <el-table-column align="center" label="未收金额" width="100">
                <template slot-scope="scope">
                  {{scope.row.open_ticket - scope.row.money_received}}
                </template>
              </el-table-column>
              <el-table-column align="center" prop="comment" label="备注"></el-table-column>
              <el-table-column width="230" fixed="left" label="操作栏" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="onClickViewInvoices(scope.row)">开票/收款记录</el-button>
                  <el-button size="mini" type="success" @click="onClickCreateInvoice(scope.row)">申请开票</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--开票记录窗口-->
    <el-dialog title="开票记录" :visible.sync="visible.invoice_record" class="dialog-invoice" width="1440px">
      <el-row>提示: 除了创建无票收款外,其他操作都必须勾选一个发票后才能进行!</el-row>
      <el-row style="margin-bottom: 5px">
        <el-button @click="onClickShowReceipts" :disabled="multipleSelection.length!==1" size="mini" type="primary">查看收款记录</el-button>
        <el-button @click="onClickCreateReceipt" :disabled="multipleSelection.length!==1" size="mini" type="success">创建有票收款</el-button>
        <el-button @click="onClickCreateReceipt_" size="mini" type="success">创建无票收款</el-button>
        <el-button @click="onClickUpdateInvoice" :disabled="multipleSelection.length!==1" size="mini" type="warning">修改开票申请</el-button>
        <el-button @click="onClickCancelInvoice" :disabled="multipleSelection.length!==1" size="mini" type="info">取消开票申请</el-button>
      </el-row>
      <el-row>
        <el-table :data="invoices"
                  :row-style="rowStyle" :cell-style="cellStyle"
                  stripe fit
                  @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="45"></el-table-column>
          <el-table-column property="id" label="发票ID" width="65"></el-table-column>
          <el-table-column label="发票号" width="100">
            <template slot-scope="scope">
              {{scope.row.invoice_no===null?'暂无':scope.row.invoice_no}}
            </template>
          </el-table-column>
          <el-table-column label="开票时间" width="140">
            <template slot-scope="scope">
              {{scope.row.financial_at | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column property="invoice_status" label="开票状态" width="100" :formatter="invoiceStatusFormat"></el-table-column>
          <el-table-column property="invoice_money" label="开票金额" width="100"></el-table-column>
          <el-table-column property="received_money" label="已收金额" width="100"></el-table-column>
          <el-table-column label="未收金额" width="100">
            <template slot-scope="scope">
              {{scope.row.invoice_no === '无票收款'?'-':scope.row.invoice_money - scope.row.received_money}}
            </template>
          </el-table-column>
          <el-table-column property="invoice_company" label="客户名称" width="200"></el-table-column>
          <el-table-column property="note" label="开票备注" width="150"></el-table-column>
          <el-table-column property="create_at" label="申请时间" width="150" :formatter="dateFormat"></el-table-column>
          <el-table-column property="creater.name" label="申请人" width="100"></el-table-column>
          <el-table-column property="comment" label="审批备注" width="200"></el-table-column>
        </el-table>
      </el-row>
    </el-dialog>
    <el-dialog :before-close="handleCloseDialog" :title="formStatus===1?'创建开票申请':'修改开票申请'" :visible.sync="visible.invoice_create">
      <el-form :rules="invoice_rules" :model="ruleForm" ref="ruleForm" label-width="100px" size="small">
        <el-form-item label="开票项目">
          <el-input style="width: 300px" v-model="active_project_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="开票金额" prop="invoice_money">
          <el-input style="width: 150px" v-model="ruleForm.invoice_money"></el-input>
        </el-form-item>
        <el-form-item label="客户名称" prop="invoice_company">
          <el-input style="width: 300px" v-model="ruleForm.invoice_company"></el-input>
        </el-form-item>
        <el-form-item label="开票备注">
          <el-input type="textarea" autosize style="width: 300px" v-model="ruleForm.note"></el-input>
        </el-form-item>
        <el-form-item label="操作栏">
          <el-button type="primary" @click="submitForm('ruleForm')">确认申请</el-button>
          <el-button @click="visible.invoice_create = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="收款记录" :visible.sync="visible.received_record" class="dialog-invoice" width="1440px">
      <el-row>提示: 本收款只能对发票进行收款,若系统上不存在该发票,请先申请开票或直接创建无票收款!!</el-row>
      <el-row style="margin-bottom: 5px">
        <el-button @click="onClickCancelReceipt" :disabled="multipleSelection_.length!==1" size="mini" type="primary">撤销收款记录</el-button>
        <el-button @click="onClickUpdateReceipt" :disabled="multipleSelection_.length!==1" size="mini" type="primary">修改收款信息</el-button>
      </el-row>
      <el-row>
        <el-table :data="receipts"
                  :row-style="rowStyle" :cell-style="cellStyle"
                  stripe fit
                  @selection-change="handleSelectionChange_">
          <el-table-column align="center" type="selection" width="45"></el-table-column>
          <el-table-column property="id" label="收款ID" width="65"></el-table-column>
          <el-table-column property="receive_date" label="收款时间" width="150" :formatter="dateFormat"></el-table-column>
          <el-table-column property="created_at" label="创建时间" width="150" :formatter="dateFormat"></el-table-column>
          <el-table-column property="updated_at" label="生效时间" width="150" :formatter="dateFormat"></el-table-column>
          <el-table-column property="inputUser.name" label="创建人" width="100"></el-table-column>
          <el-table-column property="money" label="收款金额" width="100"></el-table-column>
          <el-table-column property="invoice_company" label="付款单位"></el-table-column>
          <el-table-column property="invoice.invoice_no" label="所属发票" width="200"></el-table-column>
          <el-table-column property="status" label="生效状态" width="100">
            <template slot-scope="scope">
              {{scope.row.status === 1?'已生效':'待确认'}}
            </template>
          </el-table-column>
          <el-table-column property="comment" label="收款备注" width="200"></el-table-column>
        </el-table>
      </el-row>
    </el-dialog>
    <el-dialog :before-close="handleCloseDialog_" :title="formStatus_===1?'创建收款记录':'修改收款记录'" :visible.sync="visible.received_create">
      提示: 创建收款后,不会立即生效,需要等待财务人员确认后才会生效!
      <el-form :rules="receipt_rules" :model="ruleForm_" ref="ruleForm_" label-width="100px" size="small">
        <el-form-item label="收款项目">
          <el-input style="width: 300px" v-model="active_project_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="收款发票">
          <el-input style="width: 300px" v-model="active_invoice_no" disabled></el-input>
        </el-form-item>
        <el-form-item label="收款日期" prop="receive_date">
          <el-date-picker v-model="ruleForm_.receive_date" value-format="timestamp" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="收款金额" prop="money">
          <el-input style="width: 150px" v-model="ruleForm_.money" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="客户名称" prop="invoice_company">
          <el-input style="width: 150px" v-model="ruleForm_.invoice_company" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="收款备注">
          <el-input type="textarea" autosize style="width: 300px" v-model="ruleForm_.comment"></el-input>
        </el-form-item>
        <el-form-item label="操作栏">
          <el-button type="primary" @click="submitForm_('ruleForm_')">确认创建</el-button>
          <el-button @click="visible.received_create = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  const defaultSearchForm = {
    id: null,
    name: null,
    receive_status: null,
    currentPage: 1,
    pageSize: 15,
    totalCount: 0,
    open_ticket_type: 0 // 数值为0表示未开票,不等于0时表示已开票
  }
  const defaultRuleForm = {
    invoice_money: null,
    project_id: null,
    invoice_company: null,
    id: null
  }
  const defaultRuleForm_ = {
    comment: null,
    invoice_company: null,
    money: null,
    receive_date: null,
    id: null,
    invoice_id: null,
    project_id: null
  }
  import { getReceivals, createReceipt_, updateReceipt_ } from '../../api/receival'
  import { getProjects } from '../../api/project'
  import { createInvoice, getInvoice, updateInvoice } from '../../api/invoice'
  import { parseTime } from '../../utils/index'
  export default {
    name: 'myTask',
    data() {
      return {
        projects: [],
        invoices: [],
        receipts: [],
        // 被选中项
        multipleSelection: [],
        multipleSelection_: [],
        table_loading: false,
        receive_status: [
          { id: null, name: '全部' },
          { id: 0, name: '未收款' },
          { id: 3, name: '部分收款' },
          { id: 4, name: '完成收款' }
        ],
        searchForm: Object.assign({}, defaultSearchForm),
        // 表单类型: 1=创建 2=更新
        formStatus: 1, // 创建开票申请
        formStatus_: 1, // 创建收款记录
        // 开票申请表单
        ruleForm: Object.assign({}, defaultRuleForm),
        // 创建收款表单
        ruleForm_: Object.assign({}, defaultRuleForm_),
        active_project_name: null,
        active_project_id: null,
        active_invoice_no: null,
        visible: {
          invoice_record: false,
          received_record: false,
          invoice_create: false,
          received_create: false
        },
        invoice_rules: {
          invoice_money: [
            { required: true, message: '开票金额不得为空', trigger: 'blur' }
          ],
          invoice_company: [
            { required: true, message: '客户名称不得为空', trigger: 'blur' }
          ]
        },
        receipt_rules: {
          receive_date: [
            { required: true, message: '收款日期不得为空', trigger: 'blur' }
          ],
          money: [
            { required: true, message: '收款金额不得为空', trigger: 'blur' }
          ],
          invoice_company: [
            { required: true, message: '付款单位不得为空', trigger: 'blur' }
          ]
        },
        radio: {
          openTicket: '1'
        }
      }
    },
    methods: {
      /** 点击事件类 */
      onSubmitSearchForm() {
        this.fetchProjects(this.searchForm)
      },
      resetSearchForm() {
        this.searchForm = Object.assign({}, defaultSearchForm)
      },
      onClickViewInvoices(row) {
        this.visible.invoice_record = true
        this.active_project_name = row.name
        this.active_project_id = row.id
        this.fetchInvoice(row.id)
      },
      onClickCreateInvoice(row) {
        this.formStatus = 1
        this.active_project_name = row.name
        this.ruleForm.project_id = row.id
        this.visible.invoice_create = true
      },
      onClickUpdateInvoice() {
        if (this.multipleSelection.length === 1) {
          if (Number(this.multipleSelection[0].invoice_status) === 0) {
            this.formStatus = 2
            this.ruleForm = Object.assign({}, this.multipleSelection[0])
            this.active_project_name = this.multipleSelection[0].project.name
            this.ruleForm.id = this.multipleSelection[0].id
            this.visible.invoice_create = true
          } else {
            this.$message({ message: '该发票已经过审批,无法修改!', type: 'warning' })
          }
        }
      },
      onClickCancelInvoice() {
        if (this.multipleSelection.length === 1) {
          if (Number(this.multipleSelection[0].invoice_status) === 0) {
            this.formStatus = 2
            this.ruleForm = Object.assign({}, this.multipleSelection[0])
            this.ruleForm.invoice_status = 4
            this.ruleForm.project_id = this.multipleSelection[0].project_id
            updateInvoice(this.ruleForm).then(res => {
              if (res.data.bCode === 101) {
                this.$notify({ title: '成功', message: '更新开票申请信息成功!', type: 'success', position: 'top-right' })
              } else {
                this.$notify({ title: '失败', message: res.data.bData, type: 'warning', position: 'top-right' })
              }
              this.fetchInvoice(this.ruleForm.project_id)
            })
          } else {
            this.$message({ message: '该发票已经不支持修改,无法取消!', type: 'warning' })
          }
        }
      },
      onClickShowReceipts() {
        this.visible.received_record = true
        const i_id = this.multipleSelection[0].id
        const p_id = this.multipleSelection[0].project_id
        this.fetchReceipts(i_id, p_id)
      },
      onClickCreateReceipt() {
        this.resetRuleForm_()
        if (Number(this.multipleSelection[0].invoice_status) !== 2) {
          this.$message({ message: '该发票还未开票,无法创建收款!', type: 'warning' })
          return
        }
        // 创建有票收款
        this.formStatus_ = 1
        this.visible.received_create = true
        this.ruleForm_.invoice_no = this.multipleSelection[0].invoice_no
        this.ruleForm_.invoice_id = this.multipleSelection[0].id
        this.ruleForm_.project_id = this.active_project_id
        this.active_invoice_no = this.multipleSelection[0].invoice_no
      },
      onClickCreateReceipt_() {
        this.resetRuleForm_()
        // 创建无票收款
        this.formStatus_ = 1
        this.active_invoice_no = '无票收款'
        this.ruleForm_.invoice_no = '无票收款'
        this.ruleForm_.project_id = this.active_project_id
        this.visible.received_create = true
      },
      onClickCancelReceipt() {
        // 取消收款申请
        if (Number(this.multipleSelection_[0].status) === 0) {
          this.resetRuleForm_()
          this.ruleForm_.valid = 0
          this.ruleForm_.id = this.multipleSelection_[0].id
          this.ruleForm_.invoice_id = this.multipleSelection_[0].invoice.id
          updateReceipt_(this.ruleForm_).then(res => {
            if (res.data.bCode === 101) {
              this.$notify({ title: '成功', message: '撤销成功!', type: 'success', position: 'top-right' })
            } else {
              this.$notify({ title: '失败', message: res.data.bData, type: 'warning', position: 'top-right' })
            }
            const i_id = this.multipleSelection[0].id
            const p_id = this.multipleSelection[0].project_id
            this.fetchReceipts(i_id, p_id)
          })
        } else {
          this.$message({ message: '该收款已经财务确认,无法撤销!', type: 'warning' })
        }
      },
      onClickUpdateReceipt() {
        if (Number(this.multipleSelection_[0].status) === 0) {
          // 修改收款申请信息
          this.formStatus_ = 2
          this.ruleForm_.invoice_id = this.multipleSelection_[0].invoice.id
          this.ruleForm_.project_id = this.multipleSelection_[0].project_id
          this.ruleForm_.comment = this.multipleSelection_[0].comment
          this.ruleForm_.id = this.multipleSelection_[0].id
          this.ruleForm_.invoice_no = this.multipleSelection_[0].invoice.invoice_no
          this.active_invoice_no = this.multipleSelection_[0].invoice.invoice_no
          this.ruleForm_.receive_date = this.multipleSelection_[0].receive_date * 1000
          this.ruleForm_.money = this.multipleSelection_[0].money
          this.ruleForm_.invoice_company = this.multipleSelection_[0].invoice_company
          this.visible.received_create = true
        } else {
          this.$message({ message: '该收款已经财务确认,无法修改!', type: 'warning' })
        }
      },
      radioChange() {
        if (this.radio.openTicket === '1') {
          this.searchForm.open_ticket_type = 0
        } else if (this.radio.openTicket === '2') {
          this.searchForm.open_ticket_type = 1
        }
        this.fetchProjects()
      },
      /** 接口获取类 */
      fetchProjects() {
        const res = Object.assign({}, this.searchForm, { 'deal_user_id': this.$store.getters.userId })
        getProjects(res).then(res => {
          this.projects = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      fetchInvoice(id) {
        getInvoice({ 'project_id': id }).then(res => {
          this.invoices = res.data._items
          this.resetRuleForm()
        })
      },
      fetchReceipts(invoice_id, project_id) {
        const params = {
          'invoice_id': invoice_id,
          'project_id': project_id
        }
        getReceivals(params).then(res => {
          this.receipts = res.data._items
        })
      },
      /** 处理器类 */
      handleSizeChange(pageSize) {
        this.searchForm.pageSize = pageSize
        this.fetchProjects()
      },
      handlePageChange(currentPage) {
        this.searchForm.page = currentPage
        this.fetchProjects()
      },
      handleSelectionChange(val) {
        // 发票表
        this.multipleSelection = val
      },
      handleSelectionChange_(val) {
        // 收款表
        this.multipleSelection_ = val
      },
      handleCloseDialog(done) {
        // 关闭创建开票申请时提醒
        this.$confirm('确认关闭？')
          .then(res => {
            done()
          })
          .catch(res => {})
      },
      handleCloseDialog_(done) {
        // 关闭创建收款记录时提醒
        this.$confirm('确认关闭？')
          .then(res => {
            done()
          })
          .catch(res => {})
      },
      /** 格式化过滤类 */
      progressStatusFormat(row, column) {
        const value = row[column.property]
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
        return '无'
      },
      receiveStatusFormat(row, column) {
        const value = row[column.property]
        if (value === 0 || value === 1 || value === 2) {
          return '未收款'
        }
        if (value === 3) {
          return '部分收款'
        }
        if (value === 4) {
          return '完成收款'
        }
        return '无'
      },
      invoiceStatusFormat(row, column) {
        const value = Number(row[column.property])
        if (value === 0) {
          return '待审批'
        }
        if (value === 1) {
          return '待开票'
        }
        if (value === 2) {
          return '已开票'
        }
        if (value === 3) {
          return '已拒绝'
        }
        if (value === 4) {
          return '已取消'
        }
        return '无'
      },
      dateFormat(row, column) {
        const date = row[column.property]
        if (date === null) return '暂无'
        return parseTime(date, '{y}-{m}-{d}')
      }, // 时间格式化
      /** -------- 表格样式类 -------- */
      rowStyle() {
        return 'height: 30px'
      },
      cellStyle({ row, column, rowIndex, columnIndex }) {
        return 'padding: 3px;padding-top: 8px;padding-bottom: 8px'
      },
      /** ------- 表单处理类 -------- */
      // 提交开票申请表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.formStatus === 1) {
              createInvoice(this.ruleForm).then(res => {
                if (res.data.bCode === 101) {
                  this.$notify({ title: '成功', message: '申请开票成功!', type: 'success', position: 'top-right' })
                } else {
                  this.$notify({ title: '失败', message: res.data.bData, type: 'warning', position: 'top-right' })
                }
              })
            } else if (this.formStatus === 2) {
              updateInvoice(this.ruleForm).then(res => {
                if (res.data.bCode === 101) {
                  this.$notify({ title: '成功', message: '更新开票申请信息成功!', type: 'success', position: 'top-right' })
                } else {
                  this.$notify({ title: '失败', message: res.data.bData, type: 'warning', position: 'top-right' })
                }
              })
            }
            this.visible.invoice_create = false
            this.fetchInvoice(this.ruleForm.project_id)
          } else {
            console.log('提交错误!!')
            return false
          }
        })
      },
      // 提交收款记录表单
      submitForm_(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ruleForm_.receive_date = Math.floor(this.ruleForm_.receive_date / 1000)
            if (this.formStatus_ === 1) {
              createReceipt_(this.ruleForm_).then(res => {
                if (res.data.bCode === 101) {
                  this.$notify({ title: '成功', message: '创建收款申请成功!', type: 'success', position: 'top-right' })
                } else {
                  this.$notify({ title: '失败', message: res.data.bData, type: 'warning', position: 'top-right' })
                }
              })
            } else if (this.formStatus_ === 2) {
              updateReceipt_(this.ruleForm_).then(res => {
                if (res.data.bCode === 101) {
                  this.$notify({ title: '成功', message: '更新收款信息成功!', type: 'success', position: 'top-right' })
                } else {
                  this.$notify({ title: '失败', message: res.data.bData, type: 'warning', position: 'top-right' })
                }
              })
            }
            this.visible.received_create = false
            const i_id = this.multipleSelection[0].id
            const p_id = this.multipleSelection[0].project_id
            this.fetchReceipts(i_id, p_id)
            this.fetchInvoice(p_id)
            this.resetRuleForm_()
          } else {
            console.log('提交错误!!')
            return false
          }
        })
      },
      // 释放表单
      resetRuleForm() {
        this.ruleForm = Object.assign({}, defaultRuleForm)
      },
      resetRuleForm_() {
        this.ruleForm_ = Object.assign({}, defaultRuleForm_)
      }
    },
    filters: {
      dateFormat(value) {
        if (value === null) return '暂无'
        else return parseTime(value, '{y}-{m}-{d}')
      } // 时间格式化
    },
    mounted() {
      this.fetchProjects()
    }
  }
</script>

<style scoped>
  .dialog-invoice {
    width: auto!important;
  }
</style>
