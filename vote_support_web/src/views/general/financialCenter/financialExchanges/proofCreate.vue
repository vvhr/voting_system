<template>
  <div class="app-container">
    <!--头部-->
    <div class="header">
      <el-row>
        <el-col :span="1.5" style="margin-top: 6px;margin-bottom: 5px">
          <div class="tips">温馨提示</div>
        </el-col>
        <el-col :span="18" style="margin-top: 6px;margin-bottom: 5px">
          <div class="tips-text"><b>本页为财务部进行打款的页面!</b>
            当某报销单下的所有申请都被财务审批通过后,将生成一条凭证在本页面,出纳人只需要对凭证进行操作!
          </div>
        </el-col>
      </el-row>
      <!--搜索栏-->
      <el-row style="background-color: rgb(236, 243, 247);padding-left: 10px;padding-top: 10px;border-radius:10px 10px;">
        <el-col >
          <!--输入搜索-->
          <el-row>
            <el-form :inline="true" style="height: 40px;" ref="searchForm" :model="searchForm">
              <el-form-item label="条件筛选" prop="receipt_no" label-width="70px">
                <el-input @keyup.enter.native="onClickQuery" style="width: 160px;" size="small" v-model="searchForm.receipt_no" placeholder="报销单号"></el-input>
              </el-form-item>
              <el-form-item prop="proof_no" label-width="70px">
                <el-input @keyup.enter.native="onClickQuery" style="width: 160px;" size="small" v-model="searchForm.proof_no" placeholder="凭证编号"></el-input>
              </el-form-item>
              <el-form-item prop="bank_name" label-width="70px">
                <el-input @keyup.enter.native="onClickQuery" style="width: 160px;" size="small" v-model="searchForm.bank_name" placeholder="开户行"></el-input>
              </el-form-item>
              <el-form-item prop="status" label-width="70px">
                <el-select @keyup.enter.native="onClickQuery" size="small" style="width: 160px" v-model="searchForm.status" filterable placeholder="打款状态">
                  <el-option v-for="item in status" :key="item.id" :label="item.value" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="money_sum" label-width="70px">
                <el-input @keyup.enter.native="onClickQuery" style="width: 160px;" size="small" v-model="searchForm.money_sum" placeholder="总金额"></el-input>
              </el-form-item>
            </el-form>
          </el-row>
          <!--区间搜索-->
          <el-row>
            <el-form :inline="true" style="height: 40px;">
              <el-form-item label="生成时间" prop="create_at" label-width="70px">
                <el-date-picker
                  @keyup.enter.native="onClickQuery"
                  size="small"
                  style="width: 320px"
                  v-model="searchForm.create_at"
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
              <el-form-item label="打款时间" prop="payer_time" label-width="70px">
                <el-date-picker
                  @keyup.enter.native="onClickQuery"
                  size="small"
                  style="width: 320px"
                  v-model="searchForm.payer_time"
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
            </el-form>
          </el-row>
          <!--选择搜索-->
          <el-row>
            <el-form :inline="true" style="height: 40px;">
              <el-form-item label="选择搜索" prop="cost_user_id" >
                <el-select
                  @keyup.enter.native="onQuery"
                  size="small"
                  style="width: 120px"
                  v-model="searchForm.cost_user_id"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="报销人"
                  :remote-method="remoteUsers">
                  <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="input_user_id" >
                <el-select
                  @keyup.enter.native="onQuery"
                  size="small"
                  style="width: 120px"
                  v-model="searchForm.input_user_id"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="申请人"
                  :remote-method="remoteUsers">
                  <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-row>
          <!--查询 重置 按钮-->
          <el-row>
            <el-form :inline="true" style="height: 40px;margin-bottom: 10px">
              <el-form-item>
                <el-button @click="onClickQuery()" size="small" style="width: 200px" icon="el-icon-search" type="primary">查询(回车)</el-button>
                <el-button @click="onClickCleanQuery()" size="small" style="width: 200px" icon="el-icon-search" type="primary">重置</el-button>
                <el-button @click="onClickQueryNoBank()" size="small" icon="el-icon-search" type="primary">查看未填银行的凭证</el-button>
                <el-button @click="onClickQueryNoProof()" size="small" icon="el-icon-search" type="primary">查看未填凭证号的凭证</el-button>
                <el-button @click="onClickShowBanks()" size="small" style="width: 200px" icon="el-icon-search" type="success">银行管理</el-button>
              </el-form-item>
            </el-form>
          </el-row>
        </el-col>
      </el-row>
      <!--分页器-->
      <el-row style="margin-top: 5px">
        <el-col :span="12">
          <div class="">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageInfo.currentPage"
              :page-sizes="[10, 20, 50, 100, 200]"
              :page-size="pageInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageInfo.totalCount">
            </el-pagination>
          </div>
        </el-col>
        <el-col :span="10">
          <el-button @click="onClickCreateProofBatch1()" size="mini" style="width: 150px" icon="el-icon-refresh" type="">更新凭证(已打款)</el-button>
          <el-button @click="onClickCreateProofBatch2()" size="mini" style="width: 150px" icon="el-icon-refresh" type="">更新凭证(待打款)</el-button>
          <el-button @click="onClickUpdateAllApplications()" size="mini" style="width: 80px" icon="el-icon-refresh" type="">修正</el-button>
          <el-button @click="onClickUpdateCostUserAndInputUser()" size="mini" style="width: 80px" icon="el-icon-refresh" type="">关联</el-button>
          <!--<el-button @click="onClickCheckMistake()" size="mini" style="width: 150px" icon="el-icon-refresh" type="">检查错误项</el-button>-->
        </el-col>
      </el-row>
    </div>
    <!--表格部分-->
    <div class="my-table-applyAll" >
      <el-table v-loading="loading" border :data="proofs" id="apply-proofs" :row-style="rowStyle" :cell-style="cellStyle" fit @sort-change="handleSortChange">
        <el-table-column align="center" prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="receipt_no" label="报销单号" width="200"></el-table-column>
        <el-table-column prop="proof_no" label="凭证编号" width="150" v-if="viewAccessCheck"></el-table-column>
        <el-table-column align="center" label="处理状态" width="100">
          <template slot-scope="scope">
            <el-tag class="tag" size="mini" :type="scope.row.status | TagStatusFilter">{{scope.row.status | StatusFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="costApplys[0].cost_user_name" label="报销人" width="100"></el-table-column>
        <el-table-column align="center" prop="costApplys[0].input_user_name" label="申请人" width="100"></el-table-column>
        <el-table-column align="right" prop="money_sum" label="金额总计" width="120"></el-table-column>
        <el-table-column prop="create_at" label="生成时间" sortable="custom" width="170" :formatter="dateFormat"></el-table-column>
        <el-table-column prop="payer_time" label="打款时间" sortable="custom" width="170" :formatter="dateFormat"></el-table-column>
        <el-table-column prop="comment" label="打款备注" width="250"></el-table-column>
        <el-table-column align="center" fixed="left" label="查看明细" width="80">
          <template slot-scope="scope">
            <el-popover trigger="click" placement="top">
              <el-row>
                <el-col :span="8" style="margin-bottom: 50px;margin-right: 50px">
                  <el-table v-loading="loadingDetail" :data="subjects_sum" stripe fit border style="width: 100%" :row-style="rowStyle" :cell-style="cellStyle" show-summary>
                    <el-table-column prop="name" label="面单科目"></el-table-column>
                    <el-table-column prop="sum" label="金额汇总" width="200"></el-table-column>
                  </el-table>
                </el-col>
                <el-col :span="8">
                  <div class="bank-info">
                    <div style="text-align: center;">
                      <p><a style="color: #1e6abc;font-size: large"> - 打款信息 - </a></p>
                    </div>
                    <div style="padding-left: 30px" v-if="viewAccessCheck">
                      <b>单位名称</b> &emsp; {{scope.row.company_name===null?'暂无':scope.row.company_name}}<br />
                      <b>开户银行</b> &emsp; {{scope.row.bank_name}}<br />
                      <b>开户账号</b> &emsp; {{scope.row.bank_account}}
                    </div>
                    <div style="text-align: center;" v-else>抱歉,您无法查看银行信息!</div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-table v-loading="loadingDetail" :data="applications" stripe style="width: 100%" :row-style="rowStyle" :cell-style="cellStyle">
                  <el-table-column prop="id" label="ID" ></el-table-column>
                  <el-table-column prop="date" label="日期" width="120" :formatter="dateFormat_short"></el-table-column>
                  <!--<el-table-column prop="proof_no" label="凭证号" width="150"></el-table-column>-->
                  <el-table-column prop="cost_user_name" label="报销人" width="150"></el-table-column>
                  <el-table-column prop="sbj_name" label="面单科目" width="200"></el-table-column>
                  <el-table-column prop="sbjR_name" label="佣金" width="200"></el-table-column>
                  <el-table-column prop="money" label="金额" width="120"></el-table-column>
                  <el-table-column  show-overflow-tooltip label="用途" width="300">
                    <template slot-scope="scope">
                      <el-button v-clipboard:copy="scope.row.use" v-clipboard:success="onCopy" type="text">复制</el-button>
                      {{scope.row.use}}
                    </template>
                  </el-table-column>
                  <el-table-column label="生效ID" width="80">
                    <template slot-scope="scope">
                      {{scope.row.financialStatus === 3?'撤'+ scope.row.cost_id:scope.row.cost_id}}
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
              <div slot="reference" class="name-wrapper">
                <el-button size="mini" type="primary" icon="el-icon-search" @click="onClickDetail(scope.row.receipt_no)" ></el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" width="230" fixed="left" label="操作栏" v-if="operateAccessCheck">
          <template slot-scope="scope">
            <el-button-group>
              <el-button @click="onClickEdit(scope.row)" type="primary" icon="el-icon-edit" size="mini" :disabled="editDisabledFilter(scope.row)"></el-button>
              <el-button @click="onClickPay(scope.row)" type="success" icon="el-icon-check" size="mini" :disabled="payDisabledFilter(scope.row)"></el-button>
              <el-button @click="onClickRepay(scope.row)" type="warning" size="mini" :disabled="repayDisabledFilter(scope.row)">抵</el-button>
              <el-button @click="onClickRefuse(scope.row)" type="danger" icon="el-icon-close" size="mini" :disabled="refuseDisabledFilter(scope.row)"></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--表单部分-->
    <el-dialog title="修改凭证信息" :visible.sync="visible.ruleForm" style="width: 1100px">
      <el-form :model="ruleForm" label-width="100px" size="mini">
        <el-form-item label="打款时间">
          <el-date-picker
            value-format="timestamp"
            v-model="ruleForm.payer_time"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="银行选择">
          <el-autocomplete
            style="width: 250px"
            popper-class="my-autocomplete-bank"
            v-model="bank_value"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="handleSelect">
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
              <span class="addr">{{ item.company_name }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="银行账号">
          <el-input style="width: 250px" v-model="ruleForm.bank_account" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="单位名称">
          <el-input style="width: 250px" v-model="ruleForm.company_name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="凭证编号">
          <el-input style="width: 150px" v-model="ruleForm.proof_no"></el-input>
          <el-button type="primary" @click="onClickCreateProofNo()"> 生成</el-button>
        </el-form-item>
        <el-form-item label="打款备注">
          <el-input style="width: 250px" v-model="ruleForm.comment"></el-input>
        </el-form-item>
        <el-form-item label="操作">
        <el-button type="primary" @click="submitForm('ruleForm')">确定修改</el-button>
        <el-button @click="visible.ruleForm = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="抵消借款" :visible.sync="visible.repayForm">
      <el-form :model="repayForm" label-width="150px" size="mini">
        提示:抵消借款后,凭证状态将变为 已抵消,该凭证下的报销申请仍然会生成报销记录,但是凭证不会生成银行流水!
        <el-form-item label="还款时间" prop="date">
          <el-date-picker
            value-format="timestamp"
            v-model="repayForm.date"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="还款人">
          <el-input style="width: 250px" v-model="repayForm.repay_user_name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="还款类型" prop="subject_id">
          <el-select v-model="repayForm.subject_id" filterable placeholder="请选择还款科目" @change="currentSubjectChange(repayForm.subject_id)">
            <el-option v-for="type in repaySubjects" :key="type.id" :label="type.name" :value="type.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="已借总额">
          <span style="float: left;color: #8492a6;" v-if="currentSubjectId === 5"> 已借{{ receivable_user.loan_money }} </span>
          <span style="float: left;color: #8492a6;" v-else-if="currentSubjectId === 6"> 已借{{ receivable_user.loan_money }} </span>
          <span style="float: left;color: #8492a6;" v-else-if="currentSubjectId === 33"> 已借{{ receivable_user.earnest_money }} </span>
          <span style="float: left;color: #8492a6;" v-else-if="currentSubjectId === 52"> 已借{{ receivable_user.deposit_money }} </span>
          <span style="float: left;color: red;" v-else> 请选择还款类型 </span>
        </el-form-item>
        <el-form-item label="剩余待还">
          <span style="color: #8492a6;" v-if="currentSubjectId === 5"> 待还{{ SUTools(receivable_user.loan_money, receivable_user.loan_repaid)}}</span>
          <span style="color: #8492a6;" v-else-if="currentSubjectId === 6"> 待还{{ SUTools(receivable_user.loan_money, receivable_user.loan_repaid)}}</span>
          <span style="color: #8492a6;" v-else-if="currentSubjectId === 33"> 待还{{ SUTools(receivable_user.earnest_money, receivable_user.earnest_repaid)}}</span>
          <span style="color: #8492a6;" v-else-if="currentSubjectId === 52"> 待还{{ SUTools(receivable_user.deposit_money, receivable_user.deposit_repaid) }}</span>
          <span style="float: left;color: red;" v-else> 请选择还款类型 </span>
        </el-form-item>
        <el-form-item label="本次还款金额">
          <el-input style="width: 250px" v-model="repayForm.repayment_money" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="本次备注">
          <el-input style="width: 300px" v-model="repayForm.note"></el-input>
        </el-form-item>
        <el-form-item label="操作">
          <el-button type="primary" @click="submitRepayForm('repayForm')">确 定</el-button>
          <el-button @click="visible.repayForm = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_Financial_pageProofCreate   beforeMount()
-->
<script>
  import { parseTime } from '../../../../utils/index'
  import { getMax, getProof, updateProof, payProof, refuseProof, repayProof, createProofBatch1, createProofBatch2, updateApplicationsOfAll, updateCostUserAndInputUser } from '../../../../api/proof'
  import { getApply_ } from '../../../../api/costApply'
  import { getReceivables } from '../../../../api/receivable'
  import { getBanks } from '../../../../api/bank'
  import { getUsers } from '../../../../api/user'

  const defaultRepayForm = {
    proof_id: null,
    date: Date.parse(new Date()), // 还款日期
    subject_id: null, // 还款科目
    note: null, // 备注
    repay_user_id: null,
    repay_user_name: null,
    repayment_money: null
  }
  export default {
    name: 'proofCreate',
    data() {
      return {
        proofs: [],
        users: [],
        applications: [],
        receivable_user: {
          loan_money: 0,
          earnest_money: 0,
          deposit_money: 0,
          loan_repaid: 0,
          earnest_repaid: 0,
          deposit_repaid: 0
        },
        loading: false,
        loadingDetail: false,
        showHighLight: true,
        visible: {
          ruleForm: false,
          repayForm: false
        },
        currentSubjectId: null, // 当前还款科目
        bank_value: null,
        ruleForm: {
          proof_no: null,
          bank_name: null,
          bank_account: null,
          company_name: null,
          payer_time: null,
          comment: null
        },
        repayForm: Object.assign({}, defaultRepayForm),
        repaySubjects: [
          { id: 5, name: '工人借款' },
          { id: 6, name: '职员借款' },
          { id: 33, name: '投标保证金' },
          { id: 52, name: '押金' }
        ],
        proof: {
          proof_year: null,
          proof_month: null,
          proof_prefix: null
        },
        banks: [],
        money_sum: 0,
        subjects_sum: [],
        // 分页类
        pageInfo: {
          currentPage: 1,
          pageSize: 20,
          totalCount: 0
        },
        searchForm: {
          payer_time: null,
          create_at: null,
          proof_no: null,
          receipt_no: null,
          bank_name: null,
          status: null,
          sort: null,
          sort_name: null,
          create_start_at: null,
          create_end_at: null,
          payer_start_at: null,
          payer_end_at: null,
          money_sum: null,
          cost_user_id: null,
          input_user_id: null
        },
        status: [
          { id: null, value: '全部' },
          { id: 1, value: '待打款' },
          { id: 2, value: '已打款' },
          { id: 3, value: '已异常' },
          { id: 4, value: '已抵借' }
        ],
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
        }
      }
    },
    filters: {
      dateFormat_short(value) {
        const date = value
        if (date === null) {
          return '暂无'
        } else return parseTime(date, '{y}-{m}-{d}')
      }, // 时间格式化
      /**
       * @return {string}
       */
      StatusFilter: function(value) {
        if (value === 1) {
          return '待打款'
        }
        if (value === 2) {
          return '已打款'
        }
        if (value === 3) {
          return '异常打款'
        }
        if (value === 4) {
          return '已抵借'
        }
      }, // 财务审批状态过滤器
      TagStatusFilter(status) {
        const statusMap = {
          1: 'warning',
          2: 'success',
          3: 'danger',
          4: 'info'
        }
        return statusMap[status]
      } // 财务审批状态tag标签过滤器
    },
    methods: {
      /** 点击事件类 */
      onClickQuery() {
        this.loading = true
        getProof(this.finalSearchForm).then(res => {
          this.proofs = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      },
      onClickCleanQuery() {
        this.searchForm = {
          payer_time: null,
          create_at: null,
          proof_no: null,
          receipt_no: null,
          bank_name: null,
          status: null,
          sort: null,
          sort_name: null,
          create_start_at: null,
          create_end_at: null,
          payer_start_at: null,
          payer_end_at: null,
          money_sum: null,
          cost_user_id: null,
          input_user_id: null
        }
        this.onClickQuery()
      },
      onClickQueryNoBank() {
        this.loading = true
        this.searchForm.proof_no = null
        this.searchForm.bank_name = ''
        getProof(this.finalSearchForm).then(res => {
          this.proofs = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      },
      onClickQueryNoProof() {
        this.loading = true
        this.searchForm.bank_name = null
        this.searchForm.proof_no = ''
        getProof(this.finalSearchForm).then(res => {
          this.proofs = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      },
      onClickDetail(receipt_no) {
        this.fetchApply({ 'receipt_no': receipt_no })
      },
      onClickEdit(row) {
        this.proof.proof_year = null
        this.proof.proof_month = null
        this.proof.proof_prefix = null
        this.ruleForm.id = row.id
        this.ruleForm = Object.assign({}, row)
        this.bank_value = this.ruleForm.bank_name
        if (this.ruleForm.payer_time === null) {
          this.ruleForm.payer_time = new Date()
        } else this.ruleForm.payer_time = this.ruleForm.payer_time * 1000
        this.proof.proof_year = parseTime(this.ruleForm.payer_time, '{y}').substr(2, 2)
        this.proof.proof_month = parseTime(this.ruleForm.payer_time, '{m}')
        this.visible.ruleForm = true
      }, // 编辑
      onClickPay(row) {
        this.$confirm('<a style="color: #3a8ee6">是否确认已打款</a>?</a>', '确认打款操作', {
          confirmButtonText: '确认已打款',
          cancelButtonText: '我再想想',
          type: 'warning',
          center: true,
          dangerouslyUseHTMLString: true
        }).then(() => {
          payProof({ 'receipt_no': row.receipt_no }).then(res => {
            if (res.data.bCode === 101) {
              this.fetchProofs(this.finalSearchForm)
              this.$notify({
                title: '成功',
                message: '打款成功',
                type: 'success',
                position: 'top-right'
              })
            } else if (res.data.bCode === 102) {
              this.$notify({
                title: '打款失败',
                message: '原因:' + res.date.bDate,
                type: 'error',
                position: 'top-right'
              })
            }
            this.fetchProofs(this.finalSearchForm)
          })
          this.resetForm()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
          this.resetForm()
        })
      }, // 打款
      onClickRefuse(row) {
        this.$prompt('是否确认将该报销单为<a style="color: darkred">异常</a>状态? 异常后将无法再恢复!<br /><a style="color: darkred">您需要通知申请人修正异常后重新发起申请!<br />请您在下方备注栏填写异常原因!</a>', '打款异常操作', {
          inputPlaceholder: '请填写异常原因',
          confirmButtonText: '确认异常',
          cancelButtonText: '我再想想',
          type: 'warning',
          center: true,
          dangerouslyUseHTMLString: true,
          inputValue: row.comment
        }).then(({ value }) => {
          this.ruleForm.comment = value
          this.ruleForm.status = 3
          this.ruleForm.id = row.id
          this.ruleForm.receipt_no = row.receipt_no
          refuseProof(this.ruleForm).then(res => {
            this.fetchProofs(this.finalSearchForm)
            this.$message({
              type: 'success',
              message: '已修改为异常状态!'
            })
            this.resetForm()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
          this.resetForm()
        })
      }, // 异常拒绝
      onClickCreateProofNo() {
        if (this.proof.proof_year === null) {
          return this.$message.error('错误提示: 请您选择打款时间才能生成编号!!')
        }
        if (this.proof.proof_prefix === null) {
          return this.$message.error('错误提示: 请您重新选择一次银行才能生成编号!!')
        }
        getMax({ 'proof_prefix': this.proof.proof_prefix }).then(res => {
          const max = res.data
          const proof_number = this.FillZero((max + 1).toString())
          const proof_no = this.proof.proof_prefix + proof_number
          this.ruleForm.proof_no = proof_no.toString()
        })
      }, // 生成凭证号
      onClickCreateProofBatch1() {
        if (this.operateAccessCheck === false) return this.$message({ type: 'warning', message: '该操作仅供出纳和管理员使用!' })
        this.loading = true
        createProofBatch1().then(res => {
          this.fetchProofs()
          this.$notify({
            title: '更新完毕',
            message: '更新条数：' + res.data.number,
            type: 'success',
            position: 'top-right'
          })
          this.loading = false
        })
      }, // 检索未正常自动生成凭证的待打款申请并生成凭证
      onClickCreateProofBatch2() {
        if (this.operateAccessCheck === false) return this.$message({ type: 'warning', message: '该操作仅供出纳和管理员使用!' })
        this.loading = true
        createProofBatch2().then(res => {
          this.fetchProofs()
          this.$notify({
            title: '更新完毕',
            message: '更新条数：' + res.data.number,
            type: 'success',
            position: 'top-right'
          })
          this.loading = false
        })
      }, // 检索未正常自动生成凭证的已打款申请并生成凭证
      onClickUpdateAllApplications() {
        if (this.$store.getters.userId === 33) {
          updateApplicationsOfAll().then(res => {
            this.$notify({
              title: '修正完毕',
              message: '检查凭证:' + res.data.update_proofs + ' , 修正凭证号：' + res.data.update_applications_proofNo + ' , 修正时间：' + res.data.update_applications_payerTime,
              type: 'success',
              position: 'top-right'
            })
          })
        } else {
          this.$message({ type: 'warning', message: '该操作仅供管理员使用!' })
        }
      }, // 更新所有凭证下的申请的凭证号和打款时间
      onClickUpdateCostUserAndInputUser() {
        if (this.$store.getters.userId === 33) {
          updateCostUserAndInputUser().then(res => {
            this.$notify({
              title: '关联完毕',
              message: '关联数量:' + res.data,
              type: 'success',
              position: 'top-right'
            })
          })
        } else {
          this.$message({ type: 'warning', message: '该操作仅供管理员使用!' })
        }
      }, // 更新所有凭证的报销人和申请人
      onClickCheckMistake() {
        console.log('检查错误项,暂未完成')
      },
      // 抵借款按钮,弹出还款窗口
      onClickRepay(row) {
        this.repayForm.proof_id = row.id
        this.repayForm.repay_user_id = row.costApplys[0].cost_user_id
        this.repayForm.repay_user_name = row.costApplys[0].cost_user_name
        this.repayForm.repayment_money = row.money_sum
        getReceivables({ user_name: this.repayForm.repay_user_name }).then(res => {
          if (res.data._items.length === 0) {
            this.$message({ type: 'error', message: '此人暂无借款,无法抵借支' })
          } else {
            this.receivable_user.loan_money = res.data._items[0].loan_money
            this.receivable_user.loan_repaid = res.data._items[0].loan_repaid
            this.receivable_user.earnest_money = res.data._items[0].earnest_money
            this.receivable_user.earnest_repaid = res.data._items[0].earnest_repaid
            this.receivable_user.deposit_money = res.data._items[0].deposit_money
            this.receivable_user.deposit_repaid = res.data._items[0].deposit_repaid
            this.visible.repayForm = true
          }
        })
      }, // 抵借
      onClickShowBanks() {
        // 跳转到银行管理页面
        this.$router.push({ name: 'banksManage' })
      },
      onCopy() {
        this.$message({
          message: '已复制',
          type: 'success'
        })
      },
      /** 接口获取类 */
      fetchProofs(params) {
        this.loading = true
        getProof(params).then(res => {
          this.proofs = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      },
      fetchApply(params) {
        this.loadingDetail = true
        getApply_(params).then(res => {
          this.applications = res.data._items
          this.subjectsSum(this.applications)
          this.loadingDetail = false
        })
      }, // 获取所有申请记录
      loadBanks() {
        getBanks({ valid: 1 }).then(res => {
          this.banks = res.data._items
        })
      },
      /** 格式化过滤类 */
      dateFormat_short(row, column) {
        const date = row[column.property]
        if (date === null) {
          return '暂无'
        } else return parseTime(date, '{y}-{m}-{d}')
      }, // 时间格式化
      dateFormat(row, column) {
        const date = row[column.property]
        if (date === null) {
          return '暂无'
        } else return parseTime(date, '{y}-{m}-{d} {h}:{i}:{s}')
      }, // 时间格式化
      payDisabledFilter(row) {
        // 财务出纳人 username:吴金娟 id:145
        return !(row.status === 1 && this.operateAccessCheck)
      }, // 禁止属性过滤器
      editDisabledFilter(row) {
        // 财务出纳人 username:吴金娟 id:145
        return !(this.operateAccessCheck)
      }, // 禁止属性过滤器
      refuseDisabledFilter(row) {
        // 财务出纳人 username:吴金娟 id:145
        return !(row.status !== 4 && this.operateAccessCheck)
      }, // 禁止属性过滤器
      repayDisabledFilter(row) {
        // 财务出纳人 username:吴金娟 id:145
        return !(row.status === 1 && this.operateAccessCheck)
      },
      currentSubjectChange(valId) {
        this.currentSubjectId = valId
      },
      /** -------- 表格样式类 -------- */
      rowStyle({ row, rowIndex }) {
        return 'height: 25px'
      },
      cellStyle({ row, column, rowIndex, columnIndex }) {
        return 'padding: 2px'
      },
      /** 处理器类 */
      handleSelect(item) {
        this.ruleForm.bank_name = item.bank_name
        this.ruleForm.bank_account = item.bank_account
        this.ruleForm.company_name = item.company_name
        this.proof.proof_year = parseTime(this.ruleForm.payer_time, '{y}').substr(2, 2)
        this.proof.proof_month = parseTime(this.ruleForm.payer_time, '{m}')
        this.proof.proof_prefix = item.proof_1 + '-' + item.proof_2 + this.proof.proof_year + this.proof.proof_month
      },
      /** 表格数据类 */
      querySearch(queryString, cb) {
        let queryString_ = queryString
        if (queryString_ === 'hx' || queryString_ === 'HX') queryString_ = '华夏'
        if (queryString_ === 'ba' || queryString_ === 'BA') queryString_ = '宝安'
        if (queryString_ === 'zx' || queryString_ === 'ZX') queryString_ = '振兴'
        if (queryString_ === 'yn' || queryString_ === 'YN') queryString_ = '渔农'
        if (queryString_ === 'js' || queryString_ === 'JS') queryString_ = '江苏'
        if (queryString_ === 'ml' || queryString_ === 'ML') queryString_ = '梅龙'
        if (queryString_ === 'pa' || queryString_ === 'PA') queryString_ = '平安'
        if (queryString_ === 'xc' || queryString_ === 'XC') queryString_ = '新城'
        if (queryString_ === 'lh' || queryString_ === 'LH') queryString_ = '龙华'
        if (queryString_ === 't' || queryString_ === 'T') queryString_ = '中国建设银行深圳坂田支行'
        if (queryString_ === 'bt' || queryString_ === 'BT') queryString_ = '坂田'
        const banks = this.banks
        const results = queryString_ ? banks.filter(this.createFilter(queryString_)) : banks
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter(queryString) {
        return (banks) => {
          return (banks.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
        }
      },
      /**
       * @return {string}
       * 将3转化为003
       */
      FillZero(p) {
        return new Array(3 - (p + '').length + 1).join('0') + p
      },
      /**
       * @return {string}
       * 求差补零工具
       */
      SUTools(a, b) {
        return (((Number(a) * 100) - (Number(b) * 100)) / 100).toFixed(2)
      },
      /** 归类算法 */
      subjectsSum(res) {
        // 新科目汇总数据源数组
        this.subjects_sum = []
        // 递归方法填充数据源数组
        this.recursive(res, 0, 0)
        // console.log('循环结束,输出数组=', this.subjects_sum)
      },
      recursive(res, x, y) {
        // res: 初始数据源数组 x: 当前对象索引值 y: 被比较的对象索引值
        if (x < res.length && y < res.length) {
          let exist = false
          // 判断当前的科目类型是否已经存在于新数组中,不存在则比较,存在则不比较,进行下一轮递归
          for (let i = 0; i < this.subjects_sum.length; i++) {
            if (this.subjects_sum[i].name === res[x].sbj_name) {
              exist = true
              break
            }
          }
          // 科目类型不存在,则需要将包含 当前科目类型 和 当前类型的总金额 的对象插入到新数组中
          if (exist === false) {
            // 如果被比较的对象不是最后一个,且被比较的不是自己,且被比较的科目类型名称相同,则合计金额
            if (y < res.length - 1) {
              if (x !== y) {
                if (res[x].sbj_name === res[y].sbj_name) {
                  // this.money_sum = Number(this.money_sum) + Number(res[y].money)
                  this.money_sum = parseFloat((Number(this.money_sum) * 100 + Number(res[y].money) * 100) / 100).toFixed(2)
                  this.recursive(res, x, y + 1)
                } else this.recursive(res, x, y + 1)
              } else this.recursive(res, x, y + 1)
            } else if (y === res.length - 1) {
              // 如果被比较的对象是最后一个,那么合计金额
              if (x !== y && res[x].sbj_name === res[y].sbj_name) {
                // this.money_sum = Number(this.money_sum) + Number(res[y].money)
                this.money_sum = parseFloat((Number(this.money_sum) * 100 + Number(res[y].money) * 100) / 100).toFixed(2)
              }
              // 如果被比较的对象是最后一个,那么将对象插入新数组中,当前对象索引值+1(即x+1),跳转到下一次递归.
              const sum = parseFloat((Number(this.money_sum) * 100 + Number(res[x].money) * 100) / 100).toFixed(2)
              const object = { 'name': res[x].sbj_name, 'sum': sum }
              // 将对象插入新数组中
              this.subjects_sum.push(object)
              this.money_sum = 0
              // 跳转到下一轮递归进行比较
              this.recursive(res, x + 1, 0)
            }
          } else this.recursive(res, x + 1, 0) // 当前科目类型存在,则直接跳转到下一轮递归
        }
      },
      /** 分页器方法 */
      handleSizeChange(pageSize) {
        this.loading = true
        this.pageInfo.pageSize = pageSize
        getProof(this.finalSearchForm).then(res => {
          this.proofs = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      },
      handleCurrentChange(currentPage) {
        this.loading = true
        this.pageInfo.currentPage = currentPage
        getProof(this.finalSearchForm).then(res => {
          this.proofs = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      },
      /** 排序 */
      handleSortChange({ column, prop, order }) {
        this.searchForm.sort_name = prop
        if (order === 'ascending') {
          this.searchForm.sort = 4
        } else if (order === 'descending') {
          this.searchForm.sort = 3
        }
        this.onClickQuery()
      },
      /** 表单提交类 */
      submitForm(formName) {
        this.ruleForm.bank_name = this.bank_value
        this.ruleForm.payer_time = Math.floor(this.ruleForm.payer_time / 1000)
        updateProof(this.ruleForm).then(res => {
          if (res.data.bCode === 101) {
            this.$notify({ title: '成功', message: '修改凭证信息成功!', type: 'success', position: 'top-right' })
            this.fetchProofs(this.finalSearchForm)
          } else {
            for (const key in res.data.bData) {
              this.$notify({ title: '警告', message: res.data.bData[key], type: 'warning', position: 'top-right' })
            }
          }
          this.resetForm()
          this.visible.ruleForm = false
        })
      },
      submitRepayForm(formName) {
        if ((this.repayForm.date).toString().length === 13) {
          this.repayForm.date = this.repayForm.date / 1000
        }
        if (this.repayForm.subject_id === null) {
          return this.$notify({ title: '抵借操作失败', message: '您未选择抵借科目!', type: 'warning', position: 'top-right' })
        }
        repayProof(this.repayForm).then(res => {
          if (res.data.bCode === 101) {
            this.$notify({ title: '成功', message: '抵借成功!', type: 'success', position: 'top-right' })
            this.fetchProofs(this.finalSearchForm)
          } else {
            for (const key in res.data.bData) {
              this.$notify({ title: '警告', message: res.data.bData[key], type: 'warning', position: 'top-right' })
            }
          }
          this.repayForm = Object.assign({}, defaultRepayForm)
          this.visible.repayForm = false
        })
      },
      resetForm() {
        this.ruleForm = {
          proof_no: null,
          bank_name: null,
          bank_account: null,
          company_name: null,
          payer_time: null
        }
      },
      /** 远程搜索类 */
      remoteUsers(query) {
        let params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getUsers(params).then(res => {
          this.users = res.data._items
        })
      } // 远程搜索用户
    },
    mounted() {
      this.fetchProofs()
      this.loadBanks()
    },
    computed: {
      finalSearchForm() {
        if (this.searchForm.create_at !== null) {
          this.searchForm.create_start_at = this.searchForm.create_at[0]
          this.searchForm.create_end_at = this.searchForm.create_at[1]
        }
        if (this.searchForm.payer_time !== null) {
          this.searchForm.payer_start_at = this.searchForm.payer_time[0]
          this.searchForm.payer_end_at = this.searchForm.payer_time[1]
        }
        const res = Object.assign({}, this.searchForm)
        res.pageSize = this.pageInfo.pageSize
        res.page = this.pageInfo.currentPage
        return res
      },
      /** 特殊权限检查 */
      viewAccessCheck() {
        // 仅吴金娟/陈莉/唐总/系统管理员可视
        return this.$store.getters.userId === 145 || this.$store.getters.userId === 80 || this.$store.getters.userId === 45 || this.$store.getters.userId === 33
      },
      operateAccessCheck() {
        // 仅吴金娟/系统管理员可操作
        return this.$store.getters.userId === 145 || this.$store.getters.userId === 33
      }
    },
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_Financial_pageProofCreate#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style scoped>
  .app-container{
    padding-left: 0;
    padding-right: 0;
    padding-top: 0
  }
  .tips {
    color: #fff;
    font-size: small;
    font-family: Microsoft YaHei,serif;
    border-radius: 5px 5px 5px 5px;
    padding: 5px 10px;
    height: 25px;
    width: 72px;
    background-color: #55c51c;
  }
  .tips-text {
    color: #555c66;
    font-size: small;
    font-family: Microsoft YaHei,serif;
    padding: 5px;
  }
  .header{
    margin-bottom: 5px;
    padding: 10px 10px 10px 10px;
    background-color: #ffffff;
    height: 40px;
  }
  .my-table-applyAll{
    margin-left: 10px;
  }
  .name {
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: normal;
    padding: 3px;
  }
  .addr {
    font-size: 12px;
    color: red;
    line-height: normal;
    padding: 3px;
  }
  .bank-info {
    /*待美化*/
    background-color: #d9ecff;
    border-radius: 5px 5px 5px 5px;
    padding: 10px;
  }
  .pagination{
    color: #000;
    margin-top: 5px;
  }
</style>
<style>
  .my-table-applyAll .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
    border-right: 2px solid #ebeef5!important;
  }
  .my-table-applyAll .el-table td, .el-table th.is-leaf {
    border-bottom: 2px solid #ebeef5!important;
  }
  .my-table-applyAll .el-table__expanded-cell[class*=cell] {
    padding: 10px 10px 10px 50px!important;
    background-color: floralwhite!important;
  }
  .my-table-applyAll .el-table__expand-icon {
    color: #fff!important;
  }
  .my-autocomplete-bank li{
    background-color: #def6ff;
    margin-top: 8px;
    margin-bottom: 8px;
    padding-left: 5px;
    padding-right: 5px;
  }
</style>
