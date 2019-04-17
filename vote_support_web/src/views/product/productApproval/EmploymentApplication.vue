<template>
  <div class="app-container">
    <!--头部阴影部分-->
    <div class="apply_header" style="background: #d3e8f1;padding-top: 5px;border-radius: 10px">
      <el-form size="mini" label-width="100px">
        <el-form-item label="搜索栏">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
            <el-form-item label="">
              <el-input v-model="searchForm.username" placeholder="申请人"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="searchForm.project_name" placeholder="项目名称关键字"></el-input>
            </el-form-item>
            <el-form-item label="">
              <!--<el-input v-model="searchForm.project_name" placeholder="分公司查询"></el-input>-->
              <el-select v-model.number="searchForm.branch_id" placeholder="活动区域">
                <el-option label="全部分公司" :value="null"></el-option>
                <el-option label="华建电力" :value="2"></el-option>
                <el-option label="富华电力" :value="3"></el-option>
                <el-option label="源通电力" :value="5"></el-option>
              </el-select>
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
            <download-excel
              name="申请报表"
              :data="downloadExcel"
              :fields = "json_fields">
              <el-button type="success" size="small" icon="el-icon-download" style="height: 30px">导出报表</el-button>
            </download-excel>
            <el-badge :value="waitApplyCount" class="item">
            <el-button type="primary" size="small" @click="onClickWaitApproval" icon="el-icon-search" style="margin-left: 10px;height: 30px" >待审批</el-button>
            </el-badge>
            <el-button type="primary" size="small" @click="onClickWaitPay" icon="el-icon-search" style="margin-left: 10px;height: 30px" v-if="isShowLastApproval">待申请付款</el-button>
            <el-button type="primary" size="small" @click="onSubmitSearch" icon="el-icon-search" style="margin-left: 10px;height: 30px;">查看全部</el-button>
            <el-button type="primary" size="small" @click="onSubmitValidSearch" icon="el-icon-search" style="margin: 0 10px 0 10px;height: 30px;">无效申请</el-button>
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
        :data="workerApplyList"
        stripe
        border
        fit
        :status-icon="true"
        style="width: 100%"
        :row-style="rowStyle" :cell-style="cellStyle" size="mini">
        <el-table-column label="审批" type="expand">
          <template slot-scope="scope">
            <el-form size="mini" label-width="100px">
              <el-form-item label="申请进度">
                <div class="scope_approval" style="width: 50%;">
                  <el-steps >
                    <el-step :title="'主任或经理:' + scope.row.productApproval.name" :status="scope.row.product_approver_state | parseFinishStatus">
                      <div slot="description">审批状态:{{scope.row.product_approver_state | parseState}}&emsp;日期:{{scope.row.product_approver_at | dateFormat}}<br><div v-if="scope.row.product_approver_state ===2">备注:{{scope.row.product_approver_content}}</div></div>
                    </el-step>
                    <el-step :title="'生产负责人:'+ scope.row.product" :status="scope.row.latest_approver_state | parseFinishStatus">
                      <div slot="description">审批状态:{{scope.row.latest_approver_state | parseState}}&emsp;日期:{{scope.row.latest_approver_at | dateFormat}}<br><div v-if="scope.row.latest_approver_state ===2">备注:{{scope.row.latest_approver_content}}</div> </div>
                    </el-step>
                    <el-step title="三级审核:成婧" :status="scope.row.leader_state | parseFinishStatus">
                      <div slot="description">审批状态:{{scope.row.leader_state | parseState}}&emsp;日期:{{scope.row.leader_at | dateFormat}}<br><div v-if="scope.row.leader_state ===2"> 备注:{{scope.row.leader_content}}</div></div>
                    </el-step>
                    <el-step :title="scope.row.create_state === 0 ? '未申请付款' : '已申请付款'" :status="scope.row.create_state === 0 ? 'process' : 'success'">
                    </el-step>
                  </el-steps>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column label="申请人" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.user}}</template>
        </el-table-column>
        <el-table-column label="项目名称" header-align="center" min-width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.project.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="工人组别" align="center" prop="workerGroup.name" width="100"></el-table-column>
        <el-table-column label="工人考核"  align="center" width="100">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <el-table
                :data="[scope.row]"
                stripe border fit :status-icon="true"
                style="width: 100%"
                :row-style="rowStyle" :cell-style="cellStyle" size="mini">
                <el-table-column label="工人合同价"  align="center" width="120" prop="project_price"></el-table-column>
                <el-table-column label="工人合同单价"  align="center" width="120" prop="worker_price" ></el-table-column>
                <el-table-column label="工程量"  align="center" width="100" prop="worker_sum" ></el-table-column>
                <el-table-column label="实际用工天数"  align="center" width="120" prop="use_day"></el-table-column>
                <el-table-column label="结算价"  align="center" width="100" prop="amount_cost"></el-table-column>
              </el-table>
              <div slot="reference" class="name-wrapper" size="mini">
                <el-tag size="medium">工人考核</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="工程量文档" width="120" :show-overflow-tooltip="true" align="center" >
          <template slot-scope="scope">
            <div v-if="scope.row.worker_excel !== null"><i class="el-icon-document"></i><a style="color: green;" :href="imgUrl[0] + scope.row.worker_excel">工程量文档说明</a></div>
            <div v-else>未考核</div>
          </template>
        </el-table-column>
        <el-table-column label="工人名称" width="100" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope"><div style="color: #2276d2">{{ scope.row.worker_name === null ? '未工人考核' : scope.row.worker_name}}</div></template>
        </el-table-column>
        <el-table-column label="分公司" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.branch}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="project_introduce" label="项目简介" align="center" width="100" ></el-table-column>
        <el-table-column prop="create_at" label="申请日期" :formatter="dateFormat" align="center" width="100"></el-table-column>
        <el-table-column label="一级审批" v-if="isLeaderApply" fixed="right" align="center" width="150">
          <!--isLeaderApply-->
          <template slot-scope="scope">
            <div v-if="scope.row.product_approver_state !== 0"><el-button @click="onClickLeaderApply(scope.row.id)" type="primary" size="mini" disabled="">一级审批</el-button></div>
            <div v-else><el-button @click="onClickLeaderApply(scope.row.id)" type="primary" size="mini">一级审批</el-button></div>
          </template>
        </el-table-column>
        <el-table-column label="二级审批" v-if="isShowLastApproval" fixed="right" align="center" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.latest_approver_state !== 0 || scope.row.product_approver_state !== 1"><el-button @click="onClickLastApply(scope.row.id)" type="primary" size="mini" disabled="">二级审批</el-button></div>
            <div v-else><el-button @click="onClickLastApply(scope.row.id)" type="primary" size="mini">二级审批</el-button></div>
          </template>
        </el-table-column>
        <el-table-column label="三级审批" v-if="isShowLeaderApply" fixed="right" align="center" width="150">
          <!--isShowLeaderApply-->
          <template slot-scope="scope">
            <div v-if="scope.row.leader_state !== 0 || scope.row.latest_approver_state !== 1 || scope.row.product_approver_state !== 1"><el-button @click="onClickBossApply(scope.row.id)" type="primary" size="mini" disabled="">三级审批</el-button></div>
            <div v-else><el-button @click="onClickBossApply(scope.row.id)" type="primary" size="mini">三级审批</el-button></div>
          </template>
        </el-table-column>
        <el-table-column label="申请付款" v-if="isShowLeaderApply" fixed="right" align="center" width="150">
          <!--isShowLeaderApply-->
          <template slot-scope="scope">
            <div v-if="scope.row.worker_state !== 1"><el-button @click="onClickApplyPay(scope.row)" type="primary" size="mini" disabled="">申请付款</el-button></div>
            <div v-else>
              <el-button @click="onClickApplyPay(scope.row)" type="primary" size="mini" v-if="scope.row.create_state === 0">申请付款</el-button>
              <div style="color: #2276d2" v-else>已申请付款</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--弹出窗口-->
    <div class="dialog_product_approval">
    <el-dialog
      title="一级审批"
      :visible.sync="leaderApproveDialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" size="mini">
        <el-form-item label="审批状态" prop="product_approver_state">
          <el-radio v-model.number="ruleForm.product_approver_state" :label="1">同意</el-radio>
          <el-radio v-model.number="ruleForm.product_approver_state" :label="2">不同意</el-radio>
        </el-form-item>
        <el-form-item label="审批意见" prop="product_approver_content" v-if="isShowProductApproverAt">
          <el-input v-model="ruleForm.product_approver_content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="leaderApproveDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onSubmitWorkerApply('ruleForm')" size="mini">提 交</el-button>
        </span>
    </el-dialog>
    </div>
    <div class="dialog_least_approval">
      <el-dialog
        title="二级审批"
        :visible.sync="LastApproveDialogVisible"
        width="30%"
        :before-close="handleClose">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" size="mini">
          <el-form-item label="审核状态" prop="latest_approver_state">
            <el-radio v-model.number="ruleForm.latest_approver_state" :label="1">同意</el-radio>
            <el-radio v-model.number="ruleForm.latest_approver_state" :label="2">不同意</el-radio>
          </el-form-item>
          <el-form-item label="审核意见" prop="latest_approver_content" v-if="isShowLatestApproverAt">
            <el-input v-model="ruleForm.latest_approver_content"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="LastApproveDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onSubmitWorkerApply('ruleForm')" size="mini">提 交</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="dialog_leader_approval">
      <el-dialog
        title="三级级审批"
        :visible.sync="leaderDialogVisible"
        width="30%"
        :before-close="handleClose">
        <div style="color: #67c23a">杨总或贾总审核完成,且申请人已经填写工人费用.后由你点击申请付款,生成劳务付款</div>
        <div style="color:red">友情提示:工人组别,工人名称来自工人管理模块,没有请添加</div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" size="mini">
          <el-form-item label="审核状态" prop="leader_state">
            <el-radio v-model.number="ruleForm.leader_state" :label="1">同意</el-radio>
            <el-radio v-model.number="ruleForm.leader_state" :label="2">不同意</el-radio>
          </el-form-item>
          <el-form-item label="工人组别" prop="sort">
            <el-select v-model.number="ruleForm.worker_group" placeholder="请选择工人组别" @change="onClickWorker">
              <el-option :label="item.name" :value="item.id" v-for="(item, key) in workerGroup" :key="key" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工人名称">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="workerNames" @change="getTest">
              <el-checkbox v-for="v in workers" :label="v" :key="v">{{v}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="审核意见" prop="leader_content" v-if="isShowLeaderAt">
            <el-input v-model="ruleForm.leader_content"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="leaderDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onSubmitWorkerApply('ruleForm')" size="mini">提 交</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { getProjects } from '../../../api/project'
  import { getWorkerApplys, getWorkerApply, updateWorkerApply, getWorkerApplyTotal } from '../../../api/workerApply'
  import { replyRes } from '../../../utils/res'
  import { parseTime } from '../../../utils'
  import { getWorkerApplysConfig } from '../../../api/workerApplyConfig'
  import { createPayApply } from '../../../api/payApply'
  import { updateProject } from '../../../api/project'
  import { getWorkers } from '../../../api/worker'
  import { getWorkerGroups } from '../../../api/workerGroup'

  const defaultRuleform = {
    id: null,
    type: 1, // 用工申请
    project_id: null,
    applyer_id: null, // 申请人ID
    product_approver_state: null, // 一级审批状态
    product_approver_content: '', // 一级审批备注
    latest_approver_state: null, // 二级审核状态
    latest_approver_content: '', // 二级审核内容
    leader_state: null, // 三级审批状态
    leader_content: '', // 三级审批内容
    worker_name: '', // 工人名称
    setFirst: null, // 判断是否负责人审批
    worker_number: null,
    worker_group: null // 工人组别
  }

  const searchForm = {
    expand: 'project,user,branch,product,productApproval,workerGroup',
    page: 1,
    pageSize: 10,
    totalCount: 0,
    valid: 1,
    username: '',
    project_name: '',
    type: 1,
    branch_id: null,
    create_state: null,
    leader_state: null,
    time: []
  }
  export default {
    name: 'EmploymentApplication',
    data() {
      return {
        isIndeterminate: false,
        checkAll: false,
        workerNames: [],
        leaderApproveDialogVisible: false, // 负责人审批窗口
        LastApproveDialogVisible: false, // 最终审批窗口状态
        leaderDialogVisible: false, // 领导审核
        ruleForm: Object.assign({}, defaultRuleform), // 修改和创建表单
        imgUrl: process.env.BASE_API.split('index.php/v1'),
        workers: [],
        rules: {
          project_id: [
            { required: true, message: '请选择项目', trigger: 'blur' }
          ],
          product_approver_state: [
            { required: true, message: '请选择审批状态', trigger: 'blur' }
          ],
          latest_approver_state: [
            { required: true, message: '请选择审核状态', trigger: 'blur' }
          ],
          latest_approver_at: [
            { required: true, message: '请选择时间', trigger: 'blur' }
          ],
          product_approver_at: [
            { required: true, message: '请选择时间', trigger: 'blur' }
          ],
          leader_at: [
            { required: true, message: '请选择时间', trigger: 'blur' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'blur' }
          ],
          worker_name: [
            { required: true, message: '请填写工人名称', trigger: 'blur' }
          ],
          worker_number: [
            { required: true, message: '请填写工人数量', trigger: 'blur' }
          ],
          product_approver_content: [
            { required: true, message: '请填写审批备注', trigger: 'blur' }
          ],
          latest_approver_content: [
            { required: true, message: '请填审核备注', trigger: 'blur' }
          ],
          leader_content: [
            { required: true, message: '请填写审批备注', trigger: 'blur' }
          ],
          leader_state: [
            { required: true, message: '请选择审批状态', trigger: 'blur' }
          ]
        }, // 用工表单提交验证规则
        searchForm: Object.assign({}, searchForm), // 赛选表单
        project_name: {}, // 远程搜索的项目信息,
        checkboxGroup1: [],
        loading: {
          project_name: false
        },
        workerApplyList: [], // 用工申请列表
        downloadExcel: [], // excel表导出数据
        workerGroup: [],
        json_fields: {
          '用工申请ID': 'id',
          '申请人': 'user',
          '项目名称': {
            field: 'project',
            callback: value => {
              return value.name
            }
          },
          '申请类型': {
            field: 'type',
            callback: value => {
              if (value === 1) {
                return '用工申请'
              }
              if (value === 2) {
                return '劳务付款申请'
              }
              return '暂未确定,请联系开发者'
            }
          },
          '申请日期': {
            field: 'create_at',
            callback: value => {
              return this.dateFormat_json_fields(value)
            }
          },
          '一审状态': {
            field: 'product_approver_state',
            callback: value => {
              if (value === 0) {
                return '未审核'
              }
              if (value === 1) {
                return '同意'
              }
              if (value === 2) {
                return '不同意'
              }
              return '暂未确定,请联系开发者'
            }
          },
          '一审备注': 'product_approver_content',
          '一审日期': {
            field: 'product_approver_at',
            callback: value => {
              return this.dateFormat_json_fields(value)
            }
          },
          '二审状态': {
            field: 'latest_approver_state',
            callback: value => {
              if (value === 0) {
                return '未审核'
              }
              if (value === 1) {
                return '同意'
              }
              if (value === 2) {
                return '不同意'
              }
              return '暂未确定,请联系开发者'
            }
          },
          '二审备注': 'latest_approver_content',
          '二审日期': {
            field: 'latest_approver_at',
            callback: value => {
              return this.dateFormat_json_fields(value)
            }
          },
          '三审状态': {
            field: 'leader_state',
            callback: value => {
              if (value === 0) {
                return '未审核'
              }
              if (value === 1) {
                return '同意'
              }
              if (value === 2) {
                return '不同意'
              }
              return '暂未确定,请联系开发者'
            }
          },
          '三审备注': 'leader_content',
          '三审日期': {
            field: 'leader_at',
            callback: value => {
              return this.dateFormat_json_fields(value)
            }
          },
          '是否申请劳务付款申请': {
            field: 'create_state',
            callback: value => {
              if (value === 0) {
                return '未生成劳务付款申请'
              }
              if (value === 1) {
                return '已生成劳务付款申请'
              }
              return '暂未确定,请联系开发者'
            }
          }
        },
        json_meta: [
          [
            {
              ' key ': ' charset ',
              ' value ': ' utf- 8 '
            }
          ]
        ],
        firstApproval: [],
        secondApproval: [],
        threeApproval: [], // 复选框
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
        waitApplyCount: null,
        isApproval: [],
        workerGrouper: null // 工人组长id
      }
    },
    mounted() {
      this.fetchWorkerApplys()
      this.fetchDownExcel()
      this.fetchWorkerApplysConfig()
      this.fetchWorkerGroups()
    },
    computed: {
      /** 是否显示一级审批时间 */
      isShowProductApproverAt() {
        if (this.ruleForm.product_approver_state === 2) {
          return true
        }
        return false
      },
      /** 是否显示二级审核时间 */
      isShowLatestApproverAt() {
        if (this.ruleForm.latest_approver_state === 2) {
          return true
        }
        return false
      },
      /** 是否显示三级审核时间 */
      isShowLeaderAt() {
        if (this.ruleForm.leader_state === 2) {
          return true
        }
        return false
      },
      /** 判断是否是审批人,否则则不显示 */
      isLeaderApply() {
        const user_id = this.$store.getters.userId
        const visible = this.firstApproval.some(v => v === user_id)
        return visible
      },
      /** 最终审核人是成婧才显示操作按钮 */
      isShowLastApproval() {
        const user_id = this.$store.getters.userId
        const visible = this.secondApproval.some(v => v === user_id)
        return visible
      },
      /** 是否显示领导审批 */
      isShowLeaderApply() {
        const user_id = this.$store.getters.userId
        const visible = this.threeApproval.some(v => v === user_id)
        return visible
      },
      isApprovalOrNot() {
        const user_id = this.$store.getters.userId
        const visible = this.isApproval.some(v => v.approval_id === user_id)
        return visible
      }
    },
    filters: {
      /** table表格日期格式化 */
      dateFormat(value) {
        if (value === null) {
          return '_________'
        }
        return parseTime(value, '{y}-{m}-{d}')
      },
      parseRemark: function(value) {
        if (value === null || value === '') {
          return '暂无备注'
        }
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
      /** 获取用工申请列表 */
      fetchWorkerApplys() {
        return getWorkerApplys(this.searchForm).then(res => {
          this.workerApplyList = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      /** 获取工人组别*/
      fetchWorkerGroups() {
        getWorkerGroups({ expand: 'worker' }).then(res => {
          this.workerGroup = res.data._items
        })
      },
      /** 获取待审批项目条数*/
      fetchWorkerApplyTotal() {
        if (this.isApprovalOrNot === false) {
          this.waitApplyCount = 0
          return false
        }
        getWorkerApplyTotal({ myId: this.$store.getters.userId }).then(res => {
          this.waitApplyCount = res.data
        })
      },
      /** 获取各个等级的审批人 */
      fetchWorkerApplysConfig() {
        return getWorkerApplysConfig().then(res => {
          this.isApproval = res.data._items.filter(v => v.type < 4)
          this.firstApproval = res.data._items.filter(v => v.type === 1).map(v => v.approval_id)
          this.secondApproval = res.data._items.filter(v => v.type === 2).map(v => v.approval_id)
          this.threeApproval = res.data._items.filter(v => v.type === 3).map(v => v.approval_id)
          return true
        }).then(res => {
          this.fetchWorkerApplyTotal()
        })
      },
      /** 获取excel表所需要的数据 */
      fetchDownExcel() {
        getWorkerApplys({
          expand: 'project,user',
          page: 1,
          pageSize: 1000,
          totalCount: 0,
          valid: 1,
          type: 1,
          downloadExcel: 1
        }).then(res => {
          this.downloadExcel = res.data._items
        })
      },
      /** 获取一条用工申请记录 */
      fetchWorkerApply(id) {
        return getWorkerApply({ id: id }).then(res => {
          this.ruleForm = res.data
          return this.ruleForm
        })
      },
      /** 提交用工申请申请负责人审批 */
      onSubmitWorkerApply(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.leaderApproveDialogVisible === true) {
              this.ruleForm.setFirst = 1 // 用于判断是否是该项目的一次审核人
            }
            if (this.LastApproveDialogVisible === true) {
              this.ruleForm.setFirst = 2 // 用于判断是否是该项目的一次审核人
            }
            if (this.leaderDialogVisible === true) {
              this.ruleForm.setFirst = 3 // 用于判断是否是该项目的一次审核人
            }
            /** 负责人审批 **/
            updateWorkerApply(this.ruleForm).then(res => {
              if (replyRes(res)) {
                this.leaderApproveDialogVisible = false
                this.LastApproveDialogVisible = false
                this.leaderDialogVisible = false
                this.fetchWorkerApplys()
                this.fetchWorkerApplyTotal()
                if (res.data.bData.valid === 0) {
                  updateProject({ id: this.ruleForm.project_id, isUseWorker: 0 }).then(res => {
                    console.log('项目是否用工的状态', res)
                  })
                }
                this.ruleForm = Object.assign({}, defaultRuleform)
              }
              return res
            })
          } else {
            return false
          }
        })
      },
      /** 搜索功能 */
      onSubmitSearch() {
        this.fetchWorkerApplys()
      },
      /** 无效申请 */
      onSubmitValidSearch() {
        this.searchForm = Object.assign({}, searchForm)
        this.searchForm.valid = 0
        this.fetchWorkerApplys().then(res => {
          this.searchForm = Object.assign({}, searchForm)
        })
      },
      /** 重置*/
      onSubmitReset() {
        this.searchForm = Object.assign({}, searchForm)
      },
      /** 负责人审批按钮 */
      onClickLeaderApply(id) {
        this.fetchWorkerApply(id)
        this.leaderApproveDialogVisible = true
      },
      /** 成婧审批按钮 */
      onClickLastApply(id) {
        this.fetchWorkerApply(id)
        this.LastApproveDialogVisible = true
      },
      /** 领导审批按钮 */
      onClickBossApply(id) {
        this.fetchWorkerApply(id)
        this.leaderDialogVisible = true
      },
      /** 申请付款 **/
      onClickApplyPay(item) {
        if (item.worker_state === 0) {
          this.$message.error('申请人未填写工人考核')
          return false
        }
        this.fetchWorkerApply(item.id).then(ruleForm => {
          /** 注意付款审批为莫柳莹用户id30 */
          return createPayApply(Object.assign(ruleForm, { applyAt: 1, create_at: null, leader_at: null,
            product_approver_at: null, type: 1, latest_approver_state: 0, leader_state: 0, product_approver_state: 0,
            leader_content: null, product_approver_content: null, latest_approver_content: null,
            latest_approver_at: null, create_state: 0, project_id: this.ruleForm.project_id, applyer_id: item.applyer_id, wp_id: item.id,
            product_approver_id: 30, latest_approver_id: item.latest_approver_id, leader_id: item.leader_id })).then(res => {
            if (replyRes(res)) {
              console.log()
            }
          }).then(res => {
            return updateWorkerApply({ id: item.id, create_state: 1 }).then(res => {
              this.fetchWorkerApplys()
            })
          }).then(res => {
            updateProject({ id: item.project_id, isUseWorker: 2 }).then(res => {
              console.log('项目是否用工的状态', res)
            })
          })
        })
      },
      /** 待我审批*/
      onClickWaitApproval() {
        this.searchForm = Object.assign({}, searchForm)
        this.searchForm.myId = this.$store.getters.userId
        this.fetchWorkerApplys().then(res => {
          this.searchForm.myId = null
        })
      },
      /** 待申请付款 **/
      onClickWaitPay() {
        this.searchForm = Object.assign({}, searchForm)
        this.searchForm.create_state = 0
        this.searchForm.leader_state = 1
        this.fetchWorkerApplys()
      },
      /** 根据工人组别获取工人**/
      onClickWorker() {
        this.workerNames = []
        this.checkAll = false
        getWorkers({ wk_id: this.ruleForm.worker_group }).then(res => {
          this.workers = res.data._items.map(v => v.name)
        })
      },
      handleClick(tab, event) {
        console.log(tab, event)
      },
      getTest(value) {
        this.isIndeterminate = false
        this.checkAll = value.length === this.workers.length
        this.ruleForm.worker_name = this.workerNames
        this.isIndeterminate = value.length > 0 && value.length < this.workers.length
      },
      /** 全选功能实现*/
      handleCheckAllChange(val) {
        this.isIndeterminate = false
        this.workerNames = val === true ? this.workers : []
        this.ruleForm.worker_name = this.workerNames
        console.log('__', this.ruleForm.worker_name)
      },
      /** 申请窗口关闭时调用方法 */
      handleClose() {
        this.leaderApproveDialogVisible = false
        this.LastApproveDialogVisible = false
        this.leaderDialogVisible = false
        this.ruleForm = Object.assign({}, defaultRuleform)
      },
      handleSizeChange(val) {
        this.searchForm.pageSize = val
        this.fetchWorkerApplys()
      },
      handleCurrentChange(val) {
        this.searchForm.page = val
        this.fetchWorkerApplys()
      },
      /** 远程搜索客户列表方法 */
      remoteMethod(query) {
        this.loading.customers = true
        let params = {}
        if (query !== null && query.trim() !== '') {
          params = { name: query.trim() }
        }
        getProjects(params).then(res => {
          this.project_name = res.data._items
          this.loading.customers = false
        })
      },
      /** table表格日期格式化 */
      dateFormat(row, column) {
        return parseTime(row[column.property], '{y}-{m}-{d}')
      },
      /** 格式化excel表格自定义字段的回调函数所需要的过滤函数 */
      dateFormat_json_fields(date) {
        if (date === null || date.length === 0) {
          return '暂无'
        } else return parseTime(date, '{y}-{m}-{d}')
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

<style scoped>
</style>

<style>
  .dialog .el-dialog {left: -15%}
  .dialog_product_approval .el-dialog {left: -15%}
  .dialog_least_approval .el-dialog {left: -15%}
  .dialog_leader_approval .el-dialog {left: -15%}
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
  .element_table .el-table__expand-icon{
    background: #dee2f9;
  }
</style>
