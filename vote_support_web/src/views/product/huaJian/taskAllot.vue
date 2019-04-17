<template>
  <div class="app-container">
    <div class="apply_header" style="background: #d3e8f1;padding-top: 5px;border-radius: 10px">
      <el-form size="mini" label-width="100px">
        <el-form-item label="搜索栏">
          <el-form ref="searchForm" :model="searchForm" class="demo-form-inline" :inline="true" size="mini" label-width="70px">
              <el-form-item>
                <el-input v-model="searchForm.name" placeholder="项目名称关键字搜索"></el-input>
              </el-form-item>
              <el-form-item >
                <el-input v-model="searchForm.planner" placeholder="设计人关键字搜索"></el-input>
              </el-form-item>
              <el-form-item prop="customer_id">
                <!--<el-input v-model="ruleForm.customer_id"></el-input>-->
                <el-select
                  v-model="searchForm.customer_id"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="客户名称关键词搜索"
                  :remote-method="remoteMethod"
                  :loading="loading.customers">
                  <el-option
                    v-for="item in customers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="flow_status">
                <el-select v-model="searchForm.flow_status" placeholder="分配状态">
                  <el-option v-for="(val, key) in status" :key="key" :label="val.name" :value="val.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="origin_type">
                <el-select v-model.number="searchForm.project_type_id" placeholder="项目类型">
                  <el-option v-for="(val, key) in projectType" :key="key" :label="val.name" :value="val.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item  prop="flow_status">
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
              <el-form-item >
              <el-button @click="onSubmitSearchForm()" icon="el-icon-search" ></el-button>
              </el-form-item>
          </el-form>
        </el-form-item>
      </el-form>
    </div>
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
    <!--<div class="element_table">-->
      <!--<el-table-->
        <!--:data="list._items"-->
        <!--stripe-->
        <!--border-->
        <!--fit-->
        <!--:status-icon="true"-->
        <!--style="width: 100%"-->
        <!--:row-style="rowStyle" :cell-style="cellStyle"-->
        <!--size="mini">-->
        <!--<el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>-->
        <!--<el-table-column prop="project_no" label="项目编号" width="110" align="center"></el-table-column>-->
        <!--<el-table-column prop="name" label="项目名称"  align="center"></el-table-column>-->
        <!--<el-table-column prop="customer_name" label="委托单位"  width="110" align="center"></el-table-column>-->
        <!--<el-table-column label="项目类型"  align="center" width="100">-->
          <!--<template slot-scope="scope">{{scope.row.project_type_id | parseProjectType}}</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="计划完成时间"  align="center" width="100">-->
          <!--<template slot-scope="scope">{{scope.row.plan_completed_at | parseTime}}</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="planner" label="设计人" width="100" align="center"></el-table-column>-->
        <!--<el-table-column label="相关人员"  align="center" width="100">-->
          <!--<template slot-scope="scope">-->
            <!--校准人:{{scope.row.checker}}<br>审核人:{{scope.row.proofreader}}<br>预算员:{{scope.row.budgeter}}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="预警提示"  align="center" width="100">-->
          <!--<template slot-scope="scope">-->
            <!--<div v-if="scope.row.plan_completed_at ===  null"></div>-->
            <!--<div v-else-if="scope.row.plan_completed_at >0 && scope.row.progress_status < 3"><el-tooltip :content="scope.row.plan_completed_at | parseHint" placement="top"><div :class="(scope.row.plan_completed_at - time) | getAlertClass"></div></el-tooltip></div>-->
            <!--<div v-else><el-tooltip content="合同已完成"><el-button type="success"  size="mini" icon="el-icon-check" circle></el-button></el-tooltip></div>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="生产记录"  align="center" width="100">-->
          <!--<template slot-scope="scope">-->
            <!--<td v-if="scope.row.flowType !== null">{{scope.row.flowType.flow_id | flowName}}:{{scope.row.flowType.status | productStatus}}:{{scope.row.flowType.checkStatus | parseCheckStatus}}</td>-->
            <!--<td v-else></td>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="生产记录详情"  align="center" width="100">-->
          <!--<template slot-scope="scope">-->
            <!--<taskChild :id="scope.row.id" v-if="checkAccess.taskChild"></taskChild>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="操作"  align="center" width="100" fixed="right">-->
          <!--<template slot-scope="scope">-->
            <!--<el-button @click="onDialogSign(item)" icon="el-icon-edit" size="mini"></el-button>-->
          <!--</template>-->
        <!--</el-table-column>-->
      <!--</el-table>-->
    <!--</div>-->
    <table class="_table" border="0" cellpadding="0" cellspacing="0" style="width: 100%">
      <thead>
      <tr>
        <th>序号</th>
        <th width="100px">项目编号</th>
        <th width="200px">项目名称</th>
        <th width="150px">委托单位</th>
        <th>项目类型</th>
        <th>计划完成时间</th>
        <th>设计人</th>
        <th width="150px">相关人员</th>
        <th>预警提示</th>
        <th>生产记录</th>
        <th>生产记录详情</th>
        <th width="120px">操作</th>
      </tr>
      </thead>
      <tbody  v-for="(item, key) in list._items" :key="key">
      <tr>
        <td>{{item.id}}</td>
        <td>{{item.project_no}}</td>
        <td>{{item.name}}</td>
        <td>{{item.customer_name}}</td>
        <td>{{item.project_type_id | parseProjectType}}</td>
        <td>{{item.plan_completed_at | parseTime}}</td>
        <td>{{item.planner}}</td>
        <td>校准人:{{item.checker}}<br>审核人:{{item.proofreader}}<br>预算员:{{item.budgeter}}</td>
        <td v-if="item.plan_completed_at ===  null"></td>
        <td v-else-if="item.plan_completed_at >0 && item.progress_status < 3"><el-tooltip :content="item.plan_completed_at | parseHint" placement="top"><div :class="(item.plan_completed_at - time) | getAlertClass"></div></el-tooltip></td>
        <td v-else><el-tooltip content="合同已完成"><el-button type="success"  size="mini" icon="el-icon-check" circle></el-button></el-tooltip></td>
        <td v-if="item.flowType !== null">{{item.flowType.flow_id | flowName}}:{{item.flowType.status | productStatus}}:{{item.flowType.checkStatus | parseCheckStatus}}</td>
        <td v-else></td>
        <td><taskChild :id="item.id" v-if="checkAccess.taskChild"></taskChild></td>
        <td width="100px"><el-button @click="onDialogSign(item)" icon="el-icon-edit" size="mini" style="float: left"></el-button>
          <el-button icon="el-icon-message" @click="onClickShowBtn(item)" size="mini" ></el-button></td>
      </tr>
      <tr v-for="_item in item.children" v-if="item.showVisible"  style="width: 100%;background: #f0f0f0;">
        <td>{{_item.id}}</td>
        <td>{{_item.project_no}}</td>
        <td>{{_item.name}}</td>
        <td>{{_item.customer_name}}</td>
        <td>{{_item.project_type_id | parseProjectType}}</td>
        <td>{{_item.plan_completed_at | parseTime}}</td>
        <td>{{_item.planner}}</td>
        <td>审核人:{{_item.checker}}<br>校准人:{{_item.proofreader}}<br>预算员:{{_item.budgeter}}</td>
        <td v-if="_item.plan_completed_at ===  null"></td>
        <td v-else-if="_item.plan_completed_at >0 && _item.progress_status < 3"> <el-tooltip :content="_item.plan_completed_at | parseHint" placement="top"><div :class="(_item.plan_completed_at - time) | getAlertClass"></div></el-tooltip></td>
        <td v-else><el-tooltip content="合同已完成"><el-button type="success"  size="mini" icon="el-icon-check" circle></el-button></el-tooltip></td>
        <td v-if="_item.childFlow !== null">
          {{_item.childFlow.flow_id | flowName}}:{{_item.childFlow.status | productStatus}}:{{_item.childFlow.checkStatus | parseCheckStatus}}</td>
        <td v-else>无记录</td>
        <td><projectChild :id="_item.id" v-if="checkAccess.projectChild"></projectChild></td>
        <td><el-button @click="onDialogSignChild(_item)" icon="el-icon-edit" size="mini"></el-button></td>
      </tr>
      <tr v-show="item.children!==undefined && item.children.length<=0 && item.showVisible" >
        <td style="color:green">没有子项目</td>
      </tr>
      </tbody>
    </table>
    <div id="dialog1">
      <el-dialog
        title="任务分配"
        :visible.sync="visible.dialogVisible"
        width="40%">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px">
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="项目类型">
                <el-select v-model="ruleForm.project_type_id" placeholder="请选择项目类型" style="width: 100%" prop="itemType">
                  <el-option v-for="(item, key) in contractType" :label="item.name" :value="parseInt(item.id)" :key="key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设计科室">
                <el-select v-model="ruleForm.department_id" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="item in department"
                    :key="item.id"
                    :label="item.name"
                    :value="parseInt(item.id)">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设计人" prop="planner">
                <el-select
                  v-model="ruleForm.planner"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="关键词搜索，空格表示全部"
                  :remote-method="remoteMethodFlow"
                  :loading="loading.customers"
                  style="width: 100%">
                  <el-option
                    v-for="item in user"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
                <!--<el-input type="text" auto-complete="off" v-model="ruleForm.planner"></el-input>-->
              </el-form-item>
              <el-form-item label="校准人" prop="checker">
                <el-select
                  v-model="ruleForm.checker"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="关键词搜索，空格表示全部"
                  :remote-method="remoteMethodFlow"
                  :loading="loading.checker"
                  style="width: 100%">
                  <el-option
                    v-for="item in user"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
                <!--<el-input type="text" auto-complete="off"  v-model="ruleForm.checker"></el-input>-->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="审核人" prop="proofreader">
                <el-select
                  v-model="ruleForm.proofreader"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="关键词搜索，空格表示全部"
                  :remote-method="remoteMethodFlow"
                  :loading="loading.customers"
                  style="width: 100%">
                  <el-option
                    v-for="item in user"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
                <!--<el-input type="text" auto-complete="off" v-model="ruleForm.proofreader"></el-input>-->
              </el-form-item>
                <el-form-item label="预算员" prop="budgeter">
                  <el-select
                    v-model="ruleForm.budgeter"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="关键词搜索，空格表示全部"
                    :remote-method="remoteMethodFlow"
                    :loading="loading.customers"
                    style="width: 100%">
                    <el-option
                      v-for="item in user"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                  <!--<el-input type="text" auto-complete="off" v-model="ruleForm.budgeter"></el-input>-->
                </el-form-item>
              <el-form-item label="计划开始时间" prop="plan_started_at">
                <el-date-picker
                  v-model="ruleForm.plan_started_at"
                  type="date"
                  value-format = "timestamp"
                  placeholder="选择日期"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="计划完成时间" prop="plan_completed_at">
                <el-date-picker
                  v-model="ruleForm.plan_completed_at"
                  type="date"
                  value-format = "timestamp"
                  placeholder="选择日期"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button @click="visible.dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="onSubmitForm('ruleForm')">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div id="dialog2">
      <el-dialog
        title="任务分配"
        :visible.sync="visible.dialogVisibleChild"
        width="40%">
        <el-form ref="ruleFormChild" :model="ruleFormChild" :rules="rules" label-width="120px">
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="项目类型">
                <el-select v-model="ruleFormChild.project_type_id" placeholder="请选择项目类型" style="width: 100%" prop="itemType">
                  <el-option v-for="(item, key) in contractType" :label="item.name" :value="parseInt(item.id)" :key="key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设计科室">
                <el-select v-model.number="ruleFormChild.department_id" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="item in department"
                    :key="item.id"
                    :label="item.name"
                    :value="parseInt(item.id)">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设计人" prop="planner">
                <el-select
                  v-model="ruleFormChild.planner"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="关键词搜索，空格表示全部"
                  :remote-method="remoteMethodFlow"
                  :loading="loading.customers"
                  style="width: 100%">
                  <el-option
                    v-for="item in user"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
                <!--<el-input type="text" auto-complete="off" v-model="ruleForm.planner"></el-input>-->
              </el-form-item>
              <el-form-item label="校准人" prop="checker">
                <el-select
                  v-model="ruleFormChild.checker"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="关键词搜索，空格表示全部"
                  :remote-method="remoteMethodFlow"
                  :loading="loading.checker"
                  style="width: 100%">
                  <el-option
                    v-for="item in user"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
                <!--<el-input type="text" auto-complete="off"  v-model="ruleForm.checker"></el-input>-->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="审核人" prop="proofreader">
                <el-select
                  v-model="ruleFormChild.proofreader"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="关键词搜索，空格表示全部"
                  :remote-method="remoteMethodFlow"
                  :loading="loading.customers"
                  style="width: 100%">
                  <el-option
                    v-for="item in user"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
                <!--<el-input type="text" auto-complete="off" v-model="ruleForm.proofreader"></el-input>-->
              </el-form-item>
              <el-form-item label="预算员" prop="budgeter">
                <el-select
                  v-model="ruleFormChild.budgeter"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="关键词搜索，空格表示全部"
                  :remote-method="remoteMethodFlow"
                  :loading="loading.customers"
                  style="width: 100%">
                  <el-option
                    v-for="item in user"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
                <!--<el-input type="text" auto-complete="off" v-model="ruleForm.budgeter"></el-input>-->
              </el-form-item>
              <el-form-item label="计划开始时间" prop="plan_started_at">
                <el-date-picker
                  v-model="ruleFormChild.plan_started_at"
                  type="date"
                  value-format = "timestamp"
                  placeholder="选择日期"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="计划完成时间" prop="plan_completed_at">
                <el-date-picker
                  v-model="ruleFormChild.plan_completed_at"
                  type="date"
                  value-format = "timestamp"
                  placeholder="选择日期"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button @click="visible.dialogVisibleChild = false">取 消</el-button>
            <el-button type="primary" @click="onSubmitFormChild('ruleFormChild')">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_taskAllot_HJ                    beforeMount()
    查看生产记录: read_projectHistory_HJ            checkAccessTaskChild()
    修改项目分配: update_projectAssign_HJ            onDialogSign()
    查看子项目: read_sonProject_HJ                  onClickShowBtn
    查看子项目生产记录: read_sonProjectHistory_HJ    checkAccessTaskChild()
    修改子项目分配: update_sonProjectAssign_HJ       onDialogSignChild()
-->
<script>
  import { getProjects, parseOriginType, getProject } from '../../../api/project'
  import _ from 'lodash'
  import { updateProject } from '../../../api/project'
  import { parseTime } from '../../../utils/index'
  import Store from '../../../store/index'
  import { getProjectChild } from '../../../api/projectChild'
  import { getCustomers } from '../../../api/customer'
  import { listDepartment } from '../../../api/department'
  import { getUsers } from '../../../api/user'
  import taskChild from './module/taskChild'
  import projectChild from './module/projectChild'
  import { getProjectChildId, updateProjectChild } from '../../../api/projectChild'

  const defaultRuleForm = {
    id: null, // 项目ID
    project_type_id: null, // 项目类型
    flowType: [],
    planner: '', // 设计人
    proofreader: '', // 审核人
    checker: '', // 校准人
    flow_status: 1, // 分配状态
    budgeter: '', // 预算员
    department_id: 1, // 部门ID
    plan_started_at: null, // 计划开始时间
    plan_completed_at: null // 计划完成时间
  }

  const defaultRuleFormChild = {
    id: null, // 项目ID
    project_type_id: 1, // 项目类型
    childFlow: [],
    planner: '', // 设计人111
    proofreader: '', // 审核人
    checker: '', // 校准人
    budgeter: '', // 预算员
    flow_status: 1, // 分配状态
    department_id: 1, // 部门ID
    plan_started_at: null, // 计划开始时间
    plan_completed_at: null // 计划完成时间
  }

  export default {
    name: 'taskAllot',
    data() {
      return {
        checkAccess: {
          projectChild: true,
          taskChild: true
        },
        visible: {
          dialogChVisible: false,
          dialogVisible: false,
          dialogVisibleChild: false
        },
        hint: '', // 预警提示
        flowType: [
          {
            flow_id: 1,
            name: '项目建议书'
          },
          {
            flow_id: 2,
            name: '初设极端'
          },
          {
            flow_id: 3,
            name: '施工图阶段'
          },
          {
            flow_id: 4,
            name: '可研阶段'
          }
        ],
        projectType: [
          { id: null, name: '项目类型' },
          { id: 1, name: '配电' },
          { id: 2, name: '迁改' },
          { id: 3, name: '配网' },
          { id: 4, name: '用电安全' }
        ],
        contractType: [
          { id: 1, name: '配电' },
          { id: 2, name: '迁改' },
          { id: 3, name: '配网' },
          { id: 4, name: '用电安全' }
        ],
        pageInfo: {
          page: 1,
          pageSize: 10,
          totalCount: 0
        },
        user: {}, // 获取用户
        department: {},
        loading: {
          customers: false,
          users: false
        },
        time: Date.parse(new Date()) / 1000,
        customers: {}, // 获取客户
        searchForm: {
          project_type_id: null,
          name: null,
          branch_id: 2, // 华建电力
          start_at: null,
          end_at: null,
          origin_type: null, // 项目来源
          flow_status: null, // 分配状态
          page: 1,
          pageSize: 10,
          totalCount: 0,
          time: []
        },
        list: {},
        ruleForm: Object.assign({}, defaultRuleForm),
        ruleFormChild: Object.assign({}, defaultRuleFormChild),
        rules: {
          itemType: [
            { required: true, message: '项目类型不能为空', trigger: 'blur' }
          ],
          budgeter: [
            { required: true, message: '请输入预算员', trigger: 'blur' }
          ],
          plan_started_at: [
            { required: true, message: '请输入时间', trigger: 'blur' }
          ],
          plan_completed_at: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          section: [
            { required: true, message: '科室不能为空', trigger: 'blur' }
          ],
          checker: [
            { required: true, message: '请输入校准人', trigger: 'blur' }
          ],
          proofreader: [
            { required: true, message: '请输入审核人', trigger: 'blur' }
          ],
          planner: [
            { required: true, message: '请输入设计人', trigger: 'blur' }
          ]
        },
        contract: [
          { origin_type: '全部', id: null },
          { origin_type: '合同签订', id: 1 },
          { origin_type: '委托书', id: 2 },
          { origin_type: '中标通知书', id: 3 },
          { origin_type: '口头订单', id: 4 }
        ],
        status: [
          { id: null, name: '分配状态' },
          { id: 0, name: '未分配' },
          { id: 1, name: '已分配' }
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
        }
      }
    },
    components: { // 祖册组件
      taskChild,
      projectChild
    },
    filters: {
      getAlertClass(time) {
        if (time >= 5 * 24 * 60 * 60) {
          return ['alertGreen']
        } else if (time >= 2 * 24 * 60 * 60 && time < 5 * 24 * 60 * 60) {
          return ['alertYellow']
        } else if (time >= 0 && time < 2 * 24 * 60 * 60) {
          return ['alertRed']
        }
        return ['alertPurple']
      },
      // 将id转换为合同编号
      flowName: function(value) {
        if (value === null) {
          return '尚未进行'
        }
        if (value === 1 || value === '1') {
          return '项目建议书'
        }
        if (value === 2 || value === '2') {
          return '可研阶段'
        }
        if (value === 3 || value === '3') {
          return '初设阶段'
        }
        if (value === 4 || value === '4') {
          return '施工图阶段'
        }
        return value
      },
      productStatus: function(value) {
        if (value === null) {
          return '尚未进行'
        }
        if (value === 0) {
          return '未开始'
        }
        if (value === 1) {
          return '前期工作'
        }
        if (value === 2) {
          return '勘查设计'
        }
        if (value === 3) {
          return '内部校审'
        }
        if (value === 4) {
          return '概预算编制'
        }
        if (value === 5) {
          return '成果提交'
        }
        if (value === 6) {
          return '已完成'
        }
        return value
      },
      padStr: function(value) {
        return 'hj-' + _.padStart(value, 8, '0')
      },
      parseTime: function(value) {
        if (!value) return ''
        value = value.toString()
        return parseTime(value, '{y}年{m}月{d}日')
      },
      parseOriginType,
      parseCheckStatus: function(value) {
        if (value === null) {
          return '尚未设计'
        }
        if (value === 0 || value === '0') {
          return '送校核'
        }
        if (value === 1 || value === '1') {
          return '返回设计'
        }
        if (value === 2 || value === '2') {
          return '送审核'
        }
        if (value === 3 || value === '3') {
          return '送批准'
        }
        if (value === 4 || value === '4') {
          return '返回审核'
        }
        if (value === 5 || value === '5') {
          return '已完成'
        }
        return value
      },
      parseBranch: function(value) {
        const list = Store.state.user.branches
        for (const index in list) {
          if (parseInt(list[index].id) === value) {
            return list[index].name
          }
        }
        return value
      },
      parseProjectType: function(value) {
        if (value === 1 || value === '1') {
          return '配电'
        }
        if (value === 2 || value === '2') {
          return '迁改'
        }
        if (value === 3 || value === '3') {
          return '配网'
        }
        if (value === 4 || value === '4') {
          return '用电安全'
        }
        return value
      },
      parseHint: function(value) {
        const time = Date.parse(new Date()) / 1000
        const timeDiffer = value - time
        if (timeDiffer > 5 * 86400) {
          return '距离完成时间超过5天'
        }
        if (5 * 86400 >= timeDiffer && timeDiffer > 2 * 86400) {
          return '距离完成时间2到5天'
        }
        if (2 * 86400 >= timeDiffer && timeDiffer > 0) {
          return '距离完成时间0到2天'
        }
        if (timeDiffer <= 0) {
          return '已超期'
        }
      }
    },
    mounted() {
      this.checkAccessTaskChild()
      this.fetchProjects()
      this.fetchListDepartment()
    },
    methods: {
      /** 检查查看记录的权限 */
      checkAccessTaskChild() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('read_projectHistory_HJ#') === false) {
          this.checkAccess.taskChild = false
        }
        if (this.actionCheck_.actionCheck('read_sonProjectHistory_HJ#') === false) {
          this.checkAccess.projectChild = false
        }
      },
      fetchProjects() {
        getProjects(this.searchForm).then(res => {
          this.list = res.data
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      fetchListDepartment() {
        listDepartment(['设计一室', '设计二室', '设计三室']).then(res => {
          this.department = res.data
        })
      },
      // 获取单条项目信息
      fetchProject(id) {
        getProject({ id: id }).then(res => {
          res.data.plan_completed_at > 0 ? res.data.plan_completed_at *= 1000 : null
          res.data.plan_started_at > 0 ? res.data.plan_started_at *= 1000 : null
          this.ruleForm = Object.assign({}, res.data)
        })
      },
      // 获取单条子项目信息
      fetchProjectChildId(id) {
        getProjectChildId({ id: id }).then(res => {
          res.data.plan_completed_at > 0 ? res.data.plan_completed_at *= 1000 : null
          res.data.plan_started_at > 0 ? res.data.plan_started_at *= 1000 : null
          this.ruleFormChild = Object.assign({}, res.data)
        })
      },
      // 修改项目分配
      onDialogSign(item) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_projectAssign_HJ#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.fetchProject(item.id)
        this.visible.dialogVisible = true
        this.ruleForm.id = item.id
      },
      // 修改子项目分配
      onDialogSignChild(item) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_sonProjectAssign_HJ#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.fetchProjectChildId(item.id)
        this.visible.dialogVisibleChild = true
        this.ruleFormChild.id = item.id
      },
      // 获取子项目信息
      fetchProjectChild(item) {
        getProjectChild({ project_id: item.id }).then(res => {
          this.$set(item, 'children', res.data._items)
          this.$set(item, 'showVisible', true)
          console.log(item.children)
        })
      },
      // 显示当前项目的子项目
      onClickShowBtn(item) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('read_sonProject_HJ#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        if (item.children === undefined) {
          this.fetchProjectChild(item)
        } else {
          item.showVisible = !item.showVisible
        }
      },
      // 一页多少行
      handleSizeChange(pageSize) {
        this.searchForm.pageSize = pageSize
        this.fetchProjects()
      },
      // 翻页
      handlePageChange(currentPage) {
        this.searchForm.page = currentPage
        this.fetchProjects()
      },
      // 主项目修改
      onSubmitForm(formName) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_projectAssign_HJ#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.visible.dialogVisible = false
        this.ruleForm.plan_completed_at > 0 ? this.ruleForm.plan_completed_at /= 1000 : null
        this.ruleForm.plan_started_at > 0 ? this.ruleForm.plan_started_at /= 1000 : null
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ruleForm.flow_status = 1
            updateProject(this.ruleForm).then(res => {
              if (res.code === 101) {
                this.$message({
                  message: '分配成功',
                  type: 'success'
                })
              } else {
                this.$message.error('分配失败,请联系开发人员')
              }
              this.fetchProjects()
              this.ruleForm = Object.assign({}, defaultRuleForm)
            })
          }
        })
      },
      // 子项目修改
      onSubmitFormChild() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_sonProjectAssign_HJ#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.visible.dialogVisibleChild = false
        this.ruleFormChild.plan_completed_at > 0 ? this.ruleFormChild.plan_completed_at /= 1000 : null
        this.ruleFormChild.plan_started_at > 0 ? this.ruleFormChild.plan_started_at /= 1000 : null
        this.ruleFormChild.flow_status = 1
        updateProjectChild(this.ruleFormChild).then(res => {
          if (res.code === 101) {
            this.$message({
              message: '分配成功',
              type: 'success'
            })
          } else {
            this.$message.error('分配失败,请联系开发人员')
          }
          this.fetchProjects()
        })
      },
      /** 远程搜索客户列表方法 */
      remoteMethod(query) {
        let params = {}
        if (query.trim() !== '') {
          this.loading.customers = true
          params = { name: query.trim() }
        }
        getCustomers(params).then(res => {
          console.log(res)
          this.customers = res.data._items
          this.loading.customers = false
        })
      },
      /** 远程搜索员工列表方法 */
      remoteMethodFlow(query) {
        this.loading.customers = true
        let params = {}
        if (query !== null && query.trim() !== '') {
          params = { name: query.trim() }
        }
        getUsers(params).then(res => {
          this.user = res.data._items
          this.loading.customers = false
        })
      },
      onSubmitSearchForm() {
        if (this.searchForm.time !== null && this.searchForm.time.length > 0) {
          this.searchForm.start_at = this.searchForm.time[0]
          this.searchForm.end_at = this.searchForm.time[1]
        } else {
          this.searchForm.start_at = null
          this.searchForm.end_at = null
        }
        this.fetchProjects()
      },
      /** -------- 表格样式设置方法 -------- */
      rowStyle() {
        return 'height: 25px'
      },
      cellStyle() {
        return 'padding: 2px'
      }
    },
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_taskAllot_HJ#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style scoped>
  .alertGreen{
    width: 38px;height: 39px; background: green; border-radius:39px;
  }

  .alertYellow{
    width: 38px;height: 39px; background: #8a6d3b; border-radius:39px;
  }

  .alertRed{
    width: 38px;height: 39px; background: red; border-radius:39px;
  }

  .alertPurple{
    width: 38px;height: 39px; background: black; border-radius:39px;
  }
</style>
<style>
  .apply_header .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 6px;
  }
</style>
