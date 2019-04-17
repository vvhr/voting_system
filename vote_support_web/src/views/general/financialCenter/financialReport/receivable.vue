<template>
  <div class="app-container">
    <div>
      <el-button size="small" @click="onClickFreshMoney()" icon="el-icon-refresh">刷新已收金额</el-button>
      <el-button type="primary" size="small" @click="onClickCreateLoan()" icon="el-icon-plus">创建应收账款</el-button>
      <el-tabs type="border-card" style="margin-top: 10px">
        <el-tab-pane label="职员借款">
          <!--分页器-->
          <div class="block" align="center">
            <el-pagination
              @size-change="handleSizeChange_1"
              @current-change="handleCurrentChange_1"
              :current-page="searchForm_1.page"
              :page-sizes="[20, 50, 100]"
              :page-size="searchForm_1.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="searchForm_1.totalCount">
            </el-pagination>
          </div>
          <el-table :data="receivables.tab_1" :row-style="rowStyle" :cell-style="cellStyle" stripe fit >
            <el-table-column align="center" prop="user_name" label="发生人" width="120"></el-table-column>
            <el-table-column align="right" prop="loan_money" label="借款总额" width="150">
              <template slot-scope="scope"><el-row>{{scope.row.loan_money}}</el-row></template>
            </el-table-column>
            <el-table-column align="left" label="" width="70">
              <template slot-scope="scope"><el-button @click="onClickShowLoan(scope.row, 2)" size="mini" style="padding: 4px" type="text" icon="el-icon-search">查看</el-button></template>
            </el-table-column>
            <el-table-column align="right" prop="loan_repaid" label="已还总额" width="150" >
              <template slot-scope="scope"><el-row>{{scope.row.loan_repaid}}</el-row></template>
            </el-table-column>
            <el-table-column align="left" label="" width="70">
              <template slot-scope="scope"><el-button @click="onClickShowRepayment(scope.row, 5)" size="mini" style="padding: 4px" type="text" icon="el-icon-search">查看</el-button></template>
            </el-table-column>
            <el-table-column align="right" label="待还总额" width="150">
              <template slot-scope="scope"><el-row><a style="color: #f56c6c">{{SUTools(scope.row.loan_money, scope.row.loan_repaid)}}</a></el-row></template>
            </el-table-column>
            <el-table-column align="left" label="" width="150">
              <template slot-scope="scope">
                <el-button size="mini" type="text"
                           v-if="Number(scope.row.loan_money) < Number(scope.row.loan_repaid) && operateAccessCheck"
                           @click="onClickCreateOverage(scope.row, 6)" icon="el-icon-plus">超出现金结算</el-button>
              </template>
            </el-table-column>
            <el-table-column align="left" label="现金结算" width="100">
              <template slot-scope="scope"><el-button @click="onClickShowOverage(scope.row, 5)" size="mini" style="padding: 4px" type="text" icon="el-icon-search">查看</el-button></template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
              <template slot-scope="scope"><el-button @click="onClickCreateRepayment(scope.row)" size="mini" style="padding: 4px" type="primary" icon="el-icon-plus" v-if="operateAccessCheck">录入还款</el-button></template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="投标保证金">
          <!--分页器-->
          <div class="block" align="center">
            <el-pagination
              @size-change="handleSizeChange_2"
              @current-change="handleCurrentChange_2"
              :current-page="searchForm_2.page"
              :page-sizes="[20, 50, 100]"
              :page-size="searchForm_2.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="searchForm_2.totalCount">
            </el-pagination>
          </div>
          <el-table :data="receivables.tab_2" :row-style="rowStyle" :cell-style="cellStyle" stripe fit >
            <el-table-column align="center" prop="user_name" label="发生人" width="120"></el-table-column>
            <el-table-column align="right" prop="earnest_money" label="借款总额" width="150">
              <template slot-scope="scope"><el-row>{{scope.row.earnest_money}}</el-row></template>
            </el-table-column>
            <el-table-column align="left" label="" width="70">
              <template slot-scope="scope"><el-button @click="onClickShowLoan(scope.row, 3)" size="mini" style="padding: 4px" type="text" icon="el-icon-search">查看</el-button></template>
            </el-table-column>
            <el-table-column align="right" prop="earnest_repaid" label="已还总额" width="150" >
              <template slot-scope="scope"><el-row>{{scope.row.earnest_repaid}}</el-row></template>
            </el-table-column>
            <el-table-column align="left" label="" width="70">
              <template slot-scope="scope"><el-button @click="onClickShowRepayment(scope.row, 33)" size="mini" style="padding: 4px" type="text" icon="el-icon-search">查看</el-button></template>
            </el-table-column>
            <el-table-column align="right" label="待还总额" width="150">
              <template slot-scope="scope"><el-row><a style="color: #f56c6c">{{SUTools(scope.row.earnest_money, scope.row.earnest_repaid)}}</a></el-row></template>
            </el-table-column>
            <el-table-column align="left" label="" width="150">
              <template slot-scope="scope">
                <el-button size="mini" type="text"
                           v-if="Number(scope.row.earnest_money) < Number(scope.row.earnest_repaid) && operateAccessCheck"
                           @click="onClickCreateOverage(scope.row, 33)" icon="el-icon-plus">超出现金结算</el-button>
              </template>
            </el-table-column>
            <el-table-column align="left" label="现金结算" width="100">
              <template slot-scope="scope"><el-button @click="onClickShowOverage(scope.row, 33)" size="mini" style="padding: 4px" type="text" icon="el-icon-search">查看</el-button></template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
              <template slot-scope="scope"><el-button @click="onClickCreateRepayment(scope.row)" size="mini" style="padding: 4px" type="primary" icon="el-icon-plus" v-if="operateAccessCheck">录入还款</el-button></template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="押金">
          <!--分页器-->
          <div class="block" align="center">
            <el-pagination
              @size-change="handleSizeChange_3"
              @current-change="handleCurrentChange_3"
              :current-page="searchForm_3.page"
              :page-sizes="[20, 50, 100]"
              :page-size="searchForm_3.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="searchForm_3.totalCount">
            </el-pagination>
          </div>
          <el-table :data="receivables.tab_3" :row-style="rowStyle" :cell-style="cellStyle" stripe fit >
            <el-table-column align="center" prop="user_name" label="发生人" width="120"></el-table-column>
            <el-table-column align="right" prop="deposit_money" label="借款总额" width="150">
              <template slot-scope="scope"><el-row>{{scope.row.deposit_money}}</el-row></template>
            </el-table-column>
            <el-table-column align="left" label="" width="70">
              <template slot-scope="scope"><el-button @click="onClickShowLoan(scope.row, 4)" size="mini" style="padding: 4px" type="text" icon="el-icon-search">查看</el-button></template>
            </el-table-column>
            <el-table-column align="right" prop="deposit_repaid" label="已还总额" width="150" >
              <template slot-scope="scope"><el-row>{{scope.row.deposit_repaid}}</el-row></template>
            </el-table-column>
            <el-table-column align="left" label="" width="70">
              <template slot-scope="scope"><el-button @click="onClickShowRepayment(scope.row, 52)" size="mini" style="padding: 4px" type="text" icon="el-icon-search">查看</el-button></template>
            </el-table-column>
            <el-table-column align="right" label="待还总额" width="150">
              <template slot-scope="scope"><el-row><a style="color: #f56c6c">{{SUTools(scope.row.deposit_money, scope.row.deposit_repaid)}}</a></el-row></template>
            </el-table-column>
            <el-table-column align="left" label="" width="150">
              <template slot-scope="scope">
                <el-button size="mini" type="text"
                           v-if="Number(scope.row.deposit_money) < Number(scope.row.deposit_repaid) && operateAccessCheck"
                           @click="onClickCreateOverage(scope.row, 52)" icon="el-icon-plus">超出现金结算</el-button>
              </template>
            </el-table-column>
            <el-table-column align="left" label="现金结算" width="100">
              <template slot-scope="scope"><el-button @click="onClickShowOverage(scope.row, 52)" size="mini" style="padding: 4px" type="text" icon="el-icon-search">查看</el-button></template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
              <template slot-scope="scope"><el-button @click="onClickCreateRepayment(scope.row)" size="mini" style="padding: 4px" type="primary" icon="el-icon-plus" v-if="operateAccessCheck">录入还款</el-button></template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="还款记录" :visible.sync="visible.repayments">
      <el-table :data="repayments" show-summary :row-style="rowStyle" :cell-style="cellStyle" stripe>
        <el-table-column prop="date" label="还款日期" width="200" :formatter="dateFormat"></el-table-column>
        <el-table-column prop="repayUser.name" label="还款人" width="150"></el-table-column>
        <el-table-column align="right" prop="repayment_money" label="还款金额" width="150"></el-table-column>
        <el-table-column prop="note" label="抵借备注" width="300"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="应收/借款记录" :visible.sync="visible.loansDialog">
      <el-tabs type="border-card" style="margin-top: 10px">
        <el-tab-pane label="综合应收">
          <el-table :data="costs" show-summary :row-style="rowStyle" :cell-style="cellStyle" stripe>
            <el-table-column prop="date" label="面单日期" width="120" :formatter="dateFormat"></el-table-column>
            <el-table-column prop="cost_user_name" label="发生人" width="100"></el-table-column>
            <el-table-column align="right" prop="money" label="借款金额" width="100"></el-table-column>
            <el-table-column prop="really_subject.name" label="科目" width="100"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="use" label="用途" width="250"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="note" label="备注" width="250"></el-table-column>
            <el-table-column fixed="left" label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="text">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="项目应收">
          <el-table :data="costs_" :row-style="rowStyle" :cell-style="cellStyle" stripe>
            <el-table-column prop="date" label="面单日期" width="120" :formatter="dateFormat"></el-table-column>
            <el-table-column prop="cost_user_name" label="发生人" width="100"></el-table-column>
            <el-table-column align="right" prop="money" label="借款金额" width="100"></el-table-column>
            <el-table-column prop="really_subject.name" label="科目" width="100"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="use" label="用途" width="250"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="note" label="备注" width="250"></el-table-column>
            <el-table-column fixed="left" label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="text">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-button style="margin: 10px; width: 150px" size="small" type="primary" @click="visible.loansDialog = false">关闭</el-button>
    </el-dialog>
    <el-dialog title="录入还款" :visible.sync="visible.repayForm">
      <el-form :model="repayForm" label-width="150px" size="mini">
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
        <el-form-item label="还款科目" prop="subject_id">
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
          <el-input style="width: 250px" v-model="repayForm.repayment_money"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input style="width: 500px" v-model="repayForm.note"></el-input>
        </el-form-item>
        <el-form-item label="操作">
          <el-button type="primary" @click="submitRepayForm('repayForm')">确 定</el-button>
          <el-button @click="visible.repayForm = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="现金结算记录" :visible.sync="visible.overageDialog">
      <el-table :data="overages" fit style="width: 100%" :row-style="rowStyle" :cell-style="cellStyle" show-summary>
        <el-table-column align="right" header-align="center" prop="date" label="结算日期" width="150" :formatter="dateFormat"></el-table-column>
        <el-table-column align="center" prop="user.name" label="员工姓名" width="150"></el-table-column>
        <el-table-column align="right" prop="money" label="金额" width="150"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="note" label="备注" width="250"></el-table-column>
      </el-table>
      <el-button style="margin: 10px; width: 150px" size="small" type="primary" @click="visible.overageDialog = false">关闭</el-button>
    </el-dialog>
    <el-dialog title="现金结算" :visible.sync="visible.overageForm">
      <el-form :model="overageForm" label-width="150px" size="mini">
        <el-form-item label="结算时间" prop="date">
          <el-date-picker
            value-format="timestamp"
            v-model="overageForm.date"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="超出金额">
          <span style="color: #8492a6;" v-if="overageForm.subject_id === 5"> {{ SUTools(receivable_user.loan_money, receivable_user.loan_repaid)}}</span>
          <span style="color: #8492a6;" v-else-if="overageForm.subject_id === 6"> {{ SUTools(receivable_user.loan_money, receivable_user.loan_repaid)}}</span>
          <span style="color: #8492a6;" v-else-if="overageForm.subject_id === 33"> {{ SUTools(receivable_user.earnest_money, receivable_user.earnest_repaid)}}</span>
          <span style="color: #8492a6;" v-else-if="overageForm.subject_id === 52"> {{ SUTools(receivable_user.deposit_money, receivable_user.deposit_repaid) }}</span>
          <span style="float: left;color: red;" v-else> 未知还款类型 </span>
        </el-form-item>
        <el-form-item label="本次结算金额">
          <el-input style="width: 250px" v-model="overageForm.money"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input style="width: 500px" v-model="overageForm.note"></el-input>
        </el-form-item>
        <el-form-item label="操作">
          <el-button type="primary" @click="submitOverageForm('overageForm')">确 定</el-button>
          <el-button @click="visible.overageForm = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_pageReceivable   beforeMount()
-->
<script>
  import { parseTime } from '../../../../utils/index'
  import { getGeneral } from '../../../../api/costGeneral'
  import { getRepayments, createRepayment, getOverages, createRepaymentOverage } from '../../../../api/repayment'
  import { getBasic } from '../../../../api/costBasic'
  import { getReceivables, updateAll } from '../../../../api/receivable'

  const defaultRepayForm = {
    date: Date.parse(new Date()), // 还款日期
    note: null, // 备注
    repayment_money: null,
    repay_user_id: null,
    subject_id: null
  }
  const defaultOverageForm = {
    date: Date.parse(new Date()), // 还款日期
    note: null, // 备注
    money: null,
    user_id: null,
    subject_id: null
  }
  export default {
    data() {
      return {
        receivables: {
          tab_1: [],
          tab_2: [],
          tab_3: []
        },
        costs: [],
        costs_: [],
        overages: [],
        money_sum: 0,
        repayment_sum: 0,
        number_sum: 0,
        repayments: [],
        searchForm_1: {
          page: 1,
          pageSize: 20,
          totalCount: 0
        },
        searchForm_2: {
          page: 1,
          pageSize: 20,
          totalCount: 0
        },
        searchForm_3: {
          page: 1,
          pageSize: 20,
          totalCount: 0
        },
        repaySubjects: [
          { id: 5, name: '工人借款' },
          { id: 6, name: '职员借款' },
          { id: 33, name: '投标保证金' },
          { id: 52, name: '押金' }
        ],
        receivable_user: {
          loan_money: 0,
          earnest_money: 0,
          deposit_money: 0,
          loan_repaid: 0,
          earnest_repaid: 0,
          deposit_repaid: 0
        },
        currentSubjectId: null, // 当前还款科目
        repayForm: Object.assign({}, defaultRepayForm),
        overageForm: Object.assign({}, defaultOverageForm),
        visible: {
          repayments: false,
          repayForm: false,
          overageDialog: false,
          overageForm: false,
          loansDialog: false
        },
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
    methods: {
      /** 点击事件类 */
      onClickShowRepayment(row, subject_id) {
        const params = {
          'repay_user_id': row.user_id,
          'subject_id': Number(subject_id)
        }
        this.fetchRepayments(params)
      },
      onClickShowLoan(row, isLoan) {
        this.fetchCosts(row.user_id, Number(isLoan))
        this.fetchCosts_(row.user_id, Number(isLoan))
      },
      // 创建借款记录,跳转到我的申请页面
      onClickCreateLoan() {
        this.$router.push({ name: 'myApply' })
      },
      // 创建还款记录
      onClickCreateRepayment(row) {
        this.repayForm.repay_user_id = row.user_id
        getReceivables({ user_id: this.repayForm.repay_user_id }).then(res => {
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
      },
      onClickCreateOverage(row, subject) {
        this.overageForm.subject_id = Number(subject)
        this.overageForm.user_id = row.user_id
        getReceivables({ user_id: this.overageForm.user_id }).then(res => {
          if (res.data._items.length === 0) {
            this.$message({ type: 'error', message: '此人暂无借款,无法操作' })
          } else {
            this.receivable_user.loan_money = res.data._items[0].loan_money
            this.receivable_user.loan_repaid = res.data._items[0].loan_repaid
            this.receivable_user.earnest_money = res.data._items[0].earnest_money
            this.receivable_user.earnest_repaid = res.data._items[0].earnest_repaid
            this.receivable_user.deposit_money = res.data._items[0].deposit_money
            this.receivable_user.deposit_repaid = res.data._items[0].deposit_repaid
            this.visible.overageForm = true
          }
        })
      },
      onClickShowOverage(row, subject) {
        const params = {
          user_id: row.user_id,
          subject_id: Number(subject)
        }
        this.fetchOverages(params)
      },
      // 刷新所有应收账
      onClickFreshMoney() {
        updateAll({ subject_id: 5 }).then(res => {
          console.log('刷新应收账完毕' + res.data.failed)
          this.$notify({ title: '刷新完毕', type: 'success', position: 'top-right' })
          this.fetchReceivables_1()
        })
        updateAll({ subject_id: 33 }).then(res => {
          console.log('刷新应收账完毕' + res.data.failed)
          this.$notify({ title: '刷新完毕', type: 'success', position: 'top-right' })
          this.fetchReceivables_2()
        })
        updateAll({ subject_id: 52 }).then(res => {
          console.log('刷新应收账完毕' + res.data.failed)
          this.$notify({ title: '刷新完毕', type: 'success', position: 'top-right' })
          this.fetchReceivables_3()
        })
      },
      /** 接口获取类 */
      fetchCosts(params, isLoan) {
        const res = Object.assign({}, { valid: 1, isLoan: isLoan, cost_user_id: params })
        getGeneral(res).then(res => {
          this.costs = res.data._items
        })
      }, // 读取综合应收
      fetchCosts_(params, isLoan) {
        const res = Object.assign({}, { valid: 1, isLoan: isLoan, cost_user_id: params })
        getBasic(res).then(res => {
          this.costs_ = res.data._items
          this.visible.loansDialog = true
        })
      }, // 读取项目应收
      fetchReceivables_1() {
        const params_1 = Object.assign({}, this.searchForm_1, { subject_id: 5 })
        getReceivables(params_1).then(res => {
          this.receivables.tab_1 = res.data._items
          this.searchForm_1.totalCount = res.data._meta.totalCount
        })
      },
      fetchReceivables_2() {
        const params_2 = Object.assign({}, this.searchForm_2, { subject_id: 33 })
        getReceivables(params_2).then(res => {
          this.receivables.tab_2 = res.data._items
          this.searchForm_2.totalCount = res.data._meta.totalCount
        })
      },
      fetchReceivables_3() {
        const params_3 = Object.assign({}, this.searchForm_3, { subject_id: 52 })
        getReceivables(params_3).then(res => {
          this.receivables.tab_3 = res.data._items
          this.searchForm_3.totalCount = res.data._meta.totalCount
        })
      },
      fetchRepayments(params) {
        getRepayments(params).then(res => {
          this.repayments = res.data._items
          this.visible.repayments = true
        })
      },
      fetchOverages(params) {
        getOverages(params).then(res => {
          this.overages = res.data._items
          this.visible.overageDialog = true
        })
      },
      /** 数据处理及过滤类 */
      dateFormat(row, column) {
        const date = row[column.property]
        return parseTime(date, '{y}-{m}-{d}')
      },
      statusFormat(row, column) {
        if (Number(row.repaid_money) === 0 || Number(row.repaid_money) === null) return '待还款'
        else if (Number(row.repaid_money) < Number(row.money)) return '部分还款'
        else if (Number(row.repaid_money) >= Number(row.money)) return '已还款'
        else return 'error'
      },
      /** 三个分页器 */
      handleSizeChange_1(pageSize) {
        this.searchForm_1.pageSize = pageSize
        this.fetchReceivables_1()
      },
      handleSizeChange_2(pageSize) {
        this.searchForm_2.pageSize = pageSize
        this.fetchReceivables_2()
      },
      handleSizeChange_3(pageSize) {
        this.searchForm_3.pageSize = pageSize
        this.fetchReceivables_3()
      },
      handleCurrentChange_1(currentPage) {
        this.searchForm_1.page = currentPage
        this.fetchReceivables_1()
      },
      handleCurrentChange_2(currentPage) {
        this.searchForm_2.page = currentPage
        this.fetchReceivables_2()
      },
      handleCurrentChange_3(currentPage) {
        this.searchForm_3.page = currentPage
        this.fetchReceivables_3()
      },
      /**
       * @return {string}
       * 求差补零工具
       */
      SUTools(a, b) {
        return (((Number(a) * 100) - (Number(b) * 100)) / 100).toFixed(2)
      },
      /** 表格样式类 */
      rowStyle() {
        return 'height: 25px'
      },
      cellStyle() {
        return 'padding: 3px'
      },
      currentSubjectChange(valId) {
        this.currentSubjectId = valId
      },
      /** 表单处理 */
      submitRepayForm(formName) {
        if ((this.repayForm.date).toString().length === 13) {
          this.repayForm.date = this.repayForm.date / 1000
        }
        createRepayment(this.repayForm).then(res => {
          if (res.data.bCode === 101) {
            this.$notify({ title: '成功', message: '录入还款记录成功!', type: 'success', position: 'top-right' })
            this.fetchReceivables_1()
            this.fetchReceivables_2()
            this.fetchReceivables_3()
          } else {
            this.$notify({ title: '失败', message: res.data.bData, type: 'warning', position: 'top-right' })
          }
          this.repayForm = Object.assign({}, defaultRepayForm)
          this.visible.repayForm = false
        })
      },
      submitOverageForm(formName) {
        if ((this.overageForm.date).toString().length === 13) {
          this.overageForm.date = this.overageForm.date / 1000
        }
        createRepaymentOverage(this.overageForm).then(res => {
          if (res.data.bCode === 101) {
            this.$notify({ title: '成功', message: '成功创建超出结算!', type: 'success', position: 'top-right' })
            this.fetchReceivables_1()
            this.fetchReceivables_2()
            this.fetchReceivables_3()
          } else {
            this.$notify({ title: '失败', message: res.data.bData, type: 'warning', position: 'top-right' })
          }
          this.overageForm = Object.assign({}, defaultOverageForm)
          this.visible.overageForm = false
        })
      }
    },
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_pageReceivable#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    },
    computed: {
      /** 特殊权限检查 */
      operateAccessCheck() {
        // 仅吴金娟/系统管理员可操作
        return this.$store.getters.userId === 145 || this.$store.getters.userId === 33
      }
    },
    mounted() {
      this.fetchReceivables_1()
      this.fetchReceivables_2()
      this.fetchReceivables_3()
    }
  }
</script>

<style scoped>

</style>
