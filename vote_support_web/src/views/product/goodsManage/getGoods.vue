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
              <el-button type="primary" @click="onClickCreate" icon="el-icon-plus" size="mini">领料申请</el-button>
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
                  <el-table-column label="库存量" width="100" >
                    <template slot-scope="item">
                      {{sc.row.goods.have_num}}
                    </template>
                  </el-table-column>
                  <el-table-column label="申请数量" width="200" >
                    <template slot-scope="item">
                      <div v-if="item.row.edit"> {{item.row.goods_num}}</div>
                      <div v-else>
                        <el-input v-model.number="item.row.goods_num" type="number" size="mini" style="width: 100px;" ></el-input>
                        <el-button @click="onclickChangeGoodsNum(item.row)" type="warning" size="mini" icon="el-icon-refresh" >取消</el-button>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120" v-if="sc.row.one_state === 0">
                    <template slot-scope="item" >
                      <el-button @click="onclickChangeGoodsNum(item.row)" type="primary" size="mini" icon="el-icon-edit" v-if="item.row.edit">修改</el-button>
                      <el-button @click="onSubmitChangeGoodsNum(item.row)" type="success" size="mini" icon="el-icon-edit" v-else>Ok</el-button>
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
          <el-table-column label="操作" width="100" align="center" fixed="right" >
            <template slot-scope="scope">
              <el-button type="primary" @click="onclickAddGoods(scope.row)" size="mini" v-if="scope.row.one_state === 0">添加物资</el-button>
              <el-button type="primary" @click="onclickAddGoods(scope.row)" size="mini" v-else disabled="">添加物资</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--录入物资表单-->
      <div class="input_goods">
        <el-dialog
          title="录入物资"
          :visible.sync="createApplyVisible"
          width="30%"
          :before-close="handleClose">
          <el-form :model="ruleForm" ref="ruleForm" label-width="80px" size="mini">
            <el-form-item label="项目名称" prop="project_id">
              <el-select
                v-model="ruleForm.project_id"
                filterable
                remote
                reserve-keyword
                placeholder="关键词搜索，空格表示全部"
                :remote-method="remoteMethod"
                :loading="loading.project_name"
                style="width: 100%">
                <el-option
                  v-for="item in projectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="content">
              <el-input v-model="ruleForm.content"></el-input>
            </el-form-item>
            <el-form-item label="需求日期" prop="need_at">
              <el-date-picker
                v-model="ruleForm.need_at"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="createApplyVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onSubmitCreate('ruleForm')" size="mini">提 交</el-button>
        </span>
        </el-dialog>
      </div>
      <div class="input_goods1">
        <el-dialog
          title="录入物资"
          :visible.sync="addGoodsVisible"
          width="30%"
          :before-close="handleClose">
          <el-form :model="goodsForm" ref="ruleForm" label-width="80px" size="mini">
            <el-form-item label="产品名称" prop="name">
              <el-select
                v-model="goodsForm.goods_id"
                filterable
                remote
                reserve-keyword
                placeholder="关键词搜索，空格表示全部"
                :remote-method="remoteMethodGoods"
                :loading="loading.goods_name"
                style="width: 100%">
                <el-option
                  v-for="item in goodsList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请数量" prop="goods_num">
              <el-input v-model.number="goodsForm.goods_num" type="number"></el-input>
            </el-form-item>
            <el-form-item label="剩余库存" >
              <el-input v-model="comHaveNum" disabled></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="addGoodsVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onSubmitAddGoods('ruleForm')" size="mini">提 交</el-button>
        </span>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import { replyRes } from '../../../utils/res'
  import { getGoods } from '../../../api/goods'
  import { parseTime } from '../../../utils'
  import { getProjects } from '../../../api/project'
  import { getTakeGoods, createTakeGoods } from '../../../api/takeGoods'
  import { createTakeGoodsRelate, updateTakeGoodsRelate } from '../../../api/takeGoodsRelate'

  const defaultRuleForm = {
    project_id: null,
    content: '',
    need_at: null
  }
  const goodsForm = {
    goods_id: null,
    goods_num: null,
    take_g_id: null
  }
  const searchForm = {
    expand: 'user,project,oneApproval,twoApproval,threeApproval,fourApproval,takeGoodsRelate,goods',
    page: 1,
    pageSize: 10,
    totalCount: 0,
    creater: null,
    time: []
  }
  export default {
    name: 'approvalSet',
    data() {
      return {
        searchForm: Object.assign({}, searchForm, { creater: this.$store.getters.userId }),
        ruleForm: Object.assign({}, defaultRuleForm),
        goodsForm: Object.assign({}, goodsForm),
        isGoods_num: true,
        List: [],
        createApplyVisible: false,
        addGoodsVisible: false,
        projectList: [],
        goodsList: [],
        loading: {
          project_name: false,
          goods_name: false
        },
        goods: [],
        goodsName: [],
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
      comHaveNum() {
        const num = this.goods.filter(v => v.id === this.goodsForm.goods_id).map(v => v.have_num)
        const sum = num[0] - this.goodsForm.goods_num
        if (sum < 0) {
          return '库存不足请前往源通电力模块的物资采购模块进行申请'
        }
        return sum
      }
    },
    methods: {
      /** 领料申请提交*/
      onSubmitCreate() {
        createTakeGoods(this.ruleForm).then(res => {
          if (replyRes(res)) {
            this.createApplyVisible = false
            this.fetchTakeGoods()
          }
        })
      },
      onSubmitAddGoods() {
        createTakeGoodsRelate(this.goodsForm).then(res => {
          if (replyRes(res)) {
            this.addGoodsVisible = false
            this.fetchTakeGoods()
          }
        })
      },
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
      /** 录入物资按钮*/
      onClickCreate() {
        this.createApplyVisible = true
      },
      /** 修改物资数量*/
      onclickChangeGoodsNum(item) {
        item.edit === false ? item.edit = true : item.edit = false
      },
      /** 添加物资*/
      onclickAddGoods(item) {
        this.goodsForm.take_g_id = item.id
        this.addGoodsVisible = true
      },
      /** 获取仓库代表*/
      fetchTakeGoods() {
        getTakeGoods(this.searchForm).then(res => {
          this.List = res.data._items.map(v => {
            v.takeGoodsRelate.map(val => {
              this.$set(val, 'edit', true)
              return val
            })
            return v
          })
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      fetchGoods() {
        getGoods().then(res => {
          this.goods = res.data._items
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
        this.createApplyVisible = false
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
      },
      remoteMethodGoods(query) {
        this.loading.goods_name = true
        let params = {}
        if (query !== null && query.trim() !== '') {
          params = { name: query.trim() }
        }
        getGoods(params).then(res => {
          this.goodsList = res.data._items
          this.loading.goods_name = false
        })
      }
    },
    mounted() {
      this.fetchTakeGoods()
      this.fetchGoods()
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
