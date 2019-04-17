<template>
    <div class="app-container">
      <div class="apply_header" style="background: #d3e8f1;padding-top: 5px;border-radius: 10px">
        <el-form size="mini" label-width="100px">
          <el-form-item label="搜索栏">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
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
              <div style="display: flex;justify-content:flex-start">
                <el-button type="primary"  size="mini" @click="onClickCreateApply" sizi="small" icon="el-icon-plus" style="height: 30px;margin-right: 20px">创建申请</el-button>
                <el-radio-group v-model="isShowValid" @change="onSubmitIsShoValid" style="height: 28px;" size="small">
                  <el-radio-button label="有效"></el-radio-button>
                  <el-radio-button label="无效"></el-radio-button>
                </el-radio-group>
                <el-badge :value="waitApplyCount" class="item">
                <el-button type="primary" size="small" @click="onSubmitWaitApproval" icon="el-icon-search" style="margin-left: 10px;height: 30px;">待考核</el-button>
                </el-badge>
                <el-button type="primary" size="small" @click="onSubmitSearchPay" icon="el-icon-search" style="margin-left: 10px;height: 30px;">查看已申请付款</el-button>
              </div>
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
          <el-table-column label="项目名称" header-align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.project.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="工人组别" align="center" prop="workerGroup.name" width="100"></el-table-column>
          <!--<el-table-column label="工人组别" align="center" width="100">-->
            <!--<template slot-scope="scope">-->
              <!--<span>{{ scope.row.worker_group | parseGroup}}</span>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column label="合同单价" align="center" width="100">-->
            <!--<template slot-scope="scope"><div style="color: #2276d2">{{ scope.row.project_price}}</div></template>-->
          <!--</el-table-column>-->
          <el-table-column label="工人名称" width="100" align="center">
            <template slot-scope="scope"><div style="color: #2276d2">{{ scope.row.worker_name === null ? '未审核' : scope.row.worker_name}}</div></template>
          </el-table-column>
          <el-table-column label="分公司" width="100" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.branch}}</span>
            </template>
          </el-table-column>
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
              <div v-if="scope.row.worker_excel !== null"><i class="el-icon-document"></i><a :href="imgUrl[0] + scope.row.worker_excel" style="color: green;">工程量文档说明</a></div>
              <div v-else>未考核</div>
            </template>
          </el-table-column>
          <el-table-column prop="start_at" label="用工开始日期" :formatter="dateFormat" align="center" width="100"></el-table-column>
          <el-table-column prop="end_at" label="用工结束日期" :formatter="dateFormat" align="center" width="100"></el-table-column>
          <el-table-column prop="project_introduce" label="用工合同介绍" align="center" width="100" ></el-table-column>
          <el-table-column label="工人考核"  fixed="right" align="center" width="150">
            <!--isShowLeaderApply-->
            <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="onclickWorkerApproval(scope.row)" v-if="scope.row.leader_state === 1 && scope.row.create_state === 0">工人考核</el-button>
                <el-button type="primary" size="mini" @click="onclickWorkerApproval(scope.row)" v-else disabled="">工人考核</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--弹出窗口-->
      <div class="dialog">
        <el-dialog
          title="用工申请"
          :visible.sync="approveDialogVisible"
          width="30%"
          :before-close="handleClose">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" size="mini">
            <el-form-item label="申请类型" :disabled="true">
              <el-select v-model.number="ruleForm.type" placeholder="请选择活动区域" prop="type">
                <el-option label="用工申请" :value="1"></el-option>
              </el-select>
            </el-form-item>
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
            <el-form-item label="一级审核人" prop="product_approver_id">
              <el-select
                v-model="ruleForm.product_approver_id"
                filterable
                remote
                reserve-keyword
                placeholder="关键词搜索，空格表示全部"
                :remote-method="remoteMethodApproval"
                :loading="loading.firstApproval"
                style="width: 100%">
                <el-option
                  v-for="item in firstApproval"
                  :key="item.id"
                  :label="item.username"
                  :value="item.approval_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用工工种" prop="worker_type">
              <el-select v-model.number="ruleForm.worker_type" placeholder="请选择审批状态">
                <el-option label="排查" :value="1"></el-option>
                <el-option label="物探" :value="2"></el-option>
                <el-option label="施工" :value="3"></el-option>
                <el-option label="其他" :value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="工人数量" prop="worker_number">
              <el-input v-model.number="ruleForm.worker_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="用工合同介绍">
              <el-input v-model="ruleForm.project_introduce"></el-input>
            </el-form-item>
            <el-form-item label="用工开始日期" prop="start_at">
              <el-date-picker
                v-model="ruleForm.start_at"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="用工结束日期" prop="end_at">
              <el-date-picker
                v-model="ruleForm.end_at"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="approveDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onSubmitWorkerApply('ruleForm')" size="mini">提 交</el-button>
        </span>
        </el-dialog>
      </div>
      <div class="dialog">
        <el-dialog
          title="工人考核"
          :visible.sync="workerVisible"
          width="30%"
          :before-close="handleClose">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" size="mini">
            <el-form-item label="结算价">
              <el-input v-model.number="ruleForm.amount_cost" type="number"></el-input>
            </el-form-item>
            <el-form-item label="用工合同价" >
            <el-input v-model.number="ruleForm.project_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="用工合同单价" >
              <el-input v-model.number="ruleForm.worker_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="实际用工天数">
              <el-input v-model.number="ruleForm.use_day" type="number"></el-input>
            </el-form-item>
            <el-form-item label="工程量" >
              <el-input v-model="ruleForm.worker_sum"></el-input>
            </el-form-item>
            <el-form-item label="工程量文档说明">
              <el-upload
                class="upload-demo"
                ref="upload"
                :data="uploadFile"
                :headers="headersAuth"
                :action="actionUrl+ 'worker-apply/upload'"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-change="handleChange"
                :file-list="fileList"
                :auto-upload="false"
                :limit="1">
                <el-button slot="trigger" size="mini" type="success">选择文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传excel文件，且不超过1000kb</div>
              </el-upload>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="workerVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onSubmitWorkerCost('ruleForm')" size="mini">提 交</el-button>
        </span>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import { getProjects } from '../../../api/project'
  import { replyRes } from '../../../utils/res'
  import { createWorkerApply, getWorkerApplys, updateWorkerApply, getWorkerApply, getWorkerApplyTotal } from '../../../api/workerApply'
  import { parseTime } from '../../../utils'
  import { getWorkerApplysConfig } from '../../../api/workerApplyConfig'
  import { updateProject } from '../../../api/project'

  const defaultRuleform = {
    type: 1, // 用工申请
    project_id: null,
    applyer_id: null, // 申请人ID
    amount_cost: null, // 工人费用
    worker_name: null,
    project_price: null,
    project_introduce: '',
    waitApproval: null,
    start_at: null,
    end_at: null,
    worker_price: null, // 合同单价
    use_day: null, // 用工天数
    worker_number: null,
    worker_type: null, // 用工工种
    worker_sum: null, // 工程量
    worker_state: 0
  }

  const searchForm = {
    expand: 'project,user,branch,product,productApproval',
    page: 1,
    pageSize: 10,
    totalCount: 0,
    valid: 1,
    type: 1,
    applyer_id: null, // 申请人
    create_state: null,
    time: []
  }
  export default {
    name: 'myApproval',
    data() {
      return {
        approveDialogVisible: false, // 用工申请窗口状态(是否显示)
        workerVisible: false, // 工人付款窗口状态
        ruleForm: Object.assign({}, defaultRuleform), // 修改和创建表单
        headersAuth: { 'Authorization': 'Bearer ' + this.$store.getters.token }, // header信息,用于传递token
        fileList: [],
        actionUrl: process.env.BASE_API + '/',
        imgUrl: process.env.BASE_API.split('index.php/v1'),
        uploadFile: { id: null, imageFieldName: '' }, // 文件上传附带参数
        rules: {
          project_id: [
            { required: true, message: '请选择项目', trigger: 'blur' }
          ],
          worker_type: [
            { required: true, message: '用工工种', trigger: 'blur' }
          ],
          project_price: [
            { required: true, message: '请填写合同单价', trigger: 'blur' }
          ],
          project_introduce: [
            { required: true, message: '请填写合同介绍', trigger: 'blur' }
          ],
          start_at: [
            { required: true, message: '请选择时间', trigger: 'blur' }
          ],
          end_at: [
            { required: true, message: '请选择时间', trigger: 'blur' }
          ],
          amount_cost: [
            { required: true, message: '请填写工人费用', trigger: 'blur' }
          ],
          worker_number: [
            { required: true, message: '请填写工人费用', trigger: 'blur' }
          ],
          product_approver_id: [
            { required: true, message: '请填写工人付款备注', trigger: 'blur' }
          ],
          type: [
            { type: 'array', required: true, message: '选择申请类型', trigger: 'blur' }
          ],
          apply_content: [
            { required: true, message: '请填写申请内容', trigger: 'blur' }
          ]
        },
        project_name: {}, // 远程搜索的项目信息
        firstApproval: {}, // 一级审核人信息
        loading: {
          firstApproval: false
        },
        workerApplyList: [], // 申请列表
        searchForm: Object.assign({}, searchForm), // 筛选表单
        isShowValid: '有效',
        waitApplyCount: null,
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
      this.fetchWorkerApplys()
      this.fetchWorkerApplyTotal()
      console.log(this.imgUrl[0])
    },
    filters: {
      parseState: function(value) {
        if (value === 1) {
          return '已审核'
        }
        if (value === 2) {
          return '已驳回'
        }
        return '未审核'
      },
      /** table表格日期格式化 */
      dateFormat(value) {
        if (value === null) {
          return '_________'
        }
        return parseTime(value, '{y}-{m}-{d}')
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
        this.searchForm.applyer_id = this.$store.getters.userId
        return getWorkerApplys(this.searchForm).then(res => {
          this.workerApplyList = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      fetchWorkerApply(id) {
        getWorkerApply({ id: id }).then(res => {
          this.ruleForm = res.data
        })
      },
      /** 获取待考核申请*/
      fetchWorkerApplyTotal() {
        getWorkerApplyTotal({ waitApproval: 1 }).then(res => {
          this.waitApplyCount = res.data
        })
      },
      /** 创建申请按钮 **/
      onClickCreateApply() {
        this.approveDialogVisible = true
      },
      /** 工人审批按钮*/
      onclickWorkerApproval(item) {
        this.fetchWorkerApply(item.id)
        this.workerVisible = true
        this.uploadFile.id = item.id
        this.uploadFile.imageFieldName = 'worker_excel'
      },
      /** 提交用工申请申请负责人审批 */
      onSubmitWorkerApply(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.approveDialogVisible === true) {
              this.ruleForm.applyer_id = this.$store.getters.userId
              /** 创建用工申请 **/
              return createWorkerApply(this.ruleForm).then(res => {
                if (replyRes(res)) {
                  this.approveDialogVisible = false
                  this.fetchWorkerApplys()
                }
                return true
              }).then(res => {
                console.log(this.ruleForm.project_id)
                updateProject({ id: this.ruleForm.project_id, isUseWorker: 1 }).then(res => {
                  console.log('项目是否用工的状态', res)
                })
                this.ruleForm = Object.assign({}, defaultRuleform)
              })
            } else {
              this.$message.error('错了哦,你无权进行操作')
            }
          } else {
            return false
          }
        })
      },
      /** 工人考核提交 */
      onSubmitWorkerCost(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.workerVisible = false
            this.ruleForm.worker_state = 1
            updateWorkerApply(this.ruleForm).then(res => {
              if (replyRes(res)) {
                this.$refs.upload.submit()
                this.fetchWorkerApplys()
              }
            })
          }
        })
      },
      /** 查看有效还是无效 */
      onSubmitIsShoValid() {
        this.searchForm.waitApproval = null
        this.searchForm.time = []
        this.searchForm.valid === 1 ? this.searchForm.valid = 0 : this.searchForm.valid = 1
        this.searchForm.create_state = null
        this.fetchWorkerApplys()
      },
      /** 重置*/
      onSubmitReset() {
        this.searchForm = Object.assign({}, searchForm)
      },
      /** 搜索功能 */
      onSubmitSearch() {
        this.searchForm.waitApproval = null
        this.searchForm.valid = 1
        this.searchForm.create_state = null
        this.fetchWorkerApplys()
      },
      onSubmitSearchPay() {
        this.searchForm.waitApproval = null
        this.searchForm.time = []
        this.searchForm = Object.assign({}, searchForm, { create_state: 1 })
        this.fetchWorkerApplys()
      },
      /** 待考核*/
      onSubmitWaitApproval() {
        this.searchForm.waitApproval = 1
        this.fetchWorkerApplys()
      },
      /** 远程搜索客户列表方法 */
      remoteMethod(query) {
        this.loading.customers = true
        let params = {}
        if (query !== null && query.trim() !== '') {
          params = { name: query.trim() }
        }
        getProjects(Object.assign(params, { isUseWorker: 0 })).then(res => {
          this.project_name = res.data._items
          this.loading.customers = false
        })
      },
      /** 远程搜索客户列表方法 */
      remoteMethodApproval(query) {
        this.loading.firstApproval = true
        let params = {}
        if (query !== null && query.trim() !== '') {
          params = { name: query.trim() }
        }
        getWorkerApplysConfig(Object.assign(params, { type: 1 })).then(res => {
          this.firstApproval = res.data._items
          this.loading.firstApproval = false
        })
      },
      handlePreview(file) {
        console.log(file)
      },
      handleChange(file, fileList) {
        console.log('__', file)
      },
      /** 移除上传文件列表 */
      handleRemove(file, fileList) {
        console.log('__', fileList)
      },
      /** 申请窗口关闭时调用方法 */
      handleClose() {
        this.approveDialogVisible = false
        this.workerVisible = false
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
      /** table表格日期格式化 */
      dateFormat(row, column) {
        return parseTime(row[column.property], '{y}-{m}-{d}')
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
</style>
