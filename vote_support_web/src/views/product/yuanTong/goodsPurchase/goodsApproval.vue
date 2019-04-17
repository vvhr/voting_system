<template>
<div class="app-container">
  <div class="apply_header" style="background: #d3e8f1;padding: 5px 0 5px 0;border-radius: 10px">
    <el-form size="mini" label-width="100px">
      <el-form-item label="搜索栏">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
          <el-form-item label="">
            <el-input v-model="searchForm.project_name" placeholder="项目名称关键字"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="searchForm.product_name" placeholder="产品名称关键字"></el-input>
          </el-form-item>
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
            <el-button type="primary" @click="onSubmitReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="操作栏">
        <div style="display: flex;justify-content:flex-start">
          <el-radio-group v-model="isShowValid" @change="onSubmitIsShoValid" style="height: 28px;" size="small">
            <el-radio-button label="创建申请"></el-radio-button>
            <el-radio-button label="有效"></el-radio-button>
            <el-radio-button label="无效"></el-radio-button>
          </el-radio-group>
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
  <div class="element-table">
    <el-table
      :data="list"
      stripe border fit :status-icon="true"
      style="width: 100%"
      :row-style="rowStyle" :cell-style="cellStyle" size="mini">
      <el-table-column type="expand" label="审批" id="element-table-tr">
        <template slot-scope="scope">
          <div style="width: 70%;">
            <el-form size="mini" label-width="100px" width="">
              <el-form-item label="审批进度">
                <el-steps >
                  <el-step :title="firstApproval[0].user" :status="scope.row.first_state | parseFinishStatus">
                    <div slot="description">审批状态:{{scope.row.first_state | parseState}}&emsp;<br>日期:{{scope.row.first_at | dateFormat}}备注:{{scope.row.first_content}}</div>
                  </el-step>
                  <el-step :title="secondApproval[0].user" :status="scope.row.second_state | parseFinishStatus">
                    <div slot="description">审批状态:{{scope.row.second_state | parseState}}&emsp;<br>日期:{{scope.row.second_at | dateFormat}}备注:{{scope.row.second_content}}</div>
                  </el-step>
                  <el-step :title="threeApproval[0].user" :status="scope.row.three_state | parseFinishStatus">
                    <div slot="description">审批状态:{{scope.row.three_state === 0 ? '未询价' : '已询价'}}&emsp;<br>日期:{{scope.row.three_at | dateFormat}}备注:{{scope.row.three_content}}</div>
                  </el-step>
                  <el-step :title="fourApproval[0].user" :status="scope.row.fourth_state | parseFinishStatus">
                    <div slot="description">审批状态:{{scope.row.fourth_state | parseState}}&emsp;<br>日期:{{scope.row.fourth_at | dateFormat}}备注:{{scope.row.fourth_content}}</div>
                  </el-step>
                  <el-step title="生成报销申请" :status="scope.row.state === 1 ? 'success' : 'process'">
                    <div slot="description">{{scope.row.state === 1 ? '已生成物资报销申请' : '未生成基础报销'}}</div>
                  </el-step>
                </el-steps>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
      <el-table-column label="项目名称"  align="center">
        <template slot-scope="scope">{{scope.row.project.name}}</template>
      </el-table-column>
      <el-table-column label="部门" width="150" align="center">
        <template slot-scope="scope">{{scope.row.department.name}}</template>
      </el-table-column>
      <el-table-column label="申请人" width="100" align="center">
        <template slot-scope="scope">{{scope.row.user.name}}</template>
      </el-table-column>
      <el-table-column label="产品相关"  align="center" width="100">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>产品名称: {{ scope.row.product_name }}</p>
            <p>产品品牌: {{ scope.row.brand }}</p>
            <p>规格型号: {{ scope.row.version }}</p>
            <p>参数配置: {{ scope.row.params_config }}</p>
            <p>合同数量: {{ scope.row.contact_num }}</p>
            <p>申请数量: {{ scope.row.not_num }}</p>
            <p>已购数量: {{ scope.row.get_num }}</p>
            <p>申购日期: {{ scope.row.proposer_at | dateFormat}}</p>
            <p>需求日期: {{ scope.row.need_at | dateFormat}}</p>
            <div slot="reference" class="name-wrapper" size="mini">
              <el-tag size="medium">产品相关</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="报价汇总"  align="center" width="100">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <el-table
              :data="scope.row.priceForm"
              stripe border fit :status-icon="true"
              style="width: 100%"
              :row-style="rowStyle" :cell-style="cellStyle" size="mini">
              <el-table-column label="供货商"  align="center" prop="supply_name"></el-table-column>
              <el-table-column label="品名"  align="center" prop="grade" ></el-table-column>
              <el-table-column label="品牌"  align="center" prop="brand" ></el-table-column>
              <el-table-column label="型号"  align="center" prop="model_name"></el-table-column>
              <el-table-column label="数量"  align="center" prop="model_name"></el-table-column>
              <el-table-column label="联系人"  align="center" prop="contact_name"></el-table-column>
              <el-table-column label="电话"  align="center" width="200" prop="tellphone"></el-table-column>
              <el-table-column label="交期"  align="center" prop="give_at" width="100" :formatter="dateFormat"></el-table-column>
              <el-table-column label="是否含税"  align="center">
                <template slot-scope="tax_state">{{scope.row.tax_state === 0 ? '否' : '是'}}</template>
              </el-table-column>
              <el-table-column label="是否含运"  align="center">
                <template slot-scope="tax_state">{{scope.row.transport_state === 0 ? '否' : '是'}}</template>
              </el-table-column>
            </el-table>
            <div slot="reference" class="name-wrapper" size="mini">
              <el-tag size="medium">报价汇总</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!--<el-table-column prop="product_name" label="产品名称" width="100" align="center" ></el-table-column>-->
      <!--<el-table-column prop="version" label="规格型号" width="100" align="center"></el-table-column>-->
      <!--<el-table-column prop="params_config" label="参数配置" width="100" align="center"></el-table-column>-->
      <el-table-column prop="address" label="到货地点" width="100" align="center"></el-table-column>
      <el-table-column prop="unit" label="单元" width="100" align="center"></el-table-column>
      <!--<el-table-column prop="contact_num" label="合同量" width="100" align="center"></el-table-column>-->
      <!--<el-table-column prop="get_num" label="已购量" width="100" align="center"></el-table-column>-->
      <!--<el-table-column prop="brand" label="品牌" width="100" align="center" v-if="checkList.isShowBrand"></el-table-column>-->
      <el-table-column prop="content" label="备注" width="100" align="center"></el-table-column>
      <!--<el-table-column prop="proposer_at" label="申购日期" width="100" :formatter="dateFormat" align="center"></el-table-column>-->
      <!--<el-table-column prop="need_at" label="需求日期" style="color: deepskyblue" :formatter="dateFormat" width="100" align="center" v-if="checkList.isShowNeedAt"></el-table-column>-->
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" @click="onclickEditApply(scope.row)" size="mini">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!--弹出窗口-->
  <div class="dialog_product_approval">
    <el-dialog
      :title="isEditApplyVisible === false ? '创建申请' : '修改申请'"
      :visible.sync="createApplyVisible"
      width="40%"
      :before-close="handleClose">
      <div style="color: red" v-if="isEditApplyVisible">开始审批之后不能修改</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" size="mini">
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
              v-for="item in project_name"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="申请人" prop="proposer_id">
              <el-select v-model="ruleForm.proposer_id"  prop="type" :disabled="true">
                <el-option :label="applyer" :value="this.$store.getters.userId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申购部门" prop="department_id">
              <el-select
                v-model.number="ruleForm.department_id"
                filterable
                remote
                reserve-keyword
                placeholder="关键词搜索，空格表示全部"
                :remote-method="remoteMethodDepart"
                :loading="loading.department_name"
                style="width: 100%">
                <el-option
                  v-for="item in department_name"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品名称" prop="product_name">
              <el-input v-model="ruleForm.product_name"></el-input>
            </el-form-item>
            <el-form-item label="规格名称" prop="version">
              <el-input v-model="ruleForm.version"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="参数配置" prop="params_config">
              <el-input v-model="ruleForm.params_config"></el-input>
            </el-form-item>
            <el-form-item label="申请量" prop="not_num">
              <el-input v-model.number="ruleForm.not_num" type="number"></el-input>
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
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="createApplyVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onSubmitApply('ruleForm')" size="mini">提 交</el-button>
        </span>
    </el-dialog>
  </div>
</div>
</template>

<script>
  import { getBuyGoodsApplys, getBuyGoodsApply, createBuyGoodsApply, updateBuyGoodsApply } from '../../../../api/buyGoodsApply'
  import { getProjects } from '../../../../api/project'
  import { getDepartments } from '../../../../api/department'
  import { replyRes } from '../../../../utils/res'
  import { parseTime } from '../../../../utils'
  import { getBuyGoodsConfigs } from '../../../../api/buyGoodsConfig'

  const searchForm = {
    expand: 'project,user,department',
    page: 1,
    pageSize: 10,
    totalCount: 0,
    valid: 1,
    time: [],
    product_name: '',
    proposer_id: null,
    project_name: ''
  }
  const defaultRuleForm = {
    project_id: null,
    department_id: null,
    proposer_id: null, // 申请人ID
    product_name: '', // 产品名称
    version: '', // 规格型号
    params_config: '', // 参数配置
    need_at: null, // 需求日期
    address: '', // 到货地点
    unit: '', // 单位
    contact_num: null, // 合同量
    get_num: null, // 已购量
    brand: '', // 品牌
    content: '', // 备注
    not_num: null
  }
  export default {
    name: 'buyGoodsApply',
    data() {
      return {
        createApplyVisible: false,
        isEditApplyVisible: false,
        isShowValid: '有效',
        list: [],
        rules: {
          project_id: [
            { required: true, message: '请选择项目', trigger: 'blur' }
          ],
          department_id: [
            { required: true, message: '请选择部门', trigger: 'blur' }
          ],
          product_name: [
            { required: true, message: '请填写项目名称', trigger: 'blur' }
          ],
          params_config: [
            { required: true, message: '请填写参数配置', trigger: 'blur' }
          ],
          need_at: [
            { required: true, message: '请填写需求日期', trigger: 'blur' }
          ],
          not_num: [
            { required: true, message: '请填写申请量', trigger: 'blur' }
          ],
          version: [
            { required: true, message: '请填写规格型号', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请填写备注', trigger: 'blur' }
          ]
        },
        approval: {},
        searchForm: Object.assign({}, searchForm, { proposer_id: this.$store.getters.userId }), // 赛选表单
        ruleForm: Object.assign({}, defaultRuleForm, { proposer_id: this.$store.getters.userId }),
        loading: {
          project_name: false,
          department_name: false
        },
        project_name: {},
        department_name: {},
        applyer: this.$store.getters.name, // 申请人
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
    mounted() {
      this.fetchBuyGoodsApplys()
      this.fetBuyGoodsConfigs()
    },
    filters: {
      /** table表格日期格式化 */
      dateFormat(value) {
        if (value === null) {
          return '_________'
        }
        return parseTime(value, '{y}-{m}-{d}')
      },
      parseState: function(value) {
        if (value === 1) {
          return '已审核'
        }
        if (value === 2) {
          return '已驳回'
        }
        return '未审核'
      },
      parseFinishStatus: function(value) {
        if (value === 1) {
          return 'success'
        }
        if (value === 2) {
          return 'error'
        }
        return 'process'
      }
    },
    methods: {
      /** 获取物资采购申请表*/
      fetchBuyGoodsApplys() {
        getBuyGoodsApplys(this.searchForm).then(res => {
          this.list = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      /** 获取采购申请的一条数据*/
      fetchBuyGoodsApply(id) {
        return getBuyGoodsApply({ id: id }).then(res => {
          this.ruleForm = res.data
          return this.ruleForm
        }).then(res => {
          getProjects({ branch_id: 5, id: res.project_id }).then(res => {
            this.project_name = res.data._items
            this.loading.project_name = false
          })
        })
      },
      /** 获取各个等级的审核人*/
      fetBuyGoodsConfigs() {
        return getBuyGoodsConfigs({ expand: 'user' }).then(res => {
          this.approval = res.data._items
        })
      },
      /** 提交申请*/
      onSubmitApply(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.isEditApplyVisible === false) {
              createBuyGoodsApply(this.ruleForm).then(res => {
                if (replyRes(res)) {
                  this.fetchBuyGoodsApplys()
                }
              })
            } else {
              this.ruleForm.isEdit = 1
              updateBuyGoodsApply(this.ruleForm).then(res => {
                if (replyRes(res)) {
                  this.fetchBuyGoodsApplys()
                }
              })
            }
            this.createApplyVisible = false
          }
        })
      },
      /** 搜索按钮**/
      onSubmitSearch() {
        this.fetchBuyGoodsApplys()
      },
      /** 重置按钮 **/
      onSubmitReset() {
        this.searchForm = Object.assign({}, searchForm, { proposer_id: this.$store.getters.userId })
        this.fetchBuyGoodsApplys()
      },
      /** 修改按钮**/
      onclickEditApply(item) {
        this.createApplyVisible = true
        this.isEditApplyVisible = true
        this.fetchBuyGoodsApply(item.id)
      },
      /** 查看是否有效 **/
      onSubmitIsShoValid() {
        this.searchForm = Object.assign({}, searchForm)
        switch (this.isShowValid) {
          case '创建申请' :
            this.isEditApplyVisible = false
            this.createApplyVisible = true
            break
          case '有效' :
            this.searchForm.valid = 1
            break
          case '无效' :
            this.searchForm.valid = 0
            break
          default:
            break
        }
        this.fetchBuyGoodsApplys()
      },
      handleClose() {
        this.createApplyVisible = false
        this.ruleForm = Object.assign({}, defaultRuleForm, { proposer_id: this.$store.getters.userId })
      },
      handleSizeChange(val) {
        this.searchForm.pageSize = val
        this.fetchBuyGoodsApplys()
      },
      handleCurrentChange(val) {
        this.searchForm.page = val
        this.fetchBuyGoodsApplys()
      },
      /** 远程搜索客户列表方法 */
      remoteMethod(query) {
        this.loading.project_name = true
        let params = {}
        if (query !== null && query.trim() !== '') {
          params = { name: query.trim() }
        }
        getProjects(Object.assign(params, { branch_id: 5 })).then(res => {
          this.project_name = res.data._items
          this.loading.project_name = false
        })
      },
      remoteMethodDepart(query) {
        this.loading.department_name = true
        let params = {}
        if (query !== null && query.trim() !== '') {
          params = { name: query.trim() }
        }
        getDepartments(Object.assign(params, { branch_id: 5 })).then(res => {
          this.department_name = res.data._items
          this.loading.department_name = false
        })
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
      }
    }
  }
</script>

<style scoped>

</style>
<style>
  .scope_approval .el-step__icon{
    width: 15px;
    height: 15px;
    font-size: 1px;
  }
  .scope_approval .el-step__title{
    font-size: 12px;
    line-height: 30px;
  }
  .apply_header .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 6px;
  }
  .element-table .el-table__expand-icon{
    background: #dee2f9;
  }
</style>
