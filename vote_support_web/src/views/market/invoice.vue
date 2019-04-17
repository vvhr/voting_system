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
            <div class="header-font" style="margin-left: 20px" > 经营部审批人
              <a style="margin-left: 10px;color: #DD4A68">{{department.user_id === null?'待设置部门主管':department.charge_user_name}}</a>
            <el-button size="mini" type="primary" style="margin-left: 10px" @click="onClickSetCharge">设置经营部主管</el-button>
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
          <el-table-column align="center" label="发票号" width="150" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{scope.row.invoice_no===null?'暂无':scope.row.invoice_no}}</template>
          </el-table-column>
          <el-table-column align="center" prop="project_id" label="项目ID" width="65"></el-table-column>
          <el-table-column align="center" prop="project.name" label="项目名称" width="250" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" property="create_at" label="申请时间" width="120" :formatter="dateFormat"></el-table-column>
          <el-table-column property="approver_at" label="审批时间" width="120" :formatter="dateFormat"></el-table-column>
          <el-table-column property="financial_at" label="开票时间" width="120" :formatter="dateFormat"></el-table-column>
          <el-table-column align="center" property="invoice_status" label="开票状态" width="100" :formatter="invoiceStatusFormat"></el-table-column>
          <el-table-column align="right" prop="invoice_money" label="开票金额" width="120"></el-table-column>
          <el-table-column align="right" prop="received_money" label="已收金额" width="120"></el-table-column>
          <el-table-column align="right" label="未收金额" width="120">
            <template slot-scope="scope">{{(scope.row.invoice_money - scope.row.received_money).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column property="invoice_company" label="客户名称" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column property="note" label="开票备注" width="150"></el-table-column>
          <el-table-column property="creater.name" label="申请人" width="100"></el-table-column>
          <el-table-column property="comment" label="审批备注" width="200"></el-table-column>
          <el-table-column width="160" fixed="left" label="操作栏" align="center" v-if="$store.getters.userId === department.user_id">
            <template slot-scope="scope">
              <el-button size="mini" type="success" :disabled="scope.row.invoice_status!=='0'" @click="onClickAgree(scope.row)">通过</el-button>
              <el-button size="mini" type="danger" :disabled="scope.row.invoice_status!=='0'" @click="onClickRefuse(scope.row)">拒绝</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_pageInvoice   beforeMount()
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
    approver_at: null,
    comment: null
  }
  import { getUsers } from '../../api/user'
  import { getInvoices, updateInvoice } from '../../api/invoice'
  import { parseTime } from '../../utils/index'
  import { getDepartments } from '../../api/department'

  export default {
    name: 'invoice',
    data() {
      return {
        projects: [],
        users: [],
        invoices: [],
        department: [],
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
        choseStatus: 'two'
      }
    },
    methods: {
      onClickSetCharge() {
        this.$message({ type: 'warning', message: '请到部门管理页面设置部门负责人!!' })
      },
      onSearch() {
        if (this.choseStatus === 'one') this.searchForm.invoice_status = 0
        if (this.choseStatus === 'two') this.searchForm.invoice_status = null
        this.fetchInvoices(this.searchForm)
      },
      onChangeChose() {
        if (this.choseStatus === 'one') this.searchForm.invoice_status = 0
        if (this.choseStatus === 'two') this.searchForm.invoice_status = null
        this.fetchInvoices(this.searchForm)
      }, // 选择器被选择
      onClickAgree(row) {
        this.$confirm('确认审批通过该开票申请?', '审批开票', {
          confirmButtonText: '确认通过',
          cancelButtonText: '我再想想',
          type: 'warning',
          center: true,
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.ruleForm.id = row.id
          this.ruleForm.invoice_status = 1
          this.ruleForm.approver_at = Math.floor((Number)(new Date()) / 1000)
          updateInvoice(this.ruleForm).then(res => {
            this.fetchInvoices(this.searchForm)
          })
          this.$message({ type: 'success', message: '审批成功!' })
          this.resetRuleForm()
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
          this.ruleForm.approver_at = Math.floor((Number)(new Date()) / 1000)
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
        getDepartments({ 'department_id': 53 }).then(res => {
          this.department = res.data._items[0]
        })
      },
      /** 表单处理 */
      resetSearchForm() {
        this.searchForm = Object.assign({}, defaultSearchForm)
      },
      resetRuleForm() {
        this.ruleForm = Object.assign({}, defaultRuleForm)
      },
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
      /** 格式化过滤类 */
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
      this.fetchInvoices(this.searchForm)
      this.fetchDepartment()
    },
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_pageInvoice#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
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
</style>
