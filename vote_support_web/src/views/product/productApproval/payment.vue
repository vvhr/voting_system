<template>
  <div class="app-container">
    <div class="apply_header" style="background: #d3e8f1;padding-top: 5px;border-radius: 10px">
      <el-form size="mini" label-width="100px">
        <el-form-item label="搜索栏">
          <el-form  :model="searchForm" class="demo-form-inline" :inline="true" size="mini">
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
            <el-button type="primary" size="small" @click="onClickWaitPay" icon="el-icon-search" style="margin-left: 10px;height: 30px" v-if="isShowLeaderApply">待生成报销申请</el-button>
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
        :row-style="rowStyle" :cell-style="cellStyle"
        size="mini">
        <el-table-column label="审批" type="expand">
          <template slot-scope="scope">
            <el-form size="mini" label-width="100px">
              <el-form-item label="申请进度">
                <div class="scope_approval" style="width: 70%;">
                  <el-steps >
                    <el-step :title="'主任或经理:' + scope.row.productApproval.name" :status="scope.row.product_approver_state | parseFinishStatus">
                      <div slot="description">审批状态:{{scope.row.product_approver_state | parseState}}&emsp;日期:{{scope.row.product_approver_at | dateFormat}}<br><div v-if="scope.row.product_approver_state === 2">备注:{{scope.row.product_approver_content}}</div></div>
                    </el-step>
                    <el-step :title="'生产负责人:'+ scope.row.product" :status="scope.row.latest_approver_state | parseFinishStatus">
                      <div slot="description">审批状态:{{scope.row.latest_approver_state | parseState}}&emsp;日期:{{scope.row.latest_approver_at | dateFormat}}<br><div v-if="scope.row.latest_approver_state === 2">备注:{{scope.row.latest_approver_content}}</div></div>
                    </el-step>
                    <el-step title="三级审核:成婧" :status="scope.row.leader_state | parseFinishStatus">
                      <div slot="description">审批状态:{{scope.row.leader_state | parseState}}&emsp;日期:{{scope.row.leader_at | dateFormat}}<br><div v-if="scope.row.leader_state === 2">备注:{{scope.row.leader_content}}</div></div>
                    </el-step>
                    <el-step title="4级审核:杨总或贾总" :status="scope.row.four_state | parseFinishStatus">
                      <div slot="description">审批状态:{{scope.row.four_state | parseState}}&emsp;日期:{{scope.row.four_at | dateFormat}}<br><div v-if="scope.row.four_state === 2">备注:{{scope.row.four_content}}</div></div>
                    </el-step>
                    <el-step :title="scope.row.create_state | parseCreateState" :status="scope.row.create_state !== 1 ? 'process' : 'success'">
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
        <el-table-column label="项目名称" min-width="200" header-align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.project.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="分公司" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.branch}}</span>
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
        <!--<el-table-column prop="apply_content" label="申请备注" :show-overflow-tooltip="true" width="100" align="center" ></el-table-column>-->
        <el-table-column label="工人名称" width="100" align="center" >
          <template slot-scope="scope"><div style="color: #2276d2">{{ scope.row.worker_name === null ? '待二级审核' : scope.row.worker_name}}</div></template>
        </el-table-column>
        <el-table-column label="结算金额" width="100" align="center">
          <template slot-scope="scope"> <div style="color: #2276d2">{{ scope.row.amount_cost === null ? '待分配' : scope.row.amount_cost}}</div></template>
        </el-table-column>
        <el-table-column label="申请支付金额" width="100" align="center">
          <template slot-scope="scope"> <div style="color: #2276d2">{{ scope.row.pay_cost === null ? '待分配' : scope.row.pay_cost}}</div></template>
        </el-table-column>
        <el-table-column label="未付款金额" width="100" align="center">
          <template slot-scope="scope">
            <div style="color: #2276d2" v-if="scope.row.amount_cost - scope.row.pay_cost > 0">{{ scope.row.amount_cost - scope.row.pay_cost }}</div>
            <div style="color: green" v-else-if="scope.row.amount_cost - scope.row.pay_cost === 0">工人付款全部结算完成</div>
            <div style="color: red" v-else>付款超过工人费用</div>
          </template>
        </el-table-column>
        <el-table-column prop="create_at" label="申请日期" :formatter="dateFormat" align="center" width="100"></el-table-column>
        <el-table-column label="一级审批" v-if="isLeaderApply" fixed="right" align="center" width="150">
          <!--isLeaderApply-->
          <template slot-scope="scope">
            <div v-if="scope.row.product_approver_state !== 0"><el-button @click="onClickLeaderApply(scope.row.id)" type="primary" size="mini" disabled="">一级审批</el-button></div>
            <div v-else><el-button @click="onClickLeaderApply(scope.row.id)" type="primary" size="mini">一级审批</el-button></div>
          </template>
        </el-table-column>
        <el-table-column label="二级审批" v-if="isShowLastApproval" fixed="right" align="center" width="150">
          <!--isShowLastApproval-->
          <template slot-scope="scope">
            <div v-if="scope.row.latest_approver_state !== 0 || scope.row.product_approver_state !== 1"><el-button @click="onClickLastApply(scope.row.id)" type="primary" size="mini" disabled="">二级审批</el-button></div>
            <div v-else><el-button @click="onClickLastApply(scope.row.id)" type="primary" size="mini">二级审批</el-button></div>
          </template>
        </el-table-column>
        <el-table-column label="三级审批" v-if="isShowLeaderApply" fixed="right" align="center" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.leader_state !== 0 || scope.row.latest_approver_state !== 1 || scope.row.product_approver_state !== 1"><el-button @click="onClickBossApply(scope.row.id)" type="primary" size="mini" disabled="">三级审批</el-button></div>
            <div v-else><el-button @click="onClickBossApply(scope.row.id)" type="primary" size="mini">三级审批</el-button></div>
          </template>
        </el-table-column>
        <el-table-column label="四级审批" v-if="isShowFourApply" fixed="right" align="center" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.four_state !== 0 || scope.row.leader_state !== 1 || scope.row.latest_approver_state !== 1 || scope.row.product_approver_state !== 1"><el-button @click="onClickFourApply(scope.row.id)" type="primary" size="mini" disabled="">四级审批</el-button></div>
            <div v-else><el-button @click="onClickFourApply(scope.row.id)" type="primary" size="mini">四级审批</el-button></div>
          </template>
        </el-table-column>
        <el-table-column label="申请付款" v-if="isShowLeaderApply" fixed="right" align="center" width="100">
          <!--isShowLeaderApply-->
          <template slot-scope="scope">
            <div v-if="scope.row.four_state !== 1"><el-button @click="onClickApplyPay(scope.row)" type="primary" size="mini" disabled="">申请报销</el-button></div>
            <div v-else>
              <el-button @click="onClickApplyPay(scope.row)" type="primary" size="mini" v-if="scope.row.create_state === 0 || scope.row.create_state === 2">申请报销</el-button>
              <div style="color: #2276d2" v-else>已报销完成</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="打印" fixed="right" align="center" width="100">
          <!--isShowLeaderApply-->
          <template slot-scope="scope">
            <el-button type="success" @click="onClickShow(scope.row)"  icon="el-icon-view" size="mini">打印</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--弹出窗口-->
    <div class="dialog_product_approval">
      <el-dialog
        title="一级审核"
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
    <div class="'dialog_least_approval">
      <el-dialog
        title="二级审核"
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
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" size="mini">
          <el-form-item label="审核状态" prop="leader_state">
            <el-radio v-model.number="ruleForm.leader_state" :label="1">同意</el-radio>
            <el-radio v-model.number="ruleForm.leader_state" :label="2">不同意</el-radio>
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
    <!--弹出窗口-->
    <div class="dialog_four_approval">
      <el-dialog
        title="四级审核"
        :visible.sync="fourApproveDialogVisible"
        width="30%"
        :before-close="handleClose">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" size="mini">
          <el-form-item label="审批状态" prop="four_state">
            <el-radio v-model.number="ruleForm.four_state" :label="1">同意</el-radio>
            <el-radio v-model.number="ruleForm.four_state" :label="2">不同意</el-radio>
          </el-form-item>
          <el-form-item label="审批意见" prop="four_content" v-if="isShowProductApproverAt">
            <el-input v-model="ruleForm.four_content"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="fourApproveDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onSubmitWorkerApply('ruleForm')" size="mini">提 交</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="dialog_leader_approval">
      <el-dialog
        title="生成报销申请"
        :visible.sync="createReimburse"
        width="30%"
        :before-close="handleClose">
        <div style="color:green">部分申请:该项目工人费用未付清,全部申请完毕:表示工人费用结清</div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" size="mini">
          <el-form-item label="申请支付金额" prop="pay_cost">
            <el-input v-model.number="ruleForm.pay_cost" type="number"></el-input>
          </el-form-item>
          <el-form-item label="结算状态" prop="leader_state">
            <el-radio v-model.number="isPayAll" :label="2" disabled>部分付款</el-radio>
            <el-radio v-model.number="isPayAll" :label="1" disabled>全部付款</el-radio>
          </el-form-item>
          <el-form-item label="未付款金额" >
            <el-input v-model="notPay" disabled></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="createReimburse = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onSubmitCreateReimburse('ruleForm')" size="mini">提 交</el-button>
        </span>
      </el-dialog>
    </div>
    <div id="approval_table">
      <el-dialog
        title="外协用工确认、结算单"
        :visible.sync="isShowVisible"
        width="100%"
        :fullscreen="true"
        :center="true"
        :show-close="false">
        <el-button v-print="'#approval_table'" v-if="isPrint" @click="onClickPrint" type="success" icon="el-icon-printer">打印</el-button>
        <table align="center" width="90%" border="1" cellpadding="0" cellspacing="0" style="font-size: 14px;font-family: 宋体" v-if="printList.print" >
          <tr bgcolor="#a9a9a9">
            <th height="40px" colspan="1" width="12%">生产公司</th>
            <td colspan="9" align="center">{{printList.project.branch_id | parseBranch}}</td>
          </tr>
          <tr>
            <th height="40px" colspan="1" width="12%">用工部门</th>
            <td colspan="2" width="12%"></td>
            <th colspan="1" width="12%">项目经理</th>
            <td colspan="1" width="10%"></td>
            <th colspan="1" width="12%">申请日期</th>
            <td colspan="2" width="30%" align="center">{{printList.apply_at | dateFormat}}</td>
          </tr>
          <tr>
            <th height="40px">项目名称</th>
            <td colspan="9" align="center">{{printList.project.name}}</td>
          </tr>
          <tr>
            <th height="40px">项目编号</th>
            <td colspan="9" align="center">{{printList.project.project_no}}</td>
          </tr>
          <tr>
            <th height="40px">用工人数</th>
            <td colspan="4" width="30%" align="center">{{printList.project_no}}</td>
            <th width="12%">用工天数</th>
            <td colspan="4" width="35%" align="center"></td>
          </tr>
          <tr>
            <th height="65px">用工内容及单价</th>
            <td colspan="9"></td>
          </tr>
          <tr>
            <th height="90px">用工满意程度</th>
            <td colspan="9"></td>
          </tr>
          <tr>
            <th height="70px">工程量大小</th>
            <td colspan="9"></td>
          </tr>
          <tr>
            <th height="90px">用工费用结算</th>
            <td colspan="9"></td>
          </tr>
          <tr>
            <th height="50px" colspan="2">工人确认(签字)</th>
            <td colspan="8"></td>
          </tr>
          <tr>
            <th colspan="2" height="40px">项目经理确认(签字)</th>
            <td colspan="8"></td>
          </tr>
          <tr>
            <th colspan="2" height="100px">实际结算费用</th>
            <td colspan="8">
            </td>
          </tr>
          <tr>
            <th colspan="1" rowspan="2" height="90px" width="12%">
              用工费用 <br>结算审批
            </th>
            <th rowspan="1" colspan="1" height="40px" width="10%">生产负责人</th>
            <td colspan="1"></td>
            <th rowspan="1" colspan="1" height="40px">主任</th>
            <td colspan="1" ></td>
            <th rowspan="1" colspan="1" height="40px">副总经理</th>
            <td colspan="2"></td>
          </tr>
          <tr>
            <th height="40px">日期</th>
            <td width="18%"></td>
            <th height="40px">日期</th>
            <td width="18%"></td>
            <th height="40px">日期</th>
            <td colspan="2"></td>
          </tr>
          <tr bgcolor="#a9a9a9">
            <th colspan="10" height="40px">结算记录</th>
          </tr>
          <tr>
            <th colspan="2" height="40px">集团公司</th>
            <td colspan="4">意见:</td>
            <td colspan="4">日期:</td>
          </tr>
          <tr>
            <th colspan="2" height="40px">集团财务部</th>
            <td colspan="4">结算结果:</td>
            <td colspan="4" width="20%">日期:</td>
          </tr>
        </table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { getProjects } from '../../../api/project'
  import { replyRes } from '../../../utils/res'
  import { parseTime } from '../../../utils'
  import { getWorkerApplysConfig } from '../../../api/workerApplyConfig'
  import { createApply } from '../../../api/costApply'
  import { createReceiptNo, getApply } from '../../../api/costApply'
  import { getPayApplys, getPayApply, updatePayApply, getPayApplyTotal } from '../../../api/payApply'
  import { updateWorkerApply } from '../../../api/workerApply'
  import { updateProject } from '../../../api/project'
  import { createLaoWu, updateLaoWu } from '../../../api/laoWu'
  import { getWorkerGroup } from '../../../api/workerGroup'

  const defaultRuleform = {
    id: null,
    type: 1, // 劳务付款申请
    project_id: null,
    applyer_id: null, // 申请人ID
    product_approver_state: null, // 一级审批状态
    product_approver_content: '', // 一级审批备注
    latest_approver_at: null, // 二级审核时间
    latest_approver_state: null, // 二级审核状态
    latest_approver_content: '', // 二级审核内容
    product_approver_at: null, // 一级审批日期
    leader_state: null, // 三级审批状态
    leader_content: '', // 三级审批内容
    leader_at: null, // 三级审批日期
    amount_cost: null, // 报销金额
    create_state: null,
    four_content: '',
    four_state: null,
    four_at: null,
    pay_cost: null
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
    time: []
  }
  export default {
    name: 'payment',
    data() {
      return {
        isPrint: true,
        leaderApproveDialogVisible: false, // 负责人审批窗口
        LastApproveDialogVisible: false, // 最终审批窗口状态
        leaderDialogVisible: false, // 领导审核
        createReimburse: false, // 创建报销申请窗口装填,
        isShowVisible: false,
        fourApproveDialogVisible: false, // 4级审核窗口
        ruleForm: Object.assign({}, defaultRuleform), // 修改和创建表单
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
          apply_at: [
            { required: true, message: '请选择时间', trigger: 'blur' }
          ],
          latest_approver_at: [
            { required: true, message: '请选择时间', trigger: 'blur' }
          ],
          product_approver_at: [
            { required: true, message: '请选择时间', trigger: 'blur' }
          ],
          four_at: [
            { required: true, message: '请选择时间', trigger: 'blur' }
          ],
          leader_at: [
            { required: true, message: '请选择时间', trigger: 'blur' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'blur' }
          ],
          pay_cost: [
            { required: true, message: '请填写申请支付金额', trigger: 'blur' }
          ],
          product_approver_content: [
            { required: true, message: '请填写审批备注', trigger: 'blur' }
          ],
          latest_approver_content: [
            { required: true, message: '请填审核备注', trigger: 'blur' }
          ],
          four_content: [
            { required: true, message: '请填审核备注', trigger: 'blur' }
          ],
          amount_cost: [
            { required: true, message: '请填写审批备注', trigger: 'blur' }
          ],
          leader_content: [
            { required: true, message: '请填写审批备注', trigger: 'blur' }
          ],
          leader_state: [
            { required: true, message: '请选择审批状态', trigger: 'blur' }
          ],
          four_state: [
            { required: true, message: '请选择审批状态', trigger: 'blur' }
          ]
        }, // 用工表单提交验证规则
        searchForm: Object.assign({}, searchForm), // 赛选表单
        project_name: {}, // 远程搜索的项目信息
        loading: {
          project_name: false
        },
        not_pay: null, // 未付款金额
        workerApplyList: [], // 用工申请列表
        downloadExcel: [], // excel表导出数据
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
          '申请备注': 'apply_content',
          '申请日期': {
            field: 'apply_at',
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
          '是否生成报销审批': {
            field: 'create_state',
            callback: value => {
              if (value === 0) {
                return '未生成报销审批'
              }
              if (value === 1) {
                return '已生成报销审批'
              }
              return '暂未确定,请联系开发者'
            }
          }
        },
        payCost: null, // 支付金额
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
        threeApproval: [],
        fourApproval: [],
        receipt_no: null, // 报销编号
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
        printList: { print: false },
        worker_id: null // 工人组长id
      }
    },
    mounted() {
      this.fetchPayApplys()
      this.fetchDownExcel()
      this.fetchWorkerApplysConfig()
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
      },
      parseCreateState: function(value) {
        if (value === 0) {
          return '未生成报销申请'
        }
        if (value === 2) {
          return '部分申请'
        }
        if (value === 1) {
          return '全部申请完毕'
        }
        return value
      },
      parseBranch: function(value) {
        if (value === 1) {
          return '华建集团'
        }

        if (value === 2) {
          return '华建电力'
        }
        if (value === 3) {
          return '富华电力'
        }
        if (value === 4) {
          return '物联'
        }
        if (value === 5) {
          return '源通电力'
        }
        if (value === 6) {
          return '华建云南'
        }
      }
    },
    computed: {
      /** 是否显一级审批时间 */
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
      /** 显示一级审核按钮 */
      isLeaderApply() {
        const user_id = this.$store.getters.userId
        const visible = this.firstApproval.some(v => v === user_id)
        return visible
      },
      /** 显示二级审核按钮 */
      isShowLastApproval() {
        const user_id = this.$store.getters.userId
        const visible = this.secondApproval.some(v => v === user_id)
        return visible
      },
      /** 显示三级审核按钮 */
      isShowLeaderApply() {
        const user_id = this.$store.getters.userId
        const visible = this.threeApproval.some(v => v === user_id)
        return visible
      },
      /** 显示四级审批按钮 */
      isShowFourApply() {
        const user_id = this.$store.getters.userId
        const visible = this.fourApproval.some(v => v === user_id)
        return visible
      },
      isApprovalOrNot() {
        const user_id = this.$store.getters.userId
        const visible = this.isApproval.some(v => v.approval_id === user_id)
        return visible
      },
      /** 未付款金额*/
      notPay() {
        this.ruleForm.pay_cost = this.ruleForm.pay_cost === null ? 0 : this.ruleForm.pay_cost
        this.not_pay = this.ruleForm.amount_cost - this.ruleForm.pay_cost - this.payCost
        if (this.not_pay < 0) {
          return '付款超过应付款'
        }
        return this.not_pay
      },
      isPayAll() {
        if (this.ruleForm.four_state === 1 && this.createReimburse === true) { // 防止其做其他审核是修改this.ruleForm.create_state
          if (this.notPay === 0) {
            console.log('213', this.notPay)
            this.ruleForm.create_state = 1
            return this.ruleForm.create_state
          }
          this.ruleForm.create_state = 2
          return this.ruleForm.create_state
        }
        return this.ruleForm.create_state
      }
    },
    methods: {
      /** 获取用工申请列表 */
      fetchPayApplys() {
        return getPayApplys(this.searchForm).then(res => {
          this.workerApplyList = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      /** 获取待审批条数*/
      fetchPayApplyTotal() {
        if (this.isApprovalOrNot === false) {
          this.waitApplyCount = 0
          return false
        }
        getPayApplyTotal({ myId: this.$store.getters.userId }).then(res => {
          this.waitApplyCount = res.data
        })
      },
      /** 获取excel表所需要的数据 */
      fetchDownExcel() {
        getPayApplys({
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
      /** 获取各个等级的审批人 */
      fetchWorkerApplysConfig() {
        return getWorkerApplysConfig().then(res => {
          this.isApproval = res.data._items
          this.firstApproval = res.data._items.filter(v => v.type === 1).map(v => v.approval_id)
          this.secondApproval = res.data._items.filter(v => v.type === 2).map(v => v.approval_id)
          this.threeApproval = res.data._items.filter(v => v.type === 3).map(v => v.approval_id)
          this.fourApproval = res.data._items.filter(v => v.type === 4).map(v => v.approval_id)
          return res
        }).then(res => {
          this.fetchPayApplyTotal()
        })
      },
      /** 获取一条用工申请记录 */
      fetchPayApply(id) {
        return getPayApply({ id: id, expand: 'project' }).then(res => {
          this.ruleForm = res.data
          console.log('1', this.ruleForm)
          this.printList = Object.assign({ print: true }, res.data)
          return this.ruleForm
        }).then(res => {
          getProjects({ id: res.project_id }).then(res => {
            this.project_name = res.data._items
            this.loading.customers = false
            return res
          })
        })
      },
      fetchWorkerGroup(id) {
        getWorkerGroup({ id: id }).then(res => {
          this.worker_id = res.data.user_id
        })
      },
      /** 提交用工申请申请负责人审批 */
      onSubmitWorkerApply(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
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
              if (this.fourApproveDialogVisible === true) {
                this.ruleForm.product_approver_id = this.$store.getters.userId
                this.ruleForm.setFirst = 4 // 用于判断是否是该项目的一次审核人
              }
              /** 负责人审批 **/
              updatePayApply(this.ruleForm).then(res => {
                if (replyRes(res)) {
                  this.leaderApproveDialogVisible = false
                  this.LastApproveDialogVisible = false
                  this.leaderDialogVisible = false
                  this.fourApproveDialogVisible = false
                  this.fetchPayApplys()
                  this.fetchPayApplyTotal()
                  if (this.ruleForm.product_approver_state === 2 || this.ruleForm.latest_approver_state === 2 || this.ruleForm.leader_state === 2) {
                    updateWorkerApply({ id: this.ruleForm.wp_id, create_state: 0 }).then(res => {
                      console.log()
                    })
                  }
                  this.ruleForm = Object.assign({}, defaultRuleform)
                }
              })
            } else {
              return false
            }
          }
        })
      },
      /** 创建报销申请*/
      onSubmitCreateReimburse(item) {
        if (this.notPay === '付款超过应付款') {
          this.$message.error('付款超过工人应付款')
          return false
        }
        this.createReimburse = false
        return createReceiptNo({ cost_user_id: this.ruleForm.applyer_id }).then(res => {
          this.receipt_no = res.data
          this.checkReceiptNo()
          const costForm = { receipt_no: this.receipt_no, receipt_total: 1, cost_user_id: this.worker_id,
            wa_id: this.ruleForm.id, input_user_id: this.$store.getters.userId, applyType_id: 4, pro_id: this.ruleForm.project_id,
            type_id: 3, sbjR_id: 3, sbj_id: 3, money: this.ruleForm.pay_cost, use: '工人付款', note: '劳务付款生成报销申请',
            input_user_name: this.$store.getters.name, date: Date.parse(new Date()) / 1000, worker_number: this.ruleForm.worker_number }
          return costForm
        }).then(costForm => {
          return createApply(costForm).then(res => {
            if (replyRes(res)) {
              updateProject({ id: this.ruleForm.project_id, isUseWorker: 3 }).then(res => {
                console.log('项目是否用工的状态', res)
              })
            }
          }).then(res => {
            const amount = this.payCost === null ? 0 : this.payCost
            const cost = parseFloat(this.ruleForm.pay_cost) + parseFloat(amount) // 已支付金额
            if (cost === parseFloat(this.ruleForm.amount_cost)) {
              this.ruleForm.create_state = 1
            }
            if (this.ruleForm.lw_state === 0) {
              createLaoWu({ project_id: this.ruleForm.project_id, worker_num: parseInt(this.ruleForm.worker_number),
                repay_cost: this.ruleForm.pay_cost, pa_id: this.ruleForm.id }).then(res => {
                console.log('增加结算', res)
              })
            }
            updatePayApply({ id: this.ruleForm.id, create_state: this.ruleForm.create_state, pay_cost: cost, lw_state: 1 }).then(res => {
              this.fetchPayApplys()
              if (this.ruleForm.lw_state === 1) {
                updateLaoWu({ pa_id: this.ruleForm.id, repay_cost: res.data.bData.pay_cost }).then(res => {
                  console.log('结算更新', res)
                })
              }
            })
          })
        })
      },
      /** 搜索功能 */
      onSubmitSearch() {
        this.searchForm = Object.assign({}, searchForm)
        this.fetchPayApplys()
      },
      /** 无效申请 */
      onSubmitValidSearch() {
        this.searchForm = Object.assign({}, searchForm)
        this.searchForm.valid = 0
        this.fetchPayApplys().then(res => {
          this.searchForm = Object.assign({}, searchForm)
        })
      },
      /** 重置*/
      onSubmitReset() {
        this.searchForm = Object.assign({}, searchForm)
      },
      /** 负责人审批 */
      onClickLeaderApply(id) {
        this.fetchPayApply(id)
        this.leaderApproveDialogVisible = true
      },
      /** 成婧审批按钮 */
      onClickLastApply(id) {
        this.fetchPayApply(id)
        this.LastApproveDialogVisible = true
      },
      /** 领导审批按钮 */
      onClickBossApply(id) {
        this.fetchPayApply(id)
        this.leaderDialogVisible = true
      },
      onClickFourApply(id) {
        this.fourApproveDialogVisible = true
        this.fetchPayApply(id)
      },
      /** 待我审批*/
      onClickWaitApproval() {
        this.searchForm = Object.assign({}, searchForm)
        this.searchForm.myId = this.$store.getters.userId
        this.fetchPayApplys().then(res => {
          this.searchForm.myId = null
        })
      },
      /** 待生成报销申请 **/
      onClickWaitPay() {
        this.searchForm = Object.assign({}, searchForm)
        this.searchForm.create_state = 0
        this.searchForm.leader_state = 1
        this.fetchPayApplys()
      },
      /** 生成报销申请按钮 */
      onClickApplyPay(item) {
        this.createReimburse = true
        this.payCost = item.pay_cost
        this.fetchWorkerGroup(item.worker_group)
        this.fetchPayApply(item.id)
      },
      /** 预览打印页面*/
      onClickShow(item) {
        this.isPrint = true
        this.isShowVisible = true
        this.fetchPayApply(item.id)
      },
      /** 隐藏打印按钮*/
      onClickPrint() {
        this.isShowVisible = false
        this.isPrint = false
      },
      checkReceiptNo() {
        const value = this.receipt_no
        getApply({ 'receipt_no_Exact': value }).then(res => {
          this.receipt_no = res.data._items.length <= 0
        })
      },
      handleClick(tab, event) {
        console.log(tab, event)
      },
      /** 申请窗口关闭时调用方法 */
      handleClose() {
        this.fourApproveDialogVisible = false
        this.leaderApproveDialogVisible = false
        this.LastApproveDialogVisible = false
        this.leaderDialogVisible = false
        this.createReimburse = false
        this.ruleForm = Object.assign({}, defaultRuleform)
      },
      handleSizeChange(val) {
        this.searchForm.pageSize = val
        this.fetchPayApplys()
      },
      handleCurrentChange(val) {
        this.searchForm.page = val
        this.fetchPayApplys()
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
