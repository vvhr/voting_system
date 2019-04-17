<template>
    <div class="app-container">
      <div class="apply_header" style="background: #d3e8f1;padding-top: 5px;border-radius: 10px">
        <el-form size="mini" label-width="100px">
          <el-form-item label="搜索栏">
            <el-form  :model="searchForm" class="demo-form-inline" :inline="true" size="mini">
              <el-form-item label="">
                <el-date-picker
                  v-model="searchForm.time"
                  type="daterange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions2">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmitSearch">查询</el-button>
              </el-form-item>
            </el-form>
          </el-form-item>
          <el-form-item label="操作栏">
            <div style="display: flex;justify-content:flex-start">
              <el-button type="primary" icon="el-icon-plus" size="mini" @click="onSubmitWaitApproval">待审核</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="searchForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="searchForm.totalCount">
        </el-pagination>
      </div>
      <div class="element_table">
        <el-table
          :data="List"
          stripe
          border
          fit
          :status-icon="true"
          style="width: 100%"
          :row-style="rowStyle" :cell-style="cellStyle"
          size="mini">
          <el-table-column type="expand" label="审批" >
            <template slot-scope="scope">
              <div style="width: 70%;">
                <el-form size="mini" label-width="100px" width="">
                  <el-form-item label="审批进度">
                    <el-steps >
                      <el-step :title="scope.row.oneApproval.name" :status="scope.row.one_state | parseFinishStatus">
                        <div slot="description">审批状态:{{scope.row.first_state | parseState}}&emsp;<br>日期:{{scope.row.one_at | dateFormat}}备注:{{scope.row.one_content}}</div>
                      </el-step>
                      <el-step :title="scope.row.twoApproval.name" :status="scope.row.two_state | parseFinishStatus">
                        <div slot="description">审批状态:{{scope.row.two_state | parseState}}&emsp;<br>日期:{{scope.row.two_at | dateFormat}}备注:{{scope.row.two_content}}</div>
                      </el-step>
                      <el-step :title="scope.row.threeApproval.name" :status="scope.row.three_state | parseFinishStatus">
                        <div slot="description">审批状态:{{scope.row.three_state | parseState}}&emsp;<br>日期:{{scope.row.three_at | dateFormat}}备注:{{scope.row.three_content}}</div>
                      </el-step>
                      <el-step :title="scope.row.fourApproval.name" :status="scope.row.four_state | parseFinishStatus">
                        <div slot="description">审批状态:{{scope.row.four_state | parseState}}&emsp;<br>日期:{{scope.row.four_at | dateFormat}}备注:{{scope.row.four_content}}</div>
                      </el-step>
                    </el-steps>
                  </el-form-item>
                </el-form>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
          <el-table-column prop="project.name" label="项目名称" align="center"></el-table-column>
          <el-table-column prop="user.name" width="100" label="申请人" align="center"></el-table-column>
          <el-table-column  label="物资详情" align="center" width="120">
            <template slot-scope="sc">
              <el-popover trigger="hover" placement="top">
                <el-table
                  :data="sc.row.takeGoodsRelate"
                  stripe
                  border
                  fit
                  :status-icon="true"
                  style="width: 100%"
                  size="mini">
                  <el-table-column prop="goods_name" label="物资名称" ></el-table-column>
                  <el-table-column label="申请数量" width="200" >
                    <template slot-scope="item">
                      {{item.row.goods_num}}
                    </template>
                  </el-table-column>
                </el-table>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="success"  v-if="sc.row.takeGoodsRelate.length > 0">物资详情</el-tag>
                  <el-tag size="medium" type="danger"  v-else>未添加物资</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="content" width="100" align="center"></el-table-column>
          <el-table-column label="需求时间" prop="need_at" :formatter="dateFormat" width="100" align="center"></el-table-column>
          <el-table-column label="操作" width="200" align="center" fixed="right" v-if="comApproval">
            <template slot-scope="scope">
              <el-button type="success" @click="onclickChangeState({ id: scope.row.id, level: comApprovalLevel[0], agree: true })" icon="el-icon-success" size="mini" >同意</el-button>
              <el-button type="danger" @click="onclickChangeState({ id: scope.row.id, level: comApprovalLevel[0], agree: false })" icon="el-icon-error" size="mini">不同意</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="input_goods1">
        <el-dialog
          title="录入物资"
          :visible.sync="addGoodsVisible"
          width="30%"
          :before-close="handleClose">
          <el-form :model="ruleForm" ref="ruleForm" label-width="80px" size="mini">
            <el-form-item label="申请数量" prop="goods_num">
              <el-input v-model.number="ruleForm.ApprovalContent" type="number"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="addGoodsVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onSubmitNotAgree('ruleForm')" size="mini">提 交</el-button>
        </span>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import { replyRes } from '../../../utils/res'
  import { parseTime } from '../../../utils'
  import { getProjects } from '../../../api/project'
  import { getTakeGoods, updateTakeGoods } from '../../../api/takeGoods'
  import { updateTakeGoodsRelate } from '../../../api/takeGoodsRelate'
  import { getBuyGoodsConfigs } from '../../../api/buyGoodsConfig'

  const defaultRuleForm = {
    ApprovalContent: ''
  }
  const searchForm = {
    expand: 'user,project,oneApproval,twoApproval,threeApproval,fourApproval,takeGoodsRelate,goods',
    page: 1,
    pageSize: 10,
    totalCount: 0,
    time: []
  }
  export default {
    name: 'approvalSet',
    data() {
      return {
        searchForm: Object.assign({}, searchForm),
        ruleForm: Object.assign({}, defaultRuleForm),
        isGoods_num: true,
        List: [],
        addGoodsVisible: false,
        projectList: [],
        goodsList: [],
        loading: {
          project_name: false,
          goods_name: false
        },
        goods: [],
        goodsName: [],
        approval: [],
        firstApproval: [],
        secondApproval: [],
        threeApproval: [],
        fourApproval: [],
        items: {}, // 用于不同意时,保存scope.row传过来的值
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
      comApproval() {
        const userId = this.$store.getters.userId
        const visible = this.approval.some(v => v.user_id === userId)
        return visible
      },
      comApprovalLevel() {
        const userId = this.$store.getters.userId
        const level = this.approval.filter(v => v.user_id === userId).map(v => v.level)
        return level
      }
    },
    methods: {
      /** 提交修改的物资*/
      onSubmitChangeGoodsNum(item) {
        updateTakeGoodsRelate({ id: item.id, goods_num: item.goods_num }).then(res => {
          if (replyRes(res)) {
            item.edit = true
            this.fetchTakeGoods()
          }
        })
      },
      onSubmitSearch() {
        this.fetchTakeGoods()
      },
      onSubmitNotAgree() {
        updateTakeGoods(this.items).then(res => {
          if (replyRes(res)) {
            this.addGoodsVisible = false
            this.fetchTakeGoods()
          }
        })
      },
      /** 待审核*/
      onSubmitWaitApproval() {
        this.fetchTakeGoods()
      },
      /** 状态修改*/
      onclickChangeState(item) {
        if (item.agree === false) {
          this.items = item
          this.addGoodsVisible = true
        } else {
          updateTakeGoods(item).then(res => {
            if (replyRes(res)) {
              console.log('__', res)
              this.fetchTakeGoods()
            }
          })
        }
      },
      /** 获取仓库代表*/
      fetchTakeGoods() {
        getTakeGoods(this.searchForm).then(res => {
          this.List = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      /** 获取各个等级的审核人*/
      fetBuyGoodsConfigs() {
        return getBuyGoodsConfigs({ expand: 'user' }).then(res => {
          this.approval = res.data._items
          this.firstApproval = this.approval.filter(v => v.level === 1)
          this.secondApproval = this.approval.filter(v => v.level === 2)
          this.threeApproval = this.approval.filter(v => v.level === 3)
          this.fourApproval = this.approval.filter(v => v.level === 4)
        })
      },
      handleSizeChange(val) {
        this.searchForm.pageSize = val
        this.fetchTakeGoods()
      },
      handleCurrentChange(val) {
        this.searchForm.page = val
        this.fetchTakeGoods()
      },
      handleClose() {
        this.addGoodsVisible = false
      },
      /** -------- 表格样式设置方法 -------- */
      rowStyle() {
        return 'height: 25px'
      },
      cellStyle() {
        return 'padding: 2px'
      },
      /** table表格日期格式化 */
      dateFormat(row, column) {
        if (row === null) {
          return '暂无'
        }
        return parseTime(row[column.property], '{y}-{m}-{d}')
      },
      /** 远程搜索客户列表方法 */
      remoteMethod(query) {
        this.loading.project_name = true
        let params = {}
        if (query !== null && query.trim() !== '') {
          params = { name: query.trim() }
        }
        getProjects(Object.assign(params, { branch_id: 5 })).then(res => {
          this.projectList = res.data._items
          this.loading.project_name = false
        })
      }
    },
    mounted() {
      this.fetchTakeGoods()
      this.fetBuyGoodsConfigs()
    },
    filters: {
      parseFinishStatus: function(value) {
        if (value === 1) {
          return 'success'
        }
        if (value === 2) {
          return 'error'
        }
        return 'process'
      },
      parseState: function(value) {
        if (value === 1) {
          return '同意'
        }
        if (value === 2) {
          return '不同意'
        }
        return '未审核'
      },
      /** table表格日期格式化 */
      dateFormat(value) {
        if (value === null) {
          return '_________'
        }
        return parseTime(value, '{y}-{m}-{d}')
      }
    }
  }
</script>

<style scoped>

</style>

<style>
  .apply_header .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 6px;
  }
  .element-table .el-table__expand-icon{
    background: #dee2f9;
  }
</style>
