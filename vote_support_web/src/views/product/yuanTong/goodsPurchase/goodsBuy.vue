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
            <el-radio-button label="有效"></el-radio-button>
            <el-radio-button label="无效"></el-radio-button>
            <el-radio-button label="最近操作"></el-radio-button>
            <el-badge :value="waitApplyCount" class="item">
            <el-radio-button label="待审批"></el-radio-button>
            </el-badge>
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
      <el-table-column prop="id" label="ID" width="50" align="center" ></el-table-column>
      <el-table-column label="项目名称"  align="center" min-width="250">
        <template slot-scope="scope">{{scope.row.project.name}}</template>
      </el-table-column>
      <el-table-column label="部门" width="150" align="center">
        <template slot-scope="scope">{{scope.row.department.name}}</template>
      </el-table-column>
      <el-table-column label="申请人" width="100" align="center">
        <template slot-scope="scope">{{scope.row.user.name}}</template>
      </el-table-column>
      <!--<el-table-column prop="proposer_at" label="申购时间" width="100" :formatter="dateFormat" align="center"></el-table-column>-->
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
      <el-table-column prop="address" label="到货地点" width="100" align="center"></el-table-column>
      <el-table-column prop="unit" label="单元" width="100" align="center"></el-table-column>
      <el-table-column prop="content" label="备注" width="100" align="center"></el-table-column>
      <el-table-column label="操作" width="100" align="center" fixed="right" v-if="isShowBtn">
        <template slot-scope="scope">
          <el-button type="primary" @click="onclickFirApproval(scope.row)" size="mini" icon="el-icon-edit">审核</el-button>
        </template>
      </el-table-column>
      <el-table-column label="添加报价比选" width="120" align="center" fixed="right" v-if="isShowAdd">
        <template slot-scope="scope">
          <el-button type="primary" @click="onclickAddOffer(scope.row)" size="mini" icon="el-icon-plus">报价汇总</el-button>
          <!--<el-button type="primary" @click="onclickEditOffer(scope.row)" size="mini" icon="el-icon-edit" v-else>修改报价</el-button>-->
        </template>
      </el-table-column>
      <el-table-column label="报销申请" width="135" align="center" fixed="right" v-if="isShowAdd">
        <template slot-scope="scope">
          <el-button type="primary" @click="onclickPayApply(scope.row)" size="mini" icon="el-icon-plus">生成报销</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!--弹出窗口-->
  <div class="first">
    <el-dialog
      title="一级审批"
      :visible.sync="firstDialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" size="mini">
        <el-form-item label="审批状态" prop="first_state">
          <el-radio v-model.number="ruleForm.first_state" :label="1">已审核</el-radio>
          <el-radio v-model.number="ruleForm.first_state" :label="2">已驳回</el-radio>
        </el-form-item>
        <el-form-item label="审批意见" prop="first_content">
          <el-input v-model="ruleForm.first_content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="firstDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onSubmitWorkerApply('ruleForm')" size="mini">提 交</el-button>
        </span>
    </el-dialog>
  </div>
  <div class="second">
    <el-dialog
      title="二级审批"
      :visible.sync="secondDialogVisible"
      width="30%"
      :before-close="handleClose">
      <div style="color: red">提示:请先填写报价汇总,一旦修改审批状态,你将不能修改和添加</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" size="mini">
        <el-form-item label="审批状态" prop="second_state">
          <el-radio v-model.number="ruleForm.second_state" :label="1">已审核</el-radio>
          <el-radio v-model.number="ruleForm.second_state" :label="2">已驳回</el-radio>
        </el-form-item>
        <el-form-item label="到货地点" prop="address">
          <el-input v-model="ruleForm.address"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="ruleForm.unit"></el-input>
        </el-form-item>
        <el-form-item label="合同量" prop="contact_num">
          <el-input v-model.number="ruleForm.contact_num" type="number"></el-input>
        </el-form-item>
        <el-form-item label="已购量" prop="get_num">
          <el-input v-model.number="ruleForm.get_num" type="number"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="ruleForm.brand"></el-input>
        </el-form-item>
        <el-form-item label="审批意见" prop="second_content">
          <el-input v-model="ruleForm.second_content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="secondDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onSubmitWorkerApply('ruleForm')" size="mini">提 交</el-button>
        </span>
    </el-dialog>
  </div>
  <div class="three">
    <el-dialog
      title="三级审批"
      :visible.sync="threeDialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" size="mini">
        <el-form-item label="审批状态" prop="three_state">
          <el-radio v-model.number="ruleForm.three_state" :label="1">已审核</el-radio>
          <el-radio v-model.number="ruleForm.three_state" :label="2">已驳回</el-radio>
        </el-form-item>
        <el-form-item label="审批意见" prop="three_content">
          <el-input v-model="ruleForm.three_content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="threeDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onSubmitWorkerApply('ruleForm')" size="mini">提 交</el-button>
        </span>
    </el-dialog>
  </div>
  <div class="four">
    <el-dialog
      title="四级审批"
      :visible.sync="fourDialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" size="mini">
        <el-form-item label="审批状态" prop="fourth_state">
          <el-radio v-model.number="ruleForm.fourth_state" :label="1">已审核</el-radio>
          <el-radio v-model.number="ruleForm.fourth_state" :label="2">已驳回</el-radio>
        </el-form-item>
        <el-form-item label="审批意见" prop="fourth_content">
          <el-input v-model="ruleForm.fourth_content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="fourDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onSubmitWorkerApply('ruleForm')" size="mini">提 交</el-button>
        </span>
    </el-dialog>
  </div>
  <div class="addOffer">
    <el-dialog
      title="报价汇总"
      :visible.sync="addOfferDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form :model="offerForm" ref="offerForm" label-width="90px" size="mini">
        <el-row>
          <el-col :span="11">
            <el-form-item label="供货商名称" prop="supply_name">
              <el-input v-model="offerForm.supply_name"></el-input>
            </el-form-item>
            <el-form-item label="品名" prop="grade">
              <el-input v-model="offerForm.grade"></el-input>
            </el-form-item>
            <el-form-item label="品牌" prop="brand">
              <el-input v-model="offerForm.brand"></el-input>
            </el-form-item>
            <el-form-item label="型号" prop="model_name">
              <el-input v-model="offerForm.model_name"></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="num">
              <el-input v-model.number="offerForm.num" type="number"></el-input>
            </el-form-item>
            <el-form-item label="单价" prop="price">
              <el-input v-model="offerForm.price"></el-input>
            </el-form-item>
            <el-form-item label="是否交税" prop="tax_state">
              <el-radio v-model.number="offerForm.tax_state" :label="1">是</el-radio>
              <el-radio v-model.number="offerForm.tax_state" :label="2">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="是否含运" prop="transport_state">
              <el-radio v-model.number="offerForm.transport_state" :label="1">是</el-radio>
              <el-radio v-model.number="offerForm.transport_state" :label="2">否</el-radio>
            </el-form-item>
            <el-form-item label="付款方式" prop="pay_way">
             <el-input v-model="offerForm.pay_way"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contact_name">
              <el-input v-model="offerForm.contact_name"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="tellphone">
              <el-input v-model.number="offerForm.tellphone" type="number"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="content">
              <el-input v-model="offerForm.content"></el-input>
            </el-form-item>
            <el-form-item label="审核日期" prop="leader_at">
              <el-date-picker
                v-model="offerForm.give_at"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addOfferDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onSubmitAddOffer('offerForm')" size="mini">提 交</el-button>
      </span>
    </el-dialog>
  </div>
  <div class="payApply">
    <el-dialog
      title="报销申请"
      :visible.sync="payApplyDialogVisible"
      width="30%">
      <el-form :model="payApplyForm" ref="offerForm" label-width="90px" size="mini">
        <el-form-item label="金额" prop="money">
          <el-input v-model.number="payApplyForm.money" type="number"></el-input>
        </el-form-item>
        <el-form-item label="凭证号" prop="proof_no">
          <el-input v-model="payApplyForm.proof_no" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="payApplyDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onSubmitPayApply('offerForm')" size="mini">提 交</el-button>
        </span>
    </el-dialog>
  </div>
</div>
</template>

<script>
  import { getBuyGoodsApplys, getBuyGoodsApply, updateBuyGoodsApply, TotalBuyGoodsApply } from '../../../../api/buyGoodsApply'
  import { getProjects } from '../../../../api/project'
  import { getDepartments } from '../../../../api/department'
  import { replyRes } from '../../../../utils/res'
  import { parseTime } from '../../../../utils'
  import { getBuyGoodsConfigs } from '../../../../api/buyGoodsConfig'
  import { createPriceForm } from '../../../../api/priceForm'
  import { createGoods } from '../../../../api/costGoods'

  const searchForm = {
    expand: 'project,user,department,priceForm',
    page: 1,
    pageSize: 10,
    totalCount: 0,
    valid: 1,
    time: [],
    product_name: '',
    project_name: ''
  }
  const defaultRuleForm = {
    project_id: null,
    department_id: null,
    proposer_id: null, // 申请人ID
    product_name: '', // 产品名称
    version: '', // 版本型号
    params_config: '', // 参数配置
    need_at: null, // 需求日期
    address: '', // 到货地点
    unit: '', // 单位
    contact_num: null, // 合同量
    get_num: null, // 已购量
    brand: '', // 品牌
    content: '', // 备注
    first_content: '',
    first_state: 1,
    second_state: 1,
    second_content: '',
    three_state: 1,
    three_content: '',
    fourth_state: 1,
    fourth_content: '',
    first_at: null,
    second_at: null,
    three_at: null,
    fourth_at: null
  }

  const defaultOfferRuleForm = {
    supply_name: '', // 供货商名称
    grade: '', // 品名
    brand: '', // 品牌
    model_name: '', // 型号
    num: null, // 数量
    give_at: null, // 交期
    tax_state: null, // 是否含税
    transport_state: null, // 是否含运
    pay_way: '', // 付款方式
    contact_name: '', // 联系人
    tellphone: null,
    content: '', // 备注
    bga_id: null,
    price: '' // 单价
  }
  const defaultPayApplyForm = {
    date: parseInt(new Date().getTime() / 1000),
    pro_number: '',
    pro_name: '',
    cost_user_id: null,
    type_id: null,
    money: null,
    use: '',
    proof: '',
    sbj_id: null,
    sbjR_id: null,
    note: '',
    pro_id: null,
    input_user_id: null
  }
  export default {
    name: 'buyGoodsApply',
    data() {
      return {
        firstDialogVisible: false,
        secondDialogVisible: false,
        threeDialogVisible: false,
        fourDialogVisible: false,
        addOfferDialogVisible: false,
        payApplyDialogVisible: false,
        isShowValid: '有效',
        list: [],
        rules: {
          first_state: [
            { required: true, message: '请选择审批状态', trigger: 'blur' }
          ],
          second_state: [
            { required: true, message: '请选择审核状态', trigger: 'blur' }
          ],
          three_state: [
            { required: true, message: '请选择审批状态', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请填写到货地点', trigger: 'blur' }
          ],
          unit: [
            { required: true, message: '请填写单位', trigger: 'blur' }
          ],
          contact_num: [
            { required: true, message: '请填写合同量', trigger: 'blur' }
          ],
          get_num: [
            { required: true, message: '请填写已购量', trigger: 'blur' }
          ],
          brand: [
            { required: true, message: '请填写品牌', trigger: 'blur' }
          ],
          fourth_state: [
            { required: true, message: '请选择审核状态', trigger: 'blur' }
          ],
          first_content: [
            { required: true, message: '请填写审批备注', trigger: 'blur' }
          ],
          second_content: [
            { required: true, message: '请填写审批备注', trigger: 'blur' }
          ],
          three_content: [
            { required: true, message: '请填写审批备注', trigger: 'blur' }
          ],
          fourth_content: [
            { required: true, message: '请填写审批备注', trigger: 'blur' }
          ]
        },
        searchForm: Object.assign({}, searchForm), // 赛选表单
        ruleForm: Object.assign({}, defaultRuleForm, { proposer_id: this.$store.getters.userId }),
        offerForm: Object.assign({}, defaultOfferRuleForm),
        payApplyForm: Object.assign({}, defaultPayApplyForm), // 报销申请表单
        loading: {
          project_name: false,
          department_name: false
        },
        project_name: {},
        department_name: {},
        applyer: this.$store.getters.name, // 申请人
        approval: [], // 所有审核人
        firstVisible: false,
        finish_status: 1, // 进度条状态
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
        waitApplyCount: null, // 待审批条数
        firstApproval: [],
        secondApproval: [],
        threeApproval: [],
        fourApproval: []
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
    computed: {
      /** 用于判断是否是审核人 */
      isShowBtn() {
        const userId = this.$store.getters.userId
        const ifHasUserId = this.approval.some(v => v.user_id === userId)
        return ifHasUserId
      },
      /** 获取用户是几级审核人*/
      isShowDifferentRuleForm() {
        const userId = this.$store.getters.userId
        const ifHasUserId = this.approval.filter(v => v.user_id === userId).map(v => v.level)
        return ifHasUserId
      },
      /** 判断是否显示生成报价汇总的按钮*/
      isShowAdd() {
        const userId = this.$store.getters.userId
        const ifHasUserId = this.approval.filter(v => v.user_id === userId).some(v => v.level === 2)
        return ifHasUserId
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
      /** 获取待申请条数*/
      fetchTotalBuyGoodsApply() {
        if (this.isShowBtn === false) {
          this.waitApplyCount = 0
          return false
        }
        TotalBuyGoodsApply({ waitMe: 1 }).then(res => {
          this.waitApplyCount = res.data
        })
      },
      /** 获取采购申请的一条数据*/
      fetchBuyGoodsApply(id) {
        getBuyGoodsApply({ id: id }).then(res => {
          this.ruleForm = res.data
          if (this.isShowDifferentRuleForm[0] === 1) {
            this.ruleForm.first_at = parseTime(Date.parse(new Date()), '{y}-{m}-{d}')
          }
          if (this.isShowDifferentRuleForm[0] === 2) {
            this.ruleForm.second_at = parseTime(Date.parse(new Date()), '{y}-{m}-{d}')
          }
          if (this.isShowDifferentRuleForm[0] === 3) {
            this.ruleForm.three_at = parseTime(Date.parse(new Date()), '{y}-{m}-{d}')
          }
          if (this.isShowDifferentRuleForm[0] === 4) {
            this.ruleForm.fourth_at = parseTime(Date.parse(new Date()), '{y}-{m}-{d}')
          }
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
        }).then(res => {
          this.fetchTotalBuyGoodsApply()
        })
      },
      /** 提交审批*/
      onSubmitWorkerApply(formName) {
        if (this.ruleForm.second_state === 1 && this.ruleForm.first_state === 0) {
          this.$message.error('待一级审核人审批')
          return false
        }

        if (this.ruleForm.three_state === 1 && this.ruleForm.second_state === 0) {
          this.$message.error('待二级级审核人审批')
          return false
        }

        if (this.ruleForm.fourth_state === 1 && this.ruleForm.three_state === 0) {
          this.$message.error('待三级级级审核人审批')
          return false
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            updateBuyGoodsApply(this.ruleForm).then(res => {
              if (replyRes(res)) {
                this.fetchBuyGoodsApplys()
              }
              this.firstDialogVisible = false
              this.secondDialogVisible = false
              this.threeDialogVisible = false
              this.fourDialogVisible = false
            })
          }
        })
      },
      /** 提交报价汇总*/
      onSubmitAddOffer() {
        this.addOfferDialogVisible = false
        createPriceForm(this.offerForm).then(res => {
          if (replyRes(res)) {
            this.fetchBuyGoodsApplys()
          }
        })
      },
      /** 搜索按钮**/
      onSubmitSearch() {
        this.fetchBuyGoodsApplys()
      },
      /** 重置按钮 **/
      onSubmitReset() {
        this.searchForm = Object.assign({}, searchForm)
        this.fetchBuyGoodsApplys()
      },
      /** 生成报销申请*/
      onSubmitPayApply() {
        this.payApplyDialogVisible = false
        return createGoods(this.payApplyForm).then(res => {
          if (replyRes(res)) {
            this.fetchBuyGoodsApplys()
          }
          return res
        }).then(res => {
          updateBuyGoodsApply({ id: res.data.bData.apply_id, state: 1 }).then(res => {
            console.log('是否生成报销申请', res)
          })
        })
      },
      /** 查看是否有效 **/
      onSubmitIsShoValid() {
        this.searchForm = Object.assign({}, searchForm)
        switch (this.isShowValid) {
          case '待审批' :
            this.searchForm.waitMe = 1
            break
          case '有效' :
            this.searchForm.valid = 1
            break
          case '无效' :
            this.searchForm.valid = 0
            break
          case '最近操作' :
            this.searchForm.Now = 1
            break
          default:
            break
        }
        this.fetchBuyGoodsApplys()
      },
      /** 审批按钮*/
      onclickFirApproval(item) {
        switch (this.isShowDifferentRuleForm[0]) {
          case 1 :
            this.firstDialogVisible = true
            break
          case 2 :
            this.secondDialogVisible = true
            break
          case 3 :
            this.threeDialogVisible = true
            break
          case 4 :
            this.fourDialogVisible = true
            break
          default:
            break
        }
        this.fetchBuyGoodsApply(item.id)
      },
      /** 生成报销申请*/
      onclickPayApply(item) {
        if (item.state === 1) {
          this.$message.error('已生成报销申请')
          return false
        }
        if (item.fourth_state === 0) {
          this.$message.error('审核未完成,不能生成报销申请')
          return false
        }
        this.payApplyForm = Object.assign(defaultPayApplyForm, { cost_user_id: item.proposer_id, type_id: 3, use: '源通公司物资采购',
          sbj_id: 2, sbjR_id: 2, note: '物资采购完成后自动生成', pro_id: item.project_id, apply_id: item.id })
        this.payApplyDialogVisible = true
      },
      /** 添加报价汇总 **/
      onclickAddOffer(item) {
        if (item.second_state !== 0) {
          this.$message.error('已审批或者已驳回不能继续操作')
        } else {
          this.addOfferDialogVisible = true
          this.offerForm.bga_id = item.id
        }
      },
      handleClose() {
        this.firstDialogVisible = false
        this.secondDialogVisible = false
        this.threeDialogVisible = false
        this.fourDialogVisible = false
        this.addOfferDialogVisible = false
        this.ruleForm = Object.assign({}, defaultRuleForm, { proposer_id: this.$store.getters.userId })
        this.offerForm = Object.assign({}, defaultOfferRuleForm)
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
        getDepartments(params).then(res => {
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
  .scope_approval .el-step__icon{
    width: 15px;
    height: 15px;
    font-size: 1px;
  }
  .element-table .el-table__expand-icon{
    background: #dee2f9;
  }
</style>
