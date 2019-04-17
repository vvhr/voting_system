<template>
    <div id="table" class="app-container">
      <div class="apply_header" style="background: #d3e8f1;padding-top: 5px;border-radius: 10px">
        <el-form size="mini" label-width="100px">
          <el-form-item label="搜索栏">
            <el-form ref="searchForm" :model="searchForm" label-width="100px" class="demo-form-inline" :inline="true" size="mini" >
                <el-form-item  prop="project_id" >
                  <el-select
                    v-model="searchForm.project_id"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="项目名称关键词搜索，空格表示全部"
                    :remote-method="remoteMethod"
                    :loading="loading.customers">
                    <el-option
                      v-for="item in projectName"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item >
                  <el-date-picker
                    v-model="searchForm.start_at"
                    type="date"
                    value-format="timestamp"
                    placeholder="选择结开始日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item >
                  <el-date-picker
                    v-model="searchForm.end_at"
                    type="date"
                    value-format="timestamp"
                    placeholder="选择结束日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item >
                  <el-button @click="onSubmitSearchForm()" icon="el-icon-search" circle></el-button>
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
          :page-sizes="[5,10,20,30]"
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
          <el-table-column prop="project_no" label="项目编号" width="110" align="center"></el-table-column>
          <el-table-column prop="name" label="项目名称"  align="center"></el-table-column>
          <!--<el-table-column prop="planner" label="项目负责人" width="100" align="center"></el-table-column>-->
          <el-table-column label="生产状态" width="100" header-align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-if="scope.row.flowType !== null">{{scope.row.flowType.flow_id | flowName}}</div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column label="出版状态" width="100" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-if="scope.row.flowType !== null">{{scope.row.flowType.status | productStatus}}</div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" width="100" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-if="scope.row.flowType !== null">{{scope.row.flowType.checkStatus | parseCheckStatus}}</div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column label="收款状态" width="100" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-button type="danger" @click="onReceiveStatus(scope.row)" size="mini">{{scope.row.receive_status | receiveStatus}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="项目计划完成时间" width="120" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.plan_completed_at | parseTime}}
            </template>
          </el-table-column>
          <el-table-column label="流程计划完成时间" width="120" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-if="scope.row.flowType !== null">{{scope.row.flowType.flow_at | parseTime}}</div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column label="流程完成时间" width="110" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-if="scope.row.flowType !== null">{{scope.row.flowType.complete_at | parseTime}}</div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column label="预警提示" width="100" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-if="scope.row.flowType === null"></div>
              <div v-else-if="scope.row.flowType.status < 6"><el-tooltip :content="scope.row.flowType.flow_at | parseHint" placement="top"><div :class="(scope.row.flowType.flow_at - time) | getAlertClass"></div></el-tooltip></div>
              <div v-else><el-tooltip content="该阶段已完成"><el-progress type="circle" :width="30" :stroke-width="2" :percentage="100" status="success"></el-progress></el-tooltip></div>
            </template>
          </el-table-column>
          <el-table-column label="操作记录" width="100" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <taskChild :id="scope.row.id"></taskChild>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="100" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-if="scope.row.flowType !== null"> <el-button icon="el-icon-edit" @click="onSubmitEdit(scope.row)" size="mini">修改</el-button> </div>
              <div v-else><el-button icon="el-icon-circle-plus" @click="onSubmitAdd(scope.row)" size="mini">添加</el-button></div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="apply_header1" style="background: #d3e8f1;margin-top: 10px;padding-top: 5px;border-radius: 10px">
        <el-form size="mini" label-width="100px">
          <el-form-item label="子项目操作栏">
            <el-form ref="searchFormChild" :model="searchFormChild" label-width="100px" class="demo-form-inline" :inline="true" size="mini"  style="width: 100%">
                <el-form-item  prop="project_id">
                  <!--<el-input v-model="ruleForm.customer_id"></el-input>-->
                  <el-select
                    v-model="searchFormChild.project_child_id"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="项目名称关键词搜索，空格表示全部"
                    :remote-method="remoteMethodChild"
                    :loading="loadingChild.customers">
                    <el-option
                      v-for="item in projectChildName"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item >
                  <el-date-picker
                    v-model="searchFormChild.start_at"
                    type="date"
                    value-format="timestamp"
                    placeholder="选择开始日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-date-picker
                    v-model="searchFormChild.end_at"
                    type="date"
                    value-format="timestamp"
                    placeholder="选择结束日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button @click="onSubmitSearchChildForm()" icon="el-icon-search" circle></el-button>
                </el-form-item>
            </el-form>
          </el-form-item>
        </el-form>
      </div>
      <!--分页器-->
      <div style="padding:0 10px; margin-top: 20px; background: #9E9E9E;">
        <el-pagination
          @size-change="handleSizeChangeChild"
          @current-change="handlePageChangeChild"
          :current-page="searchFormChild.currentPage"
          :page-sizes="[5,10,20,30]"
          :page-size="searchFormChild.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="searchFormChild.totalCount">
        </el-pagination>
      </div>

      <div class="element_table">
        <el-table
          :data="listChild"
          stripe
          border
          fit
          :status-icon="true"
          style="width: 100%"
          :row-style="rowStyle" :cell-style="cellStyle"
          size="mini">
          <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
          <el-table-column prop="project_no" label="项目编号" width="110" align="center"></el-table-column>
          <el-table-column prop="name" label="项目名称"  align="center"></el-table-column>
          <!--<el-table-column prop="planner" label="项目负责人" width="100" align="center"></el-table-column>-->
          <el-table-column label="生产状态" width="100" header-align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-if="scope.row.childFlow !== null">{{scope.row.childFlow.flow_id | flowName}}</div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column label="出版状态" width="100" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-if="scope.row.childFlow !== null">{{scope.row.childFlow.status | productStatus}}</div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column label="收款状态" width="100" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-if="scope.row.childFlow !== null">{{scope.row.childFlow.checkStatus | parseCheckStatus}}</div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" width="100" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-button type="danger" @click="onReceiveStatus(scope.row)" size="mini">{{scope.row.receive_status | receiveStatus}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="项目计划完成时间" width="120" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.plan_completed_at | parseTime}}
            </template>
          </el-table-column>
          <el-table-column label="流程计划完成时间" width="120" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-if="scope.row.childFlow !== null">{{scope.row.childFlow.flow_at | parseTime}}</div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column label="流程完成时间" width="110" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-if="scope.row.childFlow !== null">{{scope.row.childFlow.complete_at | parseTime}}</div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column label="预警提示" width="100" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-if="scope.row.childFlow === null"></div>
              <div v-else-if="scope.row.childFlow.status < 6"><el-tooltip :content="scope.row.childFlow.flow_at | parseHint" placement="top"><div :class="(scope.row.childFlow.flow_at - time) | getAlertClass"></div></el-tooltip></div>
              <div v-else><el-tooltip content="该阶段已完成"><el-progress type="circle" :width="30" :stroke-width="2" :percentage="100" status="success"></el-progress></el-tooltip></div>
            </template>
          </el-table-column>
          <el-table-column label="操作记录" width="100" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <taskChild :id="scope.row.id"></taskChild>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="100" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-if="scope.row.childFlow !== null"> <el-button icon="el-icon-edit" @click="onSubmitEdit(scope.row)" size="mini">修改</el-button> </div>
              <div v-else><el-button icon="el-icon-circle-plus" @click="onSubmitAdd(scope.row)" size="mini">添加</el-button></div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--<div style="margin-top: 30px">-->
        <!--<table class="_table" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">-->
          <!--<thead>-->
          <!--<tr style="color: #555c66">-->
            <!--<th>序号</th>-->
            <!--<th>项目编号</th>-->
            <!--<th width="200px">项目名称</th>-->
            <!--<th>项目负责人</th>-->
            <!--<th>项目阶段</th>-->
            <!--<th>生产状态</th>-->
            <!--<th>出版状态</th>-->
            <!--&lt;!&ndash;<th>收款状态</th>&ndash;&gt;-->
            <!--<th>项目计划完成时间</th>-->
            <!--<th>流程计划完成时间</th>-->
            <!--<th>流程完成时间</th>-->
            <!--<th>预警提示</th>-->
            <!--<th>操作记录</th>-->
            <!--<th>操作</th>-->
          <!--</tr>-->
          <!--</thead>-->
          <!--<tr v-if="listChild.length > 0" v-for="(item, key) in listChild" :key="key">-->
            <!--<td>{{item.id}}</td>-->
            <!--<td>{{item.project_no}}</td>-->
            <!--<td>{{item.name}}</td>-->
            <!--<td>{{item.planner }}</td>-->
            <!--<td v-if="item.childFlow !== null">{{item.childFlow.flow_id | flowName}}</td>-->
            <!--<td v-else></td>-->
            <!--<td v-if="item.childFlow !== null">{{item.childFlow.status | productStatus}}</td>-->
            <!--<td v-else></td>-->
            <!--<td v-if="item.childFlow !== null">{{item.childFlow.checkStatus | parseCheckStatus}}</td>-->
            <!--<td v-else></td>-->
            <!--&lt;!&ndash;<td><el-button @click="onReceiveStatus(item)">{{item.receive_status | receiveStatus}}</el-button></td>&ndash;&gt;-->
            <!--<td>{{item.plan_completed_at | parseTime}}</td>-->
            <!--<td v-if="item.childFlow !== null">{{item.childFlow.flow_at | parseTime}}</td>-->
            <!--<td v-else></td>-->
            <!--<td v-if="item.childFlow !== null">{{item.childFlow.complete_at | parseTime}}</td>-->
            <!--<td v-else></td>-->
            <!--<td v-if="item.childFlow === null"></td>-->
            <!--<td v-else-if="item.childFlow.status < 6"><el-tooltip :content="item.childFlow.flow_at | parseHint" placement="top"><div :class="(item.childFlow.flow_at - time) | getAlertClass"></div></el-tooltip></td>-->
            <!--<td v-else><el-tooltip content="该阶段已完成"><el-button type="success"  size="mini" icon="el-icon-check" circle></el-button></el-tooltip></td>-->
            <!--<td><projectChild :id="item.id"></projectChild></td>-->
            <!--<td v-if="item.childFlow !== null"> <el-button icon="el-icon-edit" @click="onClickDialog(item)">修改</el-button> </td>-->
            <!--<td v-else><el-button icon="el-icon-circle-plus" @click="onSubmitChildAdd(item)">添加</el-button></td>-->
          <!--</tr>-->
          <!--<tr v-else>-->
            <!--<td style="background: #8b8b8b;color: white">你没有任务</td>-->
          <!--</tr>-->
        <!--</table>-->
      <!--</div>-->
      <div id="dialog">
        <el-dialog :title="this.markVisible===false?'修改阶段':'新增阶段'" :visible.sync="dialogVisible" width="30%" >
          <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="110px" class="demo-ruleForm" size="mini">
            <el-form-item label="项目阶段" prop="flow_id">
              <el-select  v-model="ruleForm.flow_id" placeholder="选择阶段" style="width: 100%;" @change="changeFlow">
                <el-option :label="val.name" :value="val.id" v-for="(val, key) in flow" :key="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产状态" prop="status">
              <el-select v-model="ruleForm.status" placeholder="选择状态" style="width: 100%;">
                <el-option :label="val.name" :value="val.id" v-for="(val, key) in stage" :key="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="出版进度" v-if="printStatus" prop="checkStatus">
              <el-select v-model="ruleForm.checkStatus" placeholder="选择出版进度" style="width: 100%">
                <el-option v-for="(item, key) in checkStatus" :label="item.name" :value="item.id" :key="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计划完成日期" prop="flow_at">
              <el-date-picker
                v-model="ruleForm.flow_at"
                type="date"
                value-format="timestamp"
                placeholder="选择日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="完成日期" v-if="parseState" prop="complete_at">
              <el-date-picker
                v-model="ruleForm.complete_at"
                type="date"
                value-format="timestamp"
                placeholder="选择日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="onSubmitForm('ruleForm')">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
      <div id="dialogChild">
        <el-dialog :title="this.dialogVisible===true?'新增阶段':'修改阶段'" :visible.sync="dialog" width="30%">
          <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="110px" class="demo-ruleForm">
            <el-form-item label="项目阶段" prop="flow_id">
              <el-select  v-model="ruleForm.flow_id" placeholder="选择阶段" style="width: 100%;" @change="changeChlidFlow">
                <el-option :label="val.name" :value="val.id" v-for="(val, key) in flow" :key="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产状态" prop="status">
              <el-select v-model="ruleForm.status" placeholder="选择状态" style="width: 100%;" >
                <el-option :label="val.name" :value="val.id" v-for="(val, key) in stage" :key="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="出版进度" v-if="printStatus"  prop="checkStatus">
              <el-select v-model="ruleForm.checkStatus" placeholder="选择出版进度" style="width: 100%">
                <el-option v-for="(item, key) in checkStatus" :label="item.name" :value="item.id" :key="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计划完成日期" prop="flow_at">
              <el-date-picker
                v-model="ruleForm.flow_at"
                type="date"
                value-format="timestamp"
                placeholder="选择日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="完成日期" prop="complete_at">
              <el-date-picker
                v-model="ruleForm.complete_at"
                type="date"
                value-format="timestamp"
                placeholder="选择日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialog = false">取 消</el-button>
              <el-button type="primary" @click="onSubmitChildForm('ruleForm')">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import { updateFlowType, viewsFlowType, createFlowType } from '../../../api/flowType'
  import { parseTime } from '../../../utils/index'
  import { updateChildFlow, viewsChildFlow, createChildFlow } from '../../../api/childFlow'
  import { getProjects, getTask, updateProject, getProject } from '../../../api/project'
  import { getProjectChild, getProjectChildId } from '../../../api/projectChild'
  import { createFlowHistory } from '../../../api/flowHistory'
  import { taskProjectChild } from '../../../api/projectChild'
  import { createChildFlowHistory } from '../../../api/ChildflowHistory'
  import taskChild from './module/taskChild'
  import projectChild from './module/projectChild'
  import { replyRes } from '../../../utils/res'

  const defaultRuleform = {
    complete_at: null,
    flow_at: null,
    flow_id: null,
    status: 0,
    checkStatus: null,
    project_id: null,
    project_child_id: null
  }
  export default {
    name: 'myTask',
    data() {
      return {
        list: [],
        listChild: [],
        ruleForm: Object.assign({}, defaultRuleform),
        markVisible: false, // 一个标记,false表示修改,true表示添加
        projectName: {}, // 项目名称
        projectChildName: {}, // 子项目名称
        loading: {
          customers: false,
          users: false
        },
        planCom: null, // 项目的的整个计划完成时间
        planComChild: null, // 子项目的真个计划完成时间
        loadingChild: {
          customers: false,
          users: false
        },
        rules: {
          status: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          flow_at: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          checkStatus: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          complete_at: [
            { required: true, message: '请输入', trigger: 'blur' }
          ]
        },
        searchForm: {
          project_id: null,
          start_at: null,
          branch_id: 2,
          end_at: null,
          page: 1,
          pageSize: 5,
          totalCount: 0
        },
        searchFormChild: {
          project_child_id: null,
          start_at: null,
          end_at: null,
          branch_id: 2,
          page: 1,
          pageSize: 5,
          totalCount: 0
        },
        flow: [
          { name: '项目建议书', id: 1 },
          { name: '可研阶段', id: 2 },
          { name: '初设阶段', id: 3 },
          { name: '施工图阶段', id: 4 }
        ],
        time: Date.parse(new Date()) / 1000,
        stage: [
          { id: 0, name: '未开始' },
          { id: 1, name: '前期工作' },
          { id: 2, name: '勘查设计' },
          { id: 3, name: '内部校审' },
          { id: 4, name: '概预算编制' },
          { id: 5, name: '成果提交' },
          { id: 6, name: '验收通过' }
        ],
        checkStatus: [
          { name: '送校核', id: 0 },
          { name: '返回设计', id: 1 },
          { name: '送审核', id: 2 },
          { name: '送批准', id: 3 },
          { name: '返回审核', id: 4 },
          { name: '已完成', id: 5 }
        ],
        pageInfoChild: {
          page: 1,
          pageSize: 5,
          totalCount: 0
        },
        dialogVisible: false,
        dialog: false,
        flowId: null
      }
    },
    components: { // 祖册组件
      taskChild,
      projectChild
    },
    computed: {
      parseState() {
        if (this.ruleForm.status === 6) {
          return true
        }
        return false
      },
      printStatus() {
        if (this.ruleForm.status === 3) {
          return true
        }
        return false
      }
    },
    filters: {
      parseTime: function(value) {
        if (value === null) {
          return '_________'
        }
        return parseTime(value, '{y}-{m}-{d}')
      },
      flowName: function(value) {
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
      receiveStatus: function(value) {
        if (value === 0) {
          return '未收款'
        }
        if (value === 1) {
          return '可收款'
        }
        if (value === 2) {
          return '收款中'
        }
        if (value === 3) {
          return '部分收款'
        }
        if (value === 4) {
          return '完成收款'
        }
        return value
      },
      productStatus: function(value) {
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
      parseCheckStatus: function(value) {
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
      this.fetchTask()
      this.fetchTaskProjectChild()
    },
    methods: {
      // 获取主项目我的任务
      fetchTask() {
        getTask(this.searchForm).then(res => {
          this.list = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      // 获取子项目的任务
      fetchTaskProjectChild() {
        taskProjectChild(this.searchFormChild).then(res => {
          this.listChild = res.data._items
          this.searchFormChild.totalCount = res.data._meta.totalCount
        })
      },
      // 切换项目阶段自动初始化表单
      changeFlow() {
        if (this.ruleForm.flow_id === this.flowId) {
          this.fetchViewsFlowType(this.ruleForm.project_id)
        } else {
          Object.assign(this.ruleForm, { flow_at: null, checkStatus: null, status: 0 })
        }
      },
      changeChlidFlow() {
        if (this.ruleForm.flow_id === this.flowId) {
          this.fetchViewsChildFlow(this.ruleForm.project_child_id)
        } else {
          Object.assign(this.ruleForm, { flow_at: null, checkStatus: null, status: 0 })
        }
      },
      // 我去当前主项目信息
      fetchViewsFlowType(id) {
        viewsFlowType({ project_id: id }).then(res => {
          res.data.complete_at > 0 ? res.data.complete_at *= 1000 : null
          res.data.flow_at > 0 ? res.data.flow_at *= 1000 : null
          this.ruleForm = res.data
          this.flowId = this.ruleForm.flow_id
        })
      },
      // 获取计划完成时间
      fetchProject(id) {
        getProject({ id: id }).then(res => {
          this.planCom = res.data.plan_completed_at
        })
      },
      fetchProjectChildId(id) {
        getProjectChildId({ id: id }).then(res => {
          this.planComChild = res.data.plan_completed_at
        })
      },
      // 获取对应id的子项目信息
      fetchViewsChildFlow(id) {
        viewsChildFlow({ project_child_id: id }).then(res => {
          res.data.complete_at > 0 ? res.data.complete_at *= 1000 : null
          res.data.flow_at > 0 ? res.data.flow_at *= 1000 : null
          this.ruleForm = res.data
          this.flowId = this.ruleForm.flow_id
        })
      },
      // 打开子的修改
      onClickDialog(item) {
        this.fetchViewsChildFlow(item.id)
        this.fetchProjectChildId(item.id)
        this.markVisible = false // 表示修改
        this.dialog = true
      },
      // 打开主的修改
      onSubmitEdit(item) {
        this.fetchProject(item.id)
        this.fetchViewsFlowType(item.id)
        this.markVisible = false // 表示修改
        this.dialogVisible = true
      },
      // 打开主项目的增加
      onSubmitAdd(item) {
        this.ruleForm.project_id = item.id
        this.markVisible = true // 表示添加
        this.dialogVisible = true
      },
      onSubmitChildAdd(item) {
        this.ruleForm.project_child_id = item.id
        this.dialog = true
        this.markVisible = true // 表示添加
      },
      // 修改收款状态
      onReceiveStatus(item) {
        updateProject({ id: item.id, receive_status: 1 }).then(res => {
          if (replyRes(res)) {
            this.fetchTask()
          }
        })
      },
      // 修改状态提交
      onSubmitForm(formName) {
        this.ruleForm.flow_at > 0 ? this.ruleForm.flow_at /= 1000 : null
        this.ruleForm.complete_at > 0 ? this.ruleForm.complete_at /= 1000 : null
        if (this.planCom !== null && this.planCom < this.ruleForm.flow_at) {
          this.$message({
            message: '流程计划完成的时间不能大于,项目的完成时间',
            type: 'warning'
          })
          this.dialogVisible = false
          return false
        }
        if (this.markVisible === true) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              return createFlowType(this.ruleForm).then(res => {
                if (replyRes(res)) {
                  this.dialogVisible = false
                  this.fetchTask()
                }
              }).then(() => {
                createFlowHistory(this.ruleForm).then(res => {
                  console.log(res)
                  this.ruleForm = Object.assign({}, defaultRuleform)
                })
              })
            } else {
              return false
            }
          })
        } else {
          if (this.ruleForm.checkStatus < 5 && this.ruleForm.status > 3) {
            this.dialogVisible = false
            this.$message('设计图未完成,不能进入下一阶段生产')
          } else {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                return updateFlowType(this.ruleForm).then(res => {
                  if (replyRes(res)) {
                    this.dialogVisible = false
                    this.fetchTask()
                  }
                }).then(() => {
                  createFlowHistory(this.ruleForm).then(res => {
                    console.log(res)
                    this.ruleForm = Object.assign({}, defaultRuleform)
                  })
                })
              } else {
                return false
              }
            })
          }
        }
      },
      // 子项目提交
      onSubmitChildForm(formName) {
        this.ruleForm.flow_at > 0 ? this.ruleForm.flow_at /= 1000 : null
        this.ruleForm.complete_at > 0 ? this.ruleForm.complete_at /= 1000 : null
        if (this.planComChild !== null && this.planComChild < this.ruleForm.flow_at) {
          this.$message({
            message: '流程计划完成的时间不能大于,项目的完成时间',
            type: 'warning'
          })
          this.dialog = false
          return false
        }
        if (this.markVisible === true) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              return createChildFlow(this.ruleForm).then(res => {
                if (replyRes(res)) {
                  this.dialog = false
                  this.fetchTaskProjectChild()
                }
              }).then(() => {
                createChildFlowHistory(this.ruleForm).then(res => {
                  console.log(res)
                })
              })
            } else {
              return false
            }
          })
        } else {
          if (this.ruleForm.checkStatus < 5 && this.ruleForm.status > 3) {
            this.dialogVisible = false
            this.$message('设计图未完成,不能进入下一阶段生产')
          } else {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                return updateChildFlow(this.ruleForm).then(res => {
                  if (replyRes(res)) {
                    this.dialog = false
                    this.fetchTaskProjectChild()
                  }
                  console.log(res)
                }).then(() => {
                  createChildFlowHistory(this.ruleForm).then(res => {
                    console.log(res)
                  })
                })
              } else {
                return false
              }
            })
          }
        }
      },
      // 远程搜索主项目
      remoteMethod(query) {
        this.loading.customers = true
        let params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getProjects(params).then(res => {
          this.projectName = res.data._items
          this.loading.customers = false
        })
      },
      // 获取子项目的搜索信息
      remoteMethodChild(query) {
        this.loadingChild.customers = true
        let params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getProjectChild(params).then(res => {
          this.projectChildName = res.data
          this.loadingChild.customers = false
        })
      },
      // 一页多少行
      handleSizeChange(pageSize) {
        this.searchForm.pageSize = pageSize
        this.fetchTask()
      },
      // 翻页
      handlePageChange(currentPage) {
        this.searchForm.page = currentPage
        this.fetchTask()
      },
      handleSizeChangeChild(pageSize) {
        this.searchFormChild.pageSize = pageSize
        this.fetchTaskProjectChild()
      },
      handlePageChangeChild(currentPage) {
        this.searchFormChild.page = currentPage
        this.fetchTaskProjectChild()
      },
      // 搜索
      onSubmitSearchForm() {
        this.fetchTask()
      },
      // 搜索
      onSubmitSearchChildForm() {
        this.fetchTaskProjectChild()
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
    margin-bottom: 5px;
  }
  .apply_header1 .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 5px;
  }
</style>
