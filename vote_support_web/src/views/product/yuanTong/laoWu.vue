<template>
  <div class="app-container">
    <div class="apply_header" style="background: #d3e8f1;padding-top: 5px;border-radius: 10px">
      <el-form size="mini" label-width="100px">
        <el-form-item label="搜索栏">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
            <el-form-item label-width="70px" placeholder="项目名称">
              <el-input style="width: 300px" v-model="searchForm.name"></el-input>
            </el-form-item>
            <el-form-item prop="flow_status">
              <el-select v-model="searchForm.fen_type" placeholder="分包类型">
                <el-option v-for="(val, key) in fenBao" :key="key" :label="val.name" :value="val.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="flow_status">
              <el-select v-model="searchForm.fen_mode" placeholder="分包方式">
                <el-option v-for="(val, key) in fenModel" :key="key" :label="val.name" :value="val.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="flow_status">
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
              <el-button type="primary" @click="onSubmitSearch" icon="el-icon-search" circle></el-button>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="操作栏">
          <!--<el-button type="primary" icon="el-icon-plus" @click="onSubmitAdd" size="mini">结算条目</el-button>-->
          <el-button type="primary"  @click="onSubmitCheck" icon="el-icon-zoom-in">结算记录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--新增计算-->
    <el-dialog title="创建项目结算条目" :visible.sync="dialogVisible" width="30%">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" size="mini">
        <el-form-item label="选择项目" prop="customer_id">
          <!--<el-input v-model="ruleForm.customer_id"></el-input>-->
          <el-select
            v-model="ruleForm.project_id"
            filterable
            remote
            reserve-keyword
            placeholder="关键词搜索，空格表示全部"
            :remote-method="remoteMethod"
            :loading="loading.project"
            style="width: 100%">
            <el-option
              v-for="item in projects"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分包类型" prop="content">
          <el-select v-model="ruleForm.fen_type" placeholder="请选择分包类型" style="width: 100%" prop="itemType">
            <el-option v-for="(item, key) in fenBao" :label="item.name" :value="item.id" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分包方式" prop="content">
          <el-select v-model="ruleForm.fen_mode" placeholder="分包方式" style="width: 100%" prop="itemType">
            <el-option v-for="(item, key) in fenModel" :label="item.name" :value="item.id" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogVisible = false">取 消</el-button>
          <el-button @click="submitAdd('ruleForm')">确 定</el-button>
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
        <el-table-column prop="project.project_no" label="项目编号" width="110" align="center"></el-table-column>
        <el-table-column prop="project.name" label="项目名称" align="center"></el-table-column>
        <el-table-column  label="分包类型" width="110" align="center">
          <template slot-scope="scope">{{scope.row.fen_type | parseType}}</template>
        </el-table-column>
        <el-table-column  label="分包方式" width="110" align="center">
          <template slot-scope="scope">{{scope.row.fen_mode | parseMode}}</template>
        </el-table-column>
        <el-table-column prop="repay_cost" label="已支付金额" width="90" align="center"></el-table-column>
        <el-table-column prop="work_num" label="工程量" width="80" align="center"></el-table-column>
        <el-table-column prop="project.money_total" label="合同额" width="80" align="center"></el-table-column>
        <el-table-column prop="name" label="成本占比" width="110" align="center">
          <template slot-scope="scope">
            {{scope.row.project.money_total > 0 ? parseInt((scope.row.repay_cost / scope.row.project.money_total)* 10000)/ 100 : 0 }}%
          </template>
        </el-table-column>
        <el-table-column  label="计划开始时间" width="110" align="center">
          <template slot-scope="scope">{{scope.row.create_at | parseTime}}</template>
        </el-table-column>
      </el-table>
    </div>
    <!--<table class="_table" border="0" cellpadding="0" cellspacing="0" style="width: 100%">-->
      <!--<thead>-->
      <!--<tr>-->
        <!--<th>序号</th>-->
        <!--<th width="100px">项目编号</th>-->
        <!--<th width="250px">项目名称</th>-->
        <!--<th>分包类型</th>-->
        <!--<th>分包方式</th>-->
        <!--<th>结算状态</th>-->
        <!--<th>已支付金额</th>-->
        <!--&lt;!&ndash;<th>劳务单价</th>&ndash;&gt;-->
        <!--<th>工程量</th>-->
        <!--<th>合同额</th>-->
        <!--<th>成本占比</th>-->
        <!--<th>创建时间</th>-->
        <!--<th>结算统计</th>-->
        <!--<th>结算操作</th>-->
        <!--<th>操作</th>-->
      <!--</tr>-->
      <!--</thead>-->
      <!--<tbody v-for="(item, key) in list" >-->
      <!--<tr>-->
        <!--<td>{{item.id}}</td>-->
        <!--<td>{{item.project.project_no}}</td>-->
        <!--<td>{{item.project.name}}</td>-->
        <!--<td>{{item.fen_type | parseType}}</td>-->
        <!--<td>{{item.fen_mode | parseMode}}</td>-->
        <!--<td><el-button type="danger" @click="onSubmitStatus(item)">{{item.fen_status | parseStatus}}</el-button></td>-->
        <!--<td>{{item.repay_cost}}</td>-->
        <!--<td>{{item.work_num}}</td>-->
        <!--<td>{{item.project.money_total}}</td>-->
        <!--<td>{{item.project.money_total > 0 ? parseInt((item.repay_cost / item.project.money_total)* 10000)/ 100 : 0 }}%</td>-->
        <!--<td>{{item.create_at | parseTime}}</td>-->
        <!--<td> <el-button @click="onNewDialog(item)" type="text">点击查看</el-button></td>-->
        <!--<td><el-button type="primary" @click="onSubmitFenAdd(item)" size="mini">+</el-button> </td>-->
        <!--<td><el-button type="primary" icon="el-icon-edit" circle @click="onSubmitEdit(item)"></el-button></td>-->
      <!--</tr>-->
      <!--<tr v-if="item.showVisible" v-for="(_item, k) in item.arr" style="background: #f0f0f0;"  class="a_class">-->
        <!--<td colspan="5"></td>-->
        <!--<td>{{k}}</td>-->
        <!--<td>{{_item[0]}}</td>-->
        <!--<td>{{_item[1]}}</td>-->
        <!--<td><el-button type="primary" @click="onSubmitFenView(k, item.id)" size="mini">结算记录</el-button></td>-->
        <!--<td colspan="5"></td>-->
      <!--</tr>-->
      <!--</tbody>-->
    <!--</table>-->
    <div id="edit">
      <el-dialog title="修改分包属性" :visible.sync="dialogEdit" width="30%">
        <el-form :model="ruleEdit" ref="ruleEdit" label-width="100px" class="demo-ruleForm">
              <el-form-item label="分包类型" prop="content">
                <el-select v-model="ruleEdit.fen_type" placeholder="请选择分包类型" style="width: 100%" prop="itemType">
                  <el-option v-for="(item, key) in fenBao" :label="item.name" :value="item.id" :key="key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="分包类型" prop="content">
                <el-select v-model="ruleForm.fen_type" placeholder="请选择分包类型" style="width: 100%" prop="itemType">
                  <el-option v-for="(item, key) in fenBao" :label="item.name" :value="item.id" :key="key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="分包方式" prop="content">
                <el-select v-model="ruleEdit.fen_mode" placeholder="分包方式" style="width: 100%" prop="itemType">
                  <el-option v-for="(item, key) in fenModel" :label="item.name" :value="item.id" :key="key"></el-option>
                </el-select>
              </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="dialogVisible = false">取 消</el-button>
            <el-button @click="submitEdit('ruleEdit')">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div id="fenbao">
        <el-dialog :title="isAdd === false ? '添加工人结算记录' : '修改工人结算记录'" :visible.sync="dialogAdd" width="30%" :modal="false">
          <el-form :model="ruleFormFen" ref="ruleFormFen" :rules="rules" label-width="110px" class="demo-ruleForm">
            <el-form-item label="分包队伍" prop="fen_team">
              <el-input v-model="ruleFormFen.fen_team"></el-input>
            </el-form-item>
            <el-form-item label="本次支付金额" prop="repay_cost">
              <el-input v-model="ruleFormFen.repay_cost"></el-input>
            </el-form-item>
            <el-form-item label="工程量" prop="work_num">
              <el-input v-model="ruleFormFen.work_num"></el-input>
            </el-form-item>
            <!--<el-form-item label="已开票金额" prop="content">-->
            <!--<el-input v-model="ruleForm.repay_p_cost"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item>
              <el-button type="primary" @click="dialogAdd = false">取 消</el-button>
              <el-button @click="submitFen('ruleFormFen')">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
    </div>
    <div id="history">
      <el-dialog title="结算记录" :visible.sync="dialog" width="50%">
        <table class="_table" border="0" cellpadding="0" cellspacing="0" style="width: 100%">
          <thead>
          <tr>
            <th>序号</th>
            <th>分包队伍</th>
            <th>已支付金额</th>
            <th>工程量</th>
            <th>操作时间</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody v-for="(item, key) in fList" :key="key" >
          <tr>
            <td>{{item.id}}</td>
            <td>{{item.fen_team}}</td>
            <td>{{item.repay_cost}}</td>
            <td>{{item.work_num}}</td>
            <td>{{item.create_at | parseTime}}</td>
            <td><el-button @click="submitHisEdit(item)" type="primary">修改</el-button></td>
          </tr>
          </tbody>
        </table>
      </el-dialog>
    </div>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_laoWu_YT                beforeMount()
    添加项目结算条目: create_laoWu_FH           onSubmitAdd()
    更新结算状态: update_fen_status_FH   onSubmitStatus()
    查看所有结算: read_laoWuTotal_FH     onNewDialog()
    查看工人结算: read_laoWuTeam_FH      onSubmitFenView()
    修改工人结算: update_laoWuTeam_FH    submitHisEdit()
    添加工人结算: create_laoWuTeam_FH    onSubmitFenAdd()
    修改分包属性: update_fen_type_FH     onSubmitEdit()
-->
<script>
  import { createLaoWu, getLaoWus, getLaoWu, updateLaoWu } from '../../../api/laoWu'
  import { getLwDetails, createLwDetail, updateLwDetail, getLwDetail } from '../../../api/lwDetail'
  import { MessageLwDetail } from '../../../api/lwDetail'
  import { replyRes } from '../../../utils/res'
  import { getProjects } from '../../../api/project'
  import { parseTime } from '../../../utils'

  const defaultRuleForm = {
    project_id: null,
    fen_type: null,
    fen_mode: null,
    work_num: null,
    arr: {}
    // repay_cost: null,
    // repay_p_cost: null,
  }

  const defaultRuleFenform = {
    lw_id: null,
    repay_cost: null,
    work_num: null,
    fen_team: '',
    project_id: null
  }
  export default {
    name: 'laoWu',
    data() {
      return {
        dialogVisible: false,
        dialogEdit: false,
        dialogAdd: false,
        isAdd: false,
        dialog: false, // 计算记录
        // dialogAddFen: false, // 分包记录显示
        list: [],
        fList: {},
        ruleForm: Object.assign({}, defaultRuleForm),
        ruleEdit: Object.assign({}, defaultRuleForm),
        ruleFormFen: Object.assign({}, defaultRuleFenform),
        searchForm: {
          fen_type: null,
          fen_mode: null,
          start_at: null,
          end_at: null,
          time: [],
          branch_id: 5,
          page: 1,
          pageSize: 10,
          totalCount: 1
        },
        message: {},
        fenBao: [
          { id: null, name: '全部' },
          { id: 0, name: '外包' },
          { id: 1, name: '外协' }
        ],
        closeWay: [
          { id: null, name: '全部' },
          { id: 0, name: '总价' },
          { id: 1, name: '单价' },
          { id: 2, name: '劳务' }
        ],
        fenModel: [
          { id: null, name: '全部' },
          { id: 0, name: '分包总价' },
          { id: 1, name: '分包单价' },
          { id: 2, name: '劳务单价' }
        ],
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
        loading: {
          project: false
        },
        rules: {
          fen_team: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          repay_cost: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          work_num: [
            { required: true, message: '请输入', trigger: 'blur' }
          ]
        },
        projects: {}
      }
    },
    filters: {
      parseTime: function(value) {
        if (value === null) {
          return '_________'
        }
        return parseTime(value, '{y}-{m}-{d}')
      },
      parseWay: function(value) {
        if (value === 0) {
          return '总价'
        }
        if (value === 1) {
          return '单价'
        }
        if (value === 0) {
          return '劳务'
        }
        return value
      },
      parseType: function(value) {
        if (value === 0) {
          return '外包'
        }
        if (value === 1) {
          return '外协'
        }
        return value
      },
      parseMode: function(value) {
        if (value === 0) {
          return '分包总价'
        }
        if (value === 1) {
          return '分包单价'
        }
        if (value === 2) {
          return '劳务单价'
        }
        return value
      },
      parseStatus: function(value) {
        if (value === 0) {
          return '未结算'
        }
        if (value === 1) {
          return '部分结算'
        }
        if (value === 2) {
          return '结算完成'
        }
        return value
      },
      parseArr: function(value) {
        if (value !== null) {
          return value
        }
        return '没有数据'
      }
    },
    mounted() {
      this.fetchLaoWus()
    },
    methods: {
      // /** 鼠标点击事件类 */
      // /** 查看结算统计 */
      // onNewDialog(item) {
      //   /** 权限检查 */
      //   if (this.actionCheck_.actionCheck('read_laoWuTotal_YT#') === false) {
      //     this.$message.error('错误提示,您没有该操作的权限!')
      //     return false
      //   }
      //   if (item.arr === undefined) {
      //     this.fetchMessageLwDetail(item)
      //     console.log('-----')
      //   } else {
      //     item.showVisible = !item.showVisible
      //   }
      // },
      // 创建项目结算条目
      onSubmitAdd() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('create_laoWu_YT#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.dialogVisible = true
      },
      // 修改分包
      onSubmitEdit(item) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_fen_type_YT#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.dialogEdit = true
        this.fetchLaoWu(item.id)
      },
      // 修改结算状态
      onSubmitStatus(item) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_fen_status_YT#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        return this.$confirm('此操作将改变结算状态,是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(res => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          const status = item.fen_status === 1 ? item.fen_status = 2 : item.fen_status = 1
          updateLaoWu({ id: item.id, fen_status: status }).then(res => {
            console.log(res)
            this.fetchLaoWus()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          })
        })
      },
      // // 添加工人结算记录
      // onSubmitFenAdd(item) {
      //   /** 权限检查 */
      //   if (this.actionCheck_.actionCheck('create_laoWuTeam_YT#') === false) {
      //     this.$message.error('错误提示,您没有该操作的权限!')
      //     return false
      //   }
      //   this.ruleFormFen = Object.assign({}, defaultRuleFenform)
      //   // this.fetchLwDetails(item)
      //   this.isAdd = false
      //   this.ruleFormFen.lw_id = item.id
      //   this.ruleFormFen.project_id = item.project.id
      //   this.dialogAdd = true
      // },
      // 查看结算统计中的分包结算记录
      // onSubmitFenView(item, id) {
      //   /** 权限检查 */
      //   if (this.actionCheck_.actionCheck('read_laoWuTeam_YT#') === false) {
      //     this.$message.error('错误提示,您没有该操作的权限!')
      //     return false
      //   }
      //   this.dialog = true
      //   this.fetchLwDetails(item, id)
      // },
      // 修改结算记录按钮被点击事件
      submitHisEdit(item) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_laoWuTeam_YT#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.isAdd = true
        this.dialogAdd = true
        this.fetchLwDetail(item.id)
      },
      fetchLaoWus() {
        return getLaoWus(this.searchForm).then(res => {
          this.list = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      fetchLwDetail(id) {
        getLwDetail({ id: id }).then(res => {
          this.ruleFormFen = res.data
        })
      },
      // 获取分包统计
      fetchMessageLwDetail(item) {
        MessageLwDetail({ lw_id: item.id }).then(res => {
          this.$set(item, 'arr', res.data)
          this.$set(item, 'showVisible', true)
        })
      },
      // 获取分包操作记录
      fetchLwDetails(item, id) {
        getLwDetails({ fen_team: item, lw_id: id }).then(res => {
          this.fList = res.data._items
        })
      },
      fetchLaoWu(id) {
        getLaoWu({ id: id }).then(res => {
          this.ruleEdit = res.data
        })
      },
      submitAdd() {
        this.dialogVisible = false
        createLaoWu(this.ruleForm).then(res => {
          if (replyRes(res)) {
            this.fetchLaoWus()
          }
        })
      },
      submitEdit() {
        this.dialogEdit = false
        updateLaoWu(this.ruleEdit).then(res => {
          if (replyRes(res)) {
            this.fetchLaoWus()
          }
        })
      },
      /** 远程搜索客户列表方法 */
      remoteMethod(query) {
        this.loading.customers = true
        let params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getProjects(params).then(res => {
          this.projects = res.data._items
          this.loading.customers = false
        })
      },
      // 一页多少行
      handleSizeChange(pageSize) {
        this.searchForm.pageSize = pageSize
        this.fetchLaoWus()
      },
      // 翻页
      handlePageChange(currentPage) {
        this.searchForm.page = currentPage
        this.fetchLaoWus()
      },
      onSubmitSearch() {
        if (this.searchForm.time !== null && this.searchForm.time.length > 0) {
          this.searchForm.start_at = this.searchForm.time[0] / 1000
          this.searchForm.end_at = this.searchForm.time[1] / 1000
        } else {
          this.searchForm.start_at = null
          this.searchForm.end_at = null
        }
        this.fetchLaoWus()
      },
      submitFen(formName) {
        this.dialogAdd = false
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.isAdd === false) {
              return createLwDetail(this.ruleFormFen).then(res => {
                if (replyRes(res)) {
                  // this.fetchLaoWus()
                }
              }).then(res => {
                updateLaoWu({ id: this.ruleFormFen.lw_id, fen_status: 1 }).then(res => {
                  this.fetchLaoWus()
                })
              })
            } else {
              console.log('__', formName)
              updateLwDetail(this.ruleFormFen).then(res => {
                if (replyRes(res)) {
                  this.ruleFormFen.project_id = formName.project_id
                  this.fetchLwDetails(this.ruleFormFen.fen_team, this.ruleFormFen.lw_id)
                  this.fetchLaoWus()
                }
              })
            }
          } else {
            return false
          }
        })
      },
      onSubmitCheck() {
        this.$router.push({ path: '/market/laoWuHistory' })
      },
      /** -------- 表格样式设置方法 -------- */
      rowStyle() {
        return 'height: 25px'
      },
      cellStyle() {
        return 'padding: 2px'
      }
    },
    // 页面权限检查 如无权限则跳转至404
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_laoWu_YT#') === false) {
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
