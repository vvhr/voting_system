<template>
  <div class="app-container">
    <div class="apply_header" style="background: #d3e8f1;padding-top: 5px;border-radius: 10px">
      <el-form size="mini" label-width="100px">
        <el-form-item label="搜索栏">
          <el-form ref="searchForm" :model="searchForm" label-width="100px" class="demo-form-inline" :inline="true" size="mini">
              <el-form-item>
                <el-input v-model="searchForm.name" placeholder="项目名称"></el-input>
              </el-form-item>
              <el-form-item prop="branch_id" label-width="70px">
                <el-select v-model="searchForm.branch_id" placeholder="承建公司">
                  <el-option v-for="(val, key) in branch" :key="key" :label="val.name" :value="val.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="flow_status" label-width="70px">
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
              <el-button @click="onSubmitSearchForm()" icon="el-icon-search" ></el-button>
              </el-form-item>
          </el-form>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog :title="this.activeId===0?'新增收款记录':'修改收款记录'" :visible.sync="visible.ruleForm" @close="closeDialog()">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" size="mini">
        <el-form-item label="收款日期" prop="receive_date">
          <el-date-picker
            v-model="ruleForm.receive_date"
            type="date"
            value-format = "timestamp"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="本次收款金额" prop="money" v-if="$store.getters.userId === 73">
          <el-input v-model="ruleForm.money"></el-input>
        </el-form-item>
        <el-form-item label="本次开票金额" prop="open_ticket" v-if="$store.getters.userId === 73">
          <el-input v-model="ruleForm.open_ticket"></el-input>
        </el-form-item>
        <el-form-item label="发票编号" prop="invoice_no">
          <el-input v-model="ruleForm.invoice_no"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input v-model="ruleForm.comment"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="visible.ruleForm = false">关闭</el-button>
        </el-form-item>
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
      <el-table-column prop="invoice_no" label="发票编号" width="100" align="center"></el-table-column>
      <el-table-column prop="project_name.name" label="项目名称" min-width="100" align="center"></el-table-column>
      <el-table-column prop="money" label="已收金额" width="100" align="center"></el-table-column>
      <el-table-column label="承建公司" header-align="center" width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.project_name.branch_id | parseBranch}}</span>
        </template>
      </el-table-column>
      <el-table-column label="收款日期" width="100" header-align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.receive_date | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="备注" min-width="100" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="onClickEditBtn(scope.row.id)"><i class="el-icon-edit"></i>修改</el-button>
          <el-button type="primary" size="mini" @click="onClickBack(scope.row.project_id)"><i class="el-icon-back"></i>返回项目</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { createReceival, getReceivals, getReceival, updateReceival } from '../../api/receival'
  import { replyRes } from '../../utils/res'
  import { parseTime } from '../../utils'
  import Store from '../../store'
  import { getBranches } from '../../api/branch'

  const defaultRuleForm = {
    comment: '',
    invoice_no: '',
    receive_date: null,
    open_ticket: null,
    money: null
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
        branch: [
          { id: null, name: '全部' }
        ], // 承建单位
        rules: {},
        searchForm: {
          name: '',
          time: [],
          page: 1,
          start_at: null,
          end_at: null,
          pageSize: 10,
          totalCount: 0,
          id: null
        },
        ruleForm: Object.assign({}, defaultRuleForm),
        /**
         * 项目列表相关变量
         */
        loading: {
          list: true
        },
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
        }
      }
    },
    computed: {
      branches() {
        return this.$store.state.user.branches
      }
    },
    filters: {
      parseTime: function(value) {
        if (value === null) {
          return '_________'
        }
        return parseTime(value, '{y}-{m}-{d}')
      },
      parseBranch: function(value) {
        const list = Store.state.user.branches
        for (const index in list) {
          if (parseInt(list[index].id) === value) {
            return list[index].name
          }
        }
        return value
      }
    },
    mounted() {
      this.fetchList()
      this.fetchBranches()
    },
    methods: {
      /**
       * 项目列表相关命令
       */
      fetchList() {
        if (this.$route.params.id !== null) {
          this.searchForm.id = this.$route.params.id
        } else this.searchForm.id = null
        this.loading.list = true
        getReceivals(this.searchForm).then(res => {
          this.list = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
          this.loading.list = false
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
        getReceival(this.activeId).then(res => {
          res.data.receive_date *= 1000
          this.ruleForm = Object.assign({}, res.data)
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
        this.activeId = 0
        this.visible.ruleForm = true
      },
      onClickEditBtn(id) {
        this.activeId = id
        this.fetchOne()
        this.visible.ruleForm = true
      },
      onClickDeleteBtn(id) {},
      onClickBack(id) {
        this.$router.push({ name: 'marketContract', params: { id }})
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ruleForm.receive_date /= 1000
            if (this.activeId === 0) {
              // 调用新增接口并响应
              createReceival(this.ruleForm).then(res => {
                if (replyRes(res)) {
                  this.visible.ruleForm = false
                }
              })
            } else {
              // 调用更新接口并响应
              updateReceival(this.ruleForm).then(res => {
                if (replyRes(res)) {
                  this.visible.ruleForm = false
                }
              })
            }
          } else {
            console.log('ruleForm validate fail')
            return false
          }
        })
      },
      closeDialog() {
        this.ruleForm = Object.assign({}, defaultRuleForm)
        this.fetchList()
      },
      // 搜索
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
      /** -------- 表格样式设置方法 -------- */
      rowStyle() {
        return 'height: 25px'
      },
      cellStyle() {
        return 'padding: 2px'
      }
    }
  }
</script>
