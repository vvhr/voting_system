<template>
    <div class="app-container">
      <div class="header">
        <!--提示部件-->
        <el-row>
          <el-col :span="1.5" style="margin-top: 6px;margin-bottom: 5px">
            <div class="tips">温馨提示</div>
          </el-col>
          <el-col :span="18" style="margin-top: 6px;margin-bottom: 5px">
            <div class="tips-text"><b>在凭证被确认打款后才会生成流水!</b></div>
          </el-col>
        </el-row>
        <!--搜索部件-->
        <el-row style="background-color: rgb(236, 243, 247);padding-left: 10px;padding-top: 10px;border-radius:10px 10px;">
          <el-col >
            <!--输入搜索-->
            <el-row>
              <el-form :inline="true" style="height: 40px;" ref="searchForm" :model="searchForm">
                <el-form-item label="条件查询" prop="proof_no" label-width="70px">
                  <el-input @keyup.enter.native="onClickQuery" style="width: 160px;" size="small" v-model="searchForm.proof_no" placeholder="凭证编号"></el-input>
                </el-form-item>
                <el-form-item prop="bank_name" label-width="70px">
                  <el-input @keyup.enter.native="onClickQuery" style="width: 160px;" size="small" v-model="searchForm.bank_name" placeholder="打款银行"></el-input>
                </el-form-item>
                <el-form-item prop="company_name" label-width="70px">
                  <el-input @keyup.enter.native="onClickQuery" style="width: 160px;" size="small" v-model="searchForm.company_name" placeholder="打款单位"></el-input>
                </el-form-item>

              </el-form>
            </el-row>
            <!--区间搜索-->
            <el-row>
              <el-form :inline="true" style="height: 40px;">
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
            <!--查询 重置 按钮-->
            <el-row>
              <el-form :inline="true" style="height: 40px;margin-bottom: 10px">
                <el-form-item>
                  <el-button @click="onClickQuery()" size="small" style="width: 200px" icon="el-icon-search" type="primary">查询(回车)</el-button>
                  <el-button @click="onClickCleanQuery()" size="small" style="width: 200px" icon="el-icon-search" type="primary">重置</el-button>
                </el-form-item>
              </el-form>
            </el-row>
          </el-col>
        </el-row>
        <!--操作栏-->
        <el-row style="background-color: rgb(107, 112, 115);border-radius:5px 5px;padding: 5px">
          <el-col :span="5" style="margin-top: 5px ">
            <div class="header-batch">页面操作：</div>
            <div class="header-batch">已选中数：{{this.num===null?0:this.num}}</div>
            <div class="header-batch">金额合计：{{this.sum===null?0:this.sum}}</div>
          </el-col>
          <el-col :span="5"><exportBankFlow :ads="bank_flows"></exportBankFlow></el-col>
          <el-col :span="10">
            <!--分页器-->
            <div class="pagination">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageInfo.currentPage"
                :page-sizes="[20, 50, 100, 200, 500, 1000]"
                :page-size="pageInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageInfo.totalCount">
              </el-pagination>
            </div>
          </el-col>
        </el-row>
        <!--流水表头部-->
        <div class="my-table-bank">
          <el-table
            v-loading="loading" border :data="bank_flows"
            id="apply-mineCost"
            :row-style="rowStyle" :cell-style="cellStyle"
            fit stripe
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange">
            <el-table-column align="center" type="selection" width="45"></el-table-column>
            <el-table-column fixed="left" type="expand" label="展开" width="50">
              <template slot-scope="props">
                <el-row>
                  <el-col :span="5">
                    打款银行: {{props.row.bank_name}}
                  </el-col>
                  <el-col :span="5">
                    打款账户: {{props.row.bank_account}}
                  </el-col>
                  <el-col :span="5">
                    打款单位: {{props.row.company_name}}
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="流水ID" width="65"></el-table-column>
            <el-table-column prop="proof_no" label="凭证编号" sortable="custom" width="150"></el-table-column>
            <el-table-column prop="payer_time" label="打款日期" sortable="custom" width="150" :formatter="dateFormat_short"></el-table-column>
            <el-table-column prop="costApplys[0].cost_user_name" label="收付人" width="90"></el-table-column>
            <el-table-column align="center" prop="received_money" label="收款金额" width="120"></el-table-column>
            <el-table-column align="center" prop="money_sum" label="付款金额" width="120"></el-table-column>
            <el-table-column prop="sbj_all" label="费用明细(面单)" width="180"></el-table-column>
            <el-table-column prop="sbjR_all" label="费用明细(实际)" width="180"></el-table-column>
            <el-table-column prop="use_all" label="摘要" width="300" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="note" label="备注"></el-table-column>
            <el-table-column prop="current_balance" label="当前余额" width="160"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_pageBankFlow   beforeMount()
-->
<script>
  import exportBankFlow from './exportBankFlow'
  import { getProof } from '../../../../api/proof'
  import { parseTime } from '../../../../utils/index'
  export default {
    components: {
      exportBankFlow
    },
    data() {
      return {
        bank_flows: [],
        searchForm: {
          proof_no: null,
          bank_name: null,
          company_name: null,
          payer_time: null,
          payer_start_at: null,
          payer_end_at: null,
          sort_name: null,
          sort: null,
          status: 2
        },
        // 表格多选类 sum：金额合计 num： 选中合计 multipleSelection：被选中的项
        sum: 0,
        num: 0,
        multipleSelection: [],
        // 总页数
        pageInfo: {
          currentPage: 1,
          pageSize: 20,
          totalCount: 0
        },
        // 加载动画
        loading: false,
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
          }
          ]
        }
      }
    },
    methods: {
      onClickQuery() {
        this.fetchProofs(this.finalSearchForm)
      },
      onClickCleanQuery() {
        this.searchForm = {
          proof_no: null,
          bank_name: null,
          company_name: null,
          payer_time: null,
          payer_start_at: null,
          payer_end_at: null,
          sort_name: null,
          sort: null,
          status: 2
        }
      },
      onClickUpdateFlow() {
        console.log('更新流水')
      },
      /** 分页器方法 */
      handleSizeChange(pageSize) {
        this.loading = true
        this.pageInfo.pageSize = pageSize
        this.fetchProofs(this.finalSearchForm)
      },
      handleCurrentChange(currentPage) {
        this.loading = true
        this.pageInfo.currentPage = currentPage
        this.fetchProofs(this.finalSearchForm)
      },
      /** 批量被选择 */
      handleSelectionChange(val) {
        this.multipleSelection = val
        this.sum = 0
        this.num = val.length
        for (let i = 0; i < val.length; i++) {
          this.sum = (Number(this.sum) + Number(val[i].money_sum)).toFixed(2)
        }
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
      /** -------- 表格样式类 -------- */
      rowStyle({ row, rowIndex }) {
        if (this.showHighLight === true) {
          return 'height: 25px'
        }
      },
      cellStyle({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 1) {
          return 'background: rgb(64, 158, 255);padding: 2px'
        } else {
          return 'padding: 2px'
        }
      },
      /** 接口获取类 */
      fetchProofs(params) {
        this.loading = true
        getProof(params).then(res => {
          this.bank_flows = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      },
      /** 格式化过滤类 */
      dateFormat_short(row, column) {
        const date = row[column.property]
        if (date === null) {
          return '暂无'
        } else return parseTime(date, '{y}-{m}-{d}')
      } // 时间格式化
    },
    mounted() {
      this.fetchProofs(this.finalSearchForm)
    },
    computed: {
      finalSearchForm() {
        if (this.searchForm.payer_time !== null) {
          this.searchForm.payer_start_at = this.searchForm.payer_time[0]
          this.searchForm.payer_end_at = this.searchForm.payer_time[1]
        }
        const res = Object.assign({}, this.searchForm)
        res.pageSize = this.pageInfo.pageSize
        res.page = this.pageInfo.currentPage
        return res
      }
    },
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_pageBankFlow#') === false) {
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
  .header{
    padding: 10px 10px 10px 10px;
    background-color: #ffffff;
    height: 40px;
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
  .header-batch{
    color: #FFFFFF;
    display: inline-block;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-size: 14px;
    padding-right: 12px;
    text-align: right;
    text-rendering: optimizeLegibility;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
  }
  .pagination .el-pagination__jump {
    margin-left: 24px;
    font-weight: 400;
    color: #ffffff!important;
  }
  .pagination .el-pagination__total {
    margin-right: 10px;
    font-weight: 400;
    color: #ffffff!important;
  }
</style>
<style>
  .pagination .el-pagination__jump {
    margin-left: 24px;
    font-weight: 400;
    color: #ffffff!important;
  }
  .pagination .el-pagination__total {
    margin-right: 10px;
    font-weight: 400;
    color: #ffffff!important;
  }
  .my-table-bank .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
    border-right: 2px solid #ebeef5!important;
  }
  .my-table-bank .el-table td, .el-table th.is-leaf {
    border-bottom: 2px solid #ebeef5!important;
  }
  .my-table-bank .el-table__expanded-cell[class*=cell] {
    padding: 10px 10px 10px 50px!important;
    background-color: floralwhite!important;
  }
  .my-table-bank .el-table__expand-icon {
    color: #fff!important;
  }
</style>
