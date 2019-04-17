<template>
  <div class="app-container">
    <div class="header">
      <el-row v-if="showCheckbox" style="background-color: rgb(236, 243, 247);padding-left: 10px;padding-top: 10px;border-radius:10px 10px;box-shadow: 0 1px 1px 1px #c0c4cc;">
        <!--搜索组件-->
        <el-form :inline="true" ref="searchForm" :model="searchForm" label-width="100px">
          <!--第一行-->
          <el-row style="height: 40px;">
            <el-form-item label="输入搜索" label-width="70px">
              <el-input style="width: 320px" size="small" v-model="searchForm.project_name" placeholder="输入项目名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input size="small" v-model="searchForm.project_id" placeholder="输入项目ID"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input size="small" v-model="searchForm.id" placeholder="输入发票ID"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input style="width: 180px" size="small" v-model="searchForm.invoice_company" placeholder="输入开票单位"></el-input>
            </el-form-item>
          </el-row>
          <!--第二行-->
          <el-row style="height: 40px;">
            <el-form-item label="开票时间" prop="date" label-width="70px">
              <el-date-picker
                size="small"
                style="width: 320px"
                v-model="searchForm.date"
                type="daterange"
                align="right"
                unlink-panels
                value-format = "timestamp"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="申请时间" prop="date" label-width="70px">
              <el-date-picker
                size="small"
                style="width: 320px"
                v-model="searchForm.date"
                type="daterange"
                align="right"
                unlink-panels
                value-format = "timestamp"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-row>
          <!--第三行-->
          <el-row style="height: 40px;">
            <el-form-item label="选择搜索" label-width="70px">
              <el-select
                size="small" style="width: 180px"
                v-model="searchForm.creater_id"
                filterable remote reserve-keyword
                placeholder="申请开票人"
                :remote-method="remoteUsers">
                <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select :disabled="choseStatus === 'one'" size="small" style="width: 180px" v-model="searchForm.invoice_status" placeholder="开票状态">
                <el-option v-for="(val, key) in invoice_status" :key="key" :label="val.name" :value="val.id"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <!--第四行-->
          <el-row style="height: 40px;">
            <el-button @click="onSearch()" icon="el-icon-search" style="margin-left: 70px;width: 200px" type="primary" size="small">点击搜索</el-button>
            <el-button @click="resetSearchForm" icon="el-icon-close" style="width: 200px" type="primary" size="small">清空</el-button>
          </el-row>
        </el-form>
      </el-row>
      <el-row>
        <!--表格类型切换栏-->
        <el-col style="margin-top: 10px">
          <div>
            <!--表格切换选择器-->
            <div class="header-font" >表格类型切换</div>
            <el-radio-group v-model="choseStatus" size="small" @change="onChangeChose">
              <el-radio-button label="one">待审批</el-radio-button>
              <el-radio-button label="three">待填发票号</el-radio-button>
              <el-radio-button label="two">全部申请</el-radio-button>
            </el-radio-group>
            <!--右浮 收展按钮-->
            <el-button
              plain
              size="small"
              type="success"
              @click="showCheckbox = !showCheckbox"
              class="el-icon-d-caret shrink-button">
              {{showCheckbox === true?'收起顶部':'展开顶部'}}</el-button>
            <div class="header-font" style="margin-left: 20px" > 财务部审批人
              <a style="margin-left: 10px;color: #DD4A68">{{department.user_id === null?'待设置部门主管':department.charge_user_name}}</a>
              <el-button size="mini" type="primary" style="margin-left: 10px">设置财务部主管</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <!--分页器-->
        <el-col>
          <div class="pagination">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
              :current-page="searchForm.currentPage"
              :page-sizes="[15, 25, 50, 100, 200]"
              :page-size="searchForm.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="searchForm.totalCount">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="body">
      <div class="my-table-invoices">
        <el-table
          stripe fit
          :data="invoices" id="market-myTask"
          :row-style="rowStyle" :cell-style="cellStyle">
          <el-table-column align="center" prop="id" label="发票ID" width="65"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" label="发票号" width="200">
            <template slot-scope="scope">
              {{scope.row.invoice_no===null?'暂无':scope.row.invoice_no}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="project.id" label="项目ID" width="65"></el-table-column>
          <el-table-column align="center" prop="project.name" label="项目名称" width="250" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" property="create_at" label="申请时间" width="120" :formatter="dateFormat"></el-table-column>
          <el-table-column property="invoice_company" label="客户名称" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column property="financial_at" label="开票时间" width="120" :formatter="dateFormat"></el-table-column>
          <el-table-column align="center" property="invoice_status" label="开票状态" width="100" :formatter="invoiceStatusFormat"></el-table-column>
          <el-table-column align="right" prop="invoice_money" label="开票金额" width="120"></el-table-column>
          <el-table-column align="right" property="project" label="总未开金额" width="120" :formatter="getNoOpenTicket"></el-table-column>
          <el-table-column property="note" label="开票备注" width="150"></el-table-column>
          <el-table-column property="creater.name" label="申请人" width="100"></el-table-column>
          <el-table-column property="comment" label="审批备注" width="200"></el-table-column>
          <el-table-column width="200" fixed="left" label="操作栏" align="center" v-if="getActionViewAccess === true">
            <template slot-scope="scope">
              <el-button class="actionButton" size="mini" type="success" :disabled="scope.row.invoice_status!=='1'" @click="onClickAgree(scope.row)" v-if="getActionConfirmAccess === true">确认</el-button>
              <el-button class="actionButton" size="mini" type="danger" :disabled="scope.row.invoice_status!=='1'" @click="onClickRefuse(scope.row)" v-if="getActionConfirmAccess === true">拒绝</el-button>
              <el-button class="actionButton" size="mini" type="primary" :disabled="scope.row.invoice_status!=='2'" @click="onClickUpdate(scope.row)" >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="编辑发票" :visible.sync="visible.invoice_edit" style="width: 1000px">
      <el-form :rules="invoice_rules" :model="ruleForm" ref="ruleForm" label-width="120px" size="small">
        <el-form-item label="开票项目">
          <el-input style="width: 300px" v-model="ruleForm.project_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="开票金额">
          <el-input style="width: 150px" v-model="ruleForm.invoice_money" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input style="width: 300px" v-model="ruleForm.invoice_company" disabled></el-input>
        </el-form-item>
        <el-form-item label="发票号" prop="invoice_no">
          <el-input type="textarea" autosize style="width: 300px" v-model="ruleForm.invoice_no"></el-input>
        </el-form-item>
        <el-form-item label="实际开票时间" prop="financial_at">
          <el-date-picker v-model="ruleForm.financial_at" value-format="timestamp" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="操作栏">
          <el-button type="primary" @click="submitForm('ruleForm')">确认申请</el-button>
          <el-button @click="visible.invoice_edit = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_pageInvoiceApply   beforeMount()
-->
<script>
  const defaultSearchForm = {
    id: null,
    project_id: null,
    project_name: null,
    create_at: null,
    start_create_at: null,
    end_create_at: null,
    creater_id: null,
    invoice_no: null,
    invoice_company: null,
    invoice_status: null,
    financial_at: null,
    start_financial_at: null,
    end_financial_at: null,
    currentPage: 1,
    pageSize: 15,
    totalCount: 0
  }
  const defaultRuleForm = {
    id: null,
    invoice_status: null,
    invoice_money: null,
    financial_at: null,
    comment: null,
    invoice_no: null,
    project_name: null,
    invoice_company: null
  }
  import { getUsers, getView } from '../../../../api/user'
  import { getInvoices, updateInvoice } from '../../../../api/invoice'
  import { parseTime } from '../../../../utils/index'
  import { getDepartments } from '../../../../api/department'

  export default {
    data() {
      return {
        projects: [],
        users: [],
        invoices: [],
        department: [],
        user_department_id: null, // 存储用户的部门ID
        invoice_status: [
          { id: null, name: '请选择开票状态' },
          { id: 0, name: '待审批' },
          { id: 1, name: '待开票' },
          { id: 2, name: '已开票' },
          { id: 3, name: '已拒绝' },
          { id: 4, name: '已取消' }
        ],
        searchForm: Object.assign({}, defaultSearchForm),
        ruleForm: Object.assign({}, defaultRuleForm),
        // 时间选择器默认快捷选项
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
        showCheckbox: true,
        // 表格切换选择器当前选择项
        choseStatus: 'one',
        visible: {
          invoice_edit: false
        },
        invoice_rules: {
          financial_at: [
            { required: true, message: '日期不得为空', trigger: 'blur' }
          ],
          invoice_no: [
            { required: true, message: '发票号不得为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      /** 点击事件类 **/
      onSearch() {
        if (this.choseStatus === 'one') this.searchForm.invoice_status = 1
        this.fetchInvoices(this.searchForm)
      },
      onChangeChose() {
        if (this.choseStatus === 'one') this.searchForm.invoice_status = 1
        if (this.choseStatus === 'three') {
          this.searchForm.invoice_no = 'null'
          this.searchForm.invoice_status = null
        } else this.searchForm.invoice_no = null
        if (this.choseStatus === 'two') this.searchForm.invoice_status = null
        this.fetchInvoices(this.searchForm)
      }, // 选择器被选择
      onClickAgree(row) {
        this.$prompt('确认审批并开票?' + '<br />' + '发票号可空,后续补填!', '审批开票', {
          inputPlaceholder: '请填写发票号(可补填)!',
          confirmButtonText: '确认开票',
          cancelButtonText: '我再想想',
          type: 'warning',
          center: true,
          dangerouslyUseHTMLString: true,
          inputValue: row.comment
        }).then(({ value }) => {
          this.ruleForm = Object.assign({}, row)
          this.ruleForm.invoice_no = value
          this.ruleForm.id = row.id
          this.ruleForm.invoice_status = 2
          this.ruleForm.financial_at = Math.floor((Number)(new Date()) / 1000)
          updateInvoice(this.ruleForm).then(res => {
            this.fetchInvoices(this.searchForm)
            this.$message({ type: 'success', message: '开票成功!' })
            this.resetRuleForm()
          })
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消操作' })
          this.resetRuleForm()
        })
      },
      onClickRefuse(row) {
        this.$prompt('将审批并<a style="color: darkred">拒绝</a>该申请,是否确认<a style="color: darkred">拒绝</a>?', '拒绝申请', {
          inputPlaceholder: '请填写拒绝原因!',
          confirmButtonText: '确认异常',
          cancelButtonText: '我再想想',
          type: 'error',
          center: true,
          dangerouslyUseHTMLString: true,
          inputValue: row.comment
        }).then(({ value }) => {
          this.ruleForm.comment = value
          this.ruleForm.id = row.id
          this.ruleForm.invoice_status = 3
          this.ruleForm.financial_at = Math.floor((Number)(new Date()) / 1000)
          updateInvoice(this.ruleForm).then(res => {
            this.fetchInvoices(this.searchForm)
          })
          this.$message({ type: 'success', message: '拒绝成功!' })
          this.resetRuleForm()
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消操作' })
          this.resetRuleForm()
        })
      },
      onClickUpdate(row) {
        this.ruleForm.project_name = row.project.name
        this.ruleForm = Object.assign({}, row)
        if ((row.financial_at).toString().length === 10) this.ruleForm.financial_at = row.financial_at * 1000
        this.visible.invoice_edit = true
      },
      /** 表单处理类 */
      submitForm(formName) {
        if ((this.ruleForm.financial_at).toString().length === 13) this.ruleForm.financial_at = this.ruleForm.financial_at / 1000
        console.log(this.ruleForm)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            updateInvoice(this.ruleForm).then(res => {
              if (res.data.bCode === 101) {
                this.$notify({ title: '成功', message: '更新开票信息成功!', type: 'success', position: 'top-right' })
              } else {
                this.$notify({ title: '失败', message: res.data.bData, type: 'warning', position: 'top-right' })
              }
              this.visible.invoice_edit = false
              this.fetchInvoices(this.searchForm)
              this.resetRuleForm()
            })
          } else {
            console.log('提交错误!!')
            return false
          }
        })
      },
      resetSearchForm() {
        this.searchForm = Object.assign({}, defaultSearchForm)
      },
      resetRuleForm() {
        this.ruleForm = Object.assign({}, defaultRuleForm)
      },
      /** 接口获取类 */
      fetchUsers(params) {
        getUsers(params).then(res => {
          this.users = res.data._items
        })
      },
      fetchInvoices() {
        getInvoices(this.searchForm).then(res => {
          this.invoices = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      fetchDepartment() {
        getDepartments({ 'department_id': 54 }).then(res => {
          this.department = res.data._items[0]
        })
      }, // 获取财务部门主管的用户ID
      fetchDepartmentId_Mine() {
        getView({ 'id': this.$store.getters.userId }).then(res => {
          this.user_department_id = res.data.department_id
        })
      }, // 获取登录用户的部门ID
      /** 远程搜索类 */
      remoteUsers(query) {
        let params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        this.fetchUsers(params)
      }, // 远程搜索用户
      // 一页多少行
      handleSizeChange(pageSize) {
        this.searchForm.pageSize = pageSize
        this.fetchInvoices()
      },
      // 翻页
      handlePageChange(currentPage) {
        this.searchForm.page = currentPage
        this.fetchInvoices()
      },
      /** 过滤类 */
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
        if (date === null) {
          return '暂无'
        }
        return parseTime(date, '{y}-{m}-{d}')
      }, // 时间格式化
      getNoOpenTicket(row, column) {
        const money_total = row[column.property].money_total
        if (money_total === null) return '合同额无效'
        let open_ticket = row[column.property].open_ticket
        if (open_ticket === null) open_ticket = 0
        return (money_total - open_ticket).toFixed(2)
      },
      /** -------- 表格样式类 -------- */
      rowStyle() {
        return 'height: 25px'
      },
      cellStyle({ row, column, rowIndex, columnIndex }) {
        return 'padding: 5px'
      }
    },
    mounted() {
      this.fetchUsers()
      this.onSearch()
      this.fetchDepartment()
      this.fetchDepartmentId_Mine()
    },
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_pageInvoiceApply#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    },
    computed: {
      getActionViewAccess() {
        // 获取操作栏的可视权限,仅财务部门员工和Admin可视
        if (this.user_department_id !== null) return this.user_department_id === 54 || this.$store.getters.userId === 33
        else return false
      },
      getActionConfirmAccess() {
        // 获取操作栏中确认+拒绝操作的可视权限,仅财务部主管和Admin可视
        return this.$store.getters.userId === this.department.user_id || this.$store.getters.userId === 33
      }
    }
  }
</script>

<style scoped>
  .header-font{
    color: rgb(96, 98, 102);
    display: inline-block;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
    line-height: 40px;
    padding-right: 12px;
    text-align: right;
    text-rendering: optimizeLegibility;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
  }
  .shrink-button{
    z-index: 100;
    float:right;
    margin-right: 200px;
    width: 200px;
  }
  .pagination{
    margin-top: 5px;
    text-align: center;
  }
  .actionButton{
    padding: 5px 10px;
    margin-left: 0 !important;
  }
</style>
