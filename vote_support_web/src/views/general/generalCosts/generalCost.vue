<template>
  <div class="app-container">
    <!--添加新报销对话框表单-->
    <div class="cost-dialog">
      <el-dialog title="添加新报销记录" :visible.sync="addFormVisible" style="width: 100%">
        <el-form :rules="rules" :model="ruleForm" ref="ruleForm" label-width="100px" size="mini">
          <el-form-item label="面单日期" prop="date">
            <el-date-picker v-model="ruleForm.date" value-format="timestamp" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="打款日期" prop="date">
            <el-date-picker v-model="ruleForm.paid_at" value-format="timestamp" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="凭证号" prop="proof_no">
            <el-input style="width: 150px" v-model="ruleForm.proof_no" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="分组名称" prop="group_id">
            <el-select v-model="ruleForm.group_id" filterable remote reserve-keyword placeholder="关键词搜索，空格表示全部" :remote-method="remoteMethod" style="width: 400px">
              <el-option v-for="group in groups" :key="group.id" :label="group.name" :value="group.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报销分公司" prop="cost_branch_id">
            <el-select v-model="ruleForm.cost_branch_id" placeholder="请选择报销所在分公司">
              <el-option v-for="item in branches" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报销人" prop="cost_user_id">
            <el-select
              v-model="ruleForm.cost_user_id"
              filterable
              remote
              reserve-keyword
              placeholder="请输入报销人姓名"
              :remote-method="remoteCostUsers">
              <el-option
                v-for="costUser in costUsers"
                :key="costUser.id"
                :label="costUser.name"
                :value="costUser.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报销类型" prop="type_id">
            <el-select v-model="ruleForm.type_id" placeholder="请选择">
              <el-option v-for="type in types" :key="type.id" :label="type.name" :value="type.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="金额" prop="money">
            <el-input style="width: 150px" v-model="ruleForm.money" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用途" prop="use">
            <el-input type="textarea" autosize style="width: 300px" v-model="ruleForm.use" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="面单科目" prop="sbj_id">
            <el-select v-model="ruleForm.sbj_id" placeholder="请选择">
              <el-option
                v-for="sbj in sbjs"
                :key="sbj.id"
                :label="sbj.name"
                :value="sbj.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实际科目" prop="sbjR_id">
            <el-select v-model="ruleForm.sbjR_id" placeholder="请选择">
              <el-option
                v-for="sbj in sbjs"
                :key="sbj.id"
                :label="sbj.name"
                :value="sbj.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" style="width: 300px" v-model="ruleForm.note" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="操作" >
            <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            <el-button @click="addFormVisible = false">取 消</el-button>
            <el-button @click="resetForm('ruleForm')">重 置</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>
    </div>
    <!--修改功能-->
    <el-dialog
      title="提示"
      :visible.sync="updateVisible"
      width="30%">
      <span>暂不支持修改</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!--批量导入EXCEL窗格-->
    <!--导入提示 组件-->
    <el-dialog
      title="通过Excel表格一键导入 - 综合报销"
      :visible.sync="excelFormVisible"
      width="80%">
      <el-collapse style="width: 650px" v-model="activeNames" accordion>
        <el-collapse-item title="导入步骤: 选择Excel文件 → 点击数据检查 → 点击确认添加" name="1">
          <div>1.选择文件:在下面点击按钮,选择您要导入的表格文件,文件选择完后会自动检查表格格式,检查是否不该为空的数据有空.</div>
          <div>2.数据检查:格式检查通过后请您点击下面的[数据检查]按钮,将自动为您检查所有数据是否正确.</div>
          <div>3.确认添加:只有当所有数据都检查正确后,您就可以点击下面的[确认添加]按钮,您可以根据进度条查看进度!</div>
        </el-collapse-item>
        <el-collapse-item title="导入要求1: 文件要求" name="2">
          <div>1.导入的Excel文件必须是xls/xlsx/csv格式!</div>
          <div>2.导入的文件大小不得超过5mb,超过5mb可能您就选错了文件.</div>
          <div>3.一次性导入的数据不得超过300条,避免数据过多出现不可预料的错误.</div>
          <div>4.请勿在网络状况不佳的时候导入,容易出错.</div>
        </el-collapse-item>
        <el-collapse-item title="导入要求2: 表头要求" name="3">
          <div>1.表头规定为11项：*面单日期、凭证号、*分组名称、*报销人、*分公司、*报销类型、*金额、*用途、*实际科目、*面单科目、备注</div>
          <div>2.有*号的为必填，不得有空</div>
          <div>3.综合报销和项目报销的表头相同！</div>
        </el-collapse-item>
        <el-collapse-item title="导入要求3: 内容要求" name="4">
          <div>1.日期那一栏请设置为文本格式的 2018/00/00 格式!(提示:如果您将日期转换到文本时变成了5位数整数,那么您可以使用这种方法:将日期那一栏选中，点击[数据]-[分列]-点击下一步-点击下一步-勾选"文本"-完成)</div>
          <div>2.Excel中报销类型请填写为：行政 / 经营 / 工程 / 其他</div>
          <div>3.Excel中科目明细必须为：本平台报销科目中已存在的科目明细名称</div>
          <div>4.Excel中的报销人必须为：本平台中已存在的员工姓名</div>
          <div>5.Excel中分组名称必须为：本平台报销分组中已存在分组名称</div>
          <div>6.Excel中项目名称必须为：本平台经营管理中已存在项目名称</div>
          <div>7.分公司默认为项目或分组所属分公司，如有特殊情况，请在备注中注明。</div>
        </el-collapse-item>
      </el-collapse>
      建议您下载表格模板：<a style="color: #DD4A68" href="http://oaapi.hjdlsz.com/Demo3.xls"> <i class="el-icon-download">报表模板[通用]</i></a><br />
      <uploadExcel></uploadExcel>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="onExcelComplete">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 表格头部组件 -->
    <div class="searchForm-style-01">
      <el-form :inline="true" ref="searchForm" :model="searchForm" label-width="100px">
          <!--查询功能-->
        <el-row class="rowStyle-01">
          <el-form-item label="搜索栏" >
            <el-input @keyup.enter.native="onQuery" size="small" style="width: 80px" v-model="searchForm.id" placeholder="报销ID"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input @keyup.enter.native="onQuery" size="small" style="width: 250px" v-model="searchForm.group_name" placeholder="项目/分组名称,输入关键字"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select
              @keyup.enter.native="onQuery"
              style="width: 120px"
              v-model="searchForm.cost_user_id" size="small"
              filterable remote reserve-keyword
              placeholder="报销人"
              :remote-method="remoteCostUsers">
              <el-option v-for="costUser in costUsers" :key="costUser.id" :label="costUser.name" :value="costUser.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select @keyup.enter.native="onQuery" size="small" v-model="searchForm.cost_branch_name" placeholder="选择分公司" style="width: 140px">
              <el-option v-for="b in branch" :key="b.id" :label="b.name" :value="b.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select @keyup.enter.native="onQuery" size="small" v-model="searchForm.sbjR_id" placeholder="选择实际科目" style="width: 140px">
              <el-option v-for="b in sbjs_all" :key="b.id" :label="b.name" :value="b.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input @keyup.enter.native="onQuery" size="small" style="width: 100px" v-model="searchForm.money" placeholder="报销金额"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input @keyup.enter.native="onQuery" size="small" style="width: 100px" v-model="searchForm.use" placeholder="用途"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="rowStyle-01">
          <el-form-item label="面单日期" >
            <el-date-picker
              @keyup.enter.native="onQuery"
              size="small"
              v-model="searchForm.date"
              type="datetimerange"
              value-format = "timestamp"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="付款日期" >
            <el-date-picker
              @keyup.enter.native="onQuery"
              size="small"
              v-model="searchForm.paid_at"
              type="datetimerange"
              range-separator="-"
              value-format = "timestamp"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <!--<el-button type="text" icon="el-icon-caret-bottom"-->
            <!--@click="advancedSearchVisible = !advancedSearchVisible">{{advancedSearchVisible === true?'收起':'展开'}}高级搜索</el-button>-->
            <el-button size="small" @click="onQuery" icon="el-icon-search" type="primary">点击查询</el-button>
            <el-button size="small" @click="onClickCleanSearch()" type="primary" icon="el-icon-circle-close-outline">重置</el-button>
          </el-form-item>
        </el-row>
        <el-row class="rowStyle-01">
          <el-form-item label="操作选项">
            <div class="actionBar">
              <!--添加新项-->
              <el-button size="small" @click="onAdd()" type="danger" icon="el-icon-plus">添加报销记录</el-button>
              <!--导入EXCEL-->
              <el-button size="small" @click="onAddExcel()" type="danger" icon="el-icon-upload2">通过Excel导入</el-button>
              <!--科目明细管理-->
              <el-button size="small" @click="onGoToSbj()" type="primary" icon="el-icon-menu">科目管理</el-button>
              <!--查看垃圾箱-->
              <el-button size="small" @click="onShowInvalid()" type="primary" icon="el-icon-view">{{showInvalid === true?'返回':'查看回收站'}}</el-button>
              <!--修复数据-->
              <el-button size="small" @click="onClickFixed()" icon="el-icon-refresh">修复数据</el-button>
            </div>
          </el-form-item>
        </el-row>
        <el-row class="rowStyle-01">
          <el-form-item label="表项显示">
          <!--选择框-->
          <el-checkbox v-model="show_proof">凭证号</el-checkbox>
          <el-checkbox v-model="show_sbjR">实际科目</el-checkbox>
          <el-checkbox v-model="show_sbj">面单科目</el-checkbox>
          <el-checkbox v-model="show_group_number">分组编号</el-checkbox>
          <el-checkbox v-model="show_group_name">分组名称</el-checkbox>
          <el-checkbox v-model="show_input_user">录入人</el-checkbox>
          <el-checkbox v-model="show_department">报销人部门</el-checkbox>
          <el-checkbox v-model="show_use" v-if="checkAccess.use">用途</el-checkbox>
          <el-checkbox v-model="show_note" v-if="checkAccess.note">备注</el-checkbox>
          <el-checkbox v-model="show_valid" >是否有效</el-checkbox>
          <el-checkbox v-model="show_action">操作栏</el-checkbox>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <!--分页器-->
    <div class="paginationStyle-01" align="center">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.currentPage"
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.totalCount">
      </el-pagination>
    </div>
    <!--基础报销表格-->
    <div>
      <el-table v-loading="loading" border :data="costs" id="cost" :row-style="rowStyle" :cell-style="cellStyle" stripe fit show-summary>
        <el-table-column align="center" prop="id" label="ID" width="80"></el-table-column>
        <el-table-column align="center" prop="date" label="面单日期" width="100" :formatter="dateFormat"></el-table-column>
        <el-table-column align="center" prop="paid_at" label="打款日期" width="100" :formatter="dateFormat"></el-table-column>
        <el-table-column align="center" prop="proof_no" label="凭证号" width="120" v-if="show_proof"></el-table-column>
        <el-table-column align="center" prop="group_number" label="分组编号" width="150" v-if="show_group_number"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="group_name" label="分组名称" width="280" v-if="show_group_name"></el-table-column>
        <el-table-column align="center" prop="cost_branch_name" label="报销分公司" width="100"></el-table-column>
        <el-table-column align="center" prop="cost_user_name" label="报销人" width="80"></el-table-column>
        <el-table-column align="center" prop="input_user_name" label="录入人" width="80" v-if="show_input_user"></el-table-column>
        <el-table-column align="center" prop="department_name" label="报销人部门" width="100" v-if="show_department"></el-table-column>
        <el-table-column align="center" prop="type_name" label="报销类型" width="80"></el-table-column>
        <el-table-column align="center" prop="subject.name" label="面单科目" width="150" v-if="show_sbj"></el-table-column>
        <el-table-column align="center" prop="really_subject.name" label="实际科目" width="150" v-if="show_sbjR"></el-table-column>
        <el-table-column align="right" header-align="center" prop="money" label="金额" width="130"></el-table-column>
        <el-table-column align="center" prop="use" label="用途" width="280" v-if="show_use"></el-table-column>
        <el-table-column align="center" prop="note" label="备注" width="200" v-if="show_note"></el-table-column>
        <el-table-column align="center" label="有效性" width="80" v-if="show_valid">
          <template slot-scope="scope">
            {{scope.row.valid === 1?'正常':'已删除'}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="生成类型" width="130">
          <template slot-scope="scope">
            {{scope.row.apply_id !== null?('申请(ID:'+scope.row.apply_id+')'):'补录'}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200" v-if="show_action">
          <template slot-scope="scope">
            <!--<el-button @click="onUpdate(scope.row.id)" type="warning" class="btnUpdate" icon="el-icon-edit">修改</el-button>-->
            <!--<el-button @click="onDelete(scope.row.id)" type="danger" class="btnDelete" icon="el-icon-delete"> 删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_generalCost      beforeMount()
    添加记录: create_general        onAdd()
    Excel导入: create_general_Excel onAddExcel()
    修改记录: update_general         onUpdate()
    显示用途和备注:read_generalCost_UseAndNote    checkUseAndNote()
    -
    跳转报销科目: read_sbjType        onGoToSbj()
-->
<script>
  import { getGeneral, getType, getSbjType, createGeneral, getGroups } from '../../../api/costGeneral'
  import { parseTime } from '../../../utils/index'
  import { getBranches } from '../../../api/branch'
  import { getUsers } from '../../../api/user'
  import { fixed } from '../../../api/costApply'
  import uploadExcel from '../uploadExcelGeneral.vue'
  const defaultSearchForm = {
    id: null,
    money: null,
    sbjR_id: null,
    cost_branch_name: null,
    department_name: null,
    cost_branch_id: null,
    type_name: null,
    cost_user_name: null,
    cost_user_id: null,
    group_name: null,
    user: null,
    date: [],
    paid_at: []
  }
  export default {
    name: 'basicCost',
    data() {
      return {
        // 初始化搜索
        search: '',
        // 报销表
        costs: [],
        // 用户表
        users: [],
        // 报销类型
        types: [],
        // 报销科目
        sbjs: [],
        sbjs_all: [],
        // 分组查询
        groups: [],
        // 报销人查询
        costUsers: [],
        // 导入要求
        activeNames: ['0'],
        // 总页数
        pageInfo: {
          currentPage: 1,
          pageSize: 20,
          totalCount: 0
        },
        loading: false,
        searchForm: Object.assign({}, defaultSearchForm),
        // 表单表头隐藏选择框
        show_group_name: true,
        show_group_number: false,
        show_department: false,
        show_use: true,
        show_note: false,
        show_action: false,
        show_proof: false,
        show_sbj: false,
        show_sbjR: true,
        show_input_user: false,
        show_valid: true,
        // 可视属性
        addFormVisible: false,
        updateVisible: false,
        excelFormVisible: false,
        advancedSearchVisible: false,
        // 当前选中的项目id
        activeID: null,
        showInvalid: false, // 显示回收站
        ruleForm: {
          paid_at: null,
          date: null,
          group_id: null,
          cost_branch_id: null,
          cost_user_id: null,
          type_id: null,
          money: null,
          use: '',
          sbj_id: null,
          sbjR_id: null,
          note: '',
          input_user_id: null,
          proof_no: ''
        },
        // 定义输入规则
        rules: {
          date: [
            { required: true, message: '请选择日期', trigger: 'blur' }
          ],
          cost_user_id: [
            { required: true, message: '请输入报销人', trigger: 'blur' }
          ],
          cost_branch_id: [
            { required: true, message: '请选择分公司', trigger: 'blur' }
          ],
          group_id: [
            { required: true, message: '请选择工程名称', trigger: 'blur' }
          ],
          type_id: [
            { required: true, message: '请选择报销类型', trigger: 'blur' }
          ],
          money: [
            { required: true, message: '请输入报销金额', trigger: 'blur' }
          ],
          sbj_id: [
            { required: true, message: '请选择面单报销科目', trigger: 'blur' }
          ],
          sbjR_id: [
            { required: true, message: '请选择实际报销科目', trigger: 'blur' }
          ],
          use: [
            { required: true, message: '用途不得为空', trigger: 'blur' }
          ]
        },
        branch: [
          { id: null, name: '全部' }
        ],
        checkAccess: {
          use: true,
          note: true
        }
      }
    },
    components: {
      uploadExcel
    },
    filters: {
      parseTime(value) {
        if (!value) return ''
        value = value.toString()
        return parseTime(value, '{y}-{m}-{d}')
      }
    },
    methods: {
      onQuery() {
        // 判断选择器的选项
        this.loading = true
        if (this.searchForm.cost_branch_name === '全部') {
          this.searchForm.cost_branch_name = null
        }
        this.fetchCosts()
      },
      /** 查看回收站 */
      onShowInvalid() {
        if (this.showInvalid === false) {
          this.showInvalid = true
          getGeneral({ 'valid': 0 }).then(res => {
            this.costs = res.data._items
            this.pageInfo.totalCount = res.data._meta.totalCount
          })
        } else {
          this.showInvalid = false
          this.fetchCosts()
        }
      },
      /** 用途和备注 选择框权限检查*/
      checkUseAndNote() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('read_generalCost_UseAndNote#') === false) {
          this.checkAccess.use = false
          this.checkAccess.note = false
          this.show_use = false
          this.show_note = false
        }
      },
      /** Excel导入 被点击事件*/
      onAddExcel() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('create_general_Excel#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.excelFormVisible = true
      },
      /** 完成按钮 被点击事件 */
      onExcelComplete() {
        this.excelFormVisible = false
        this.fetchCosts()
      },
      /** 修改按钮 被点击事件 */
      onUpdate(id) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_general#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.activeID = id
        this.updateVisible = true
      },
      /** 添加记录 被点击事件*/
      onAdd() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('create_general#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.addFormVisible = true
      },
      /** 修复数据 被点击*/
      onClickFixed() {
        fixed({ applyType_id: 1 }).then(res => {
          console.log('正常更新:', res.data.success)
          console.log('失败:', res.data.failed)
          this.$message.success('已完成关联!')
        })
      },
      /** 清空搜索栏 */
      onClickCleanSearch() {
        this.searchForm = Object.assign({}, defaultSearchForm)
        this.fetchCosts(this.searchForm)
      },
      /** 跳转到报销科目栏目 **/
      onGoToSbj() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('read_sbjType#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.$router.push({ name: 'sbjType' })
      },
      /** 远程搜索客户列表方法 */
      remoteCostUsers(query) {
        let params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getUsers(params).then(res => {
          this.costUsers = res.data._items
        })
      },
      /** 远程搜索项目列表方法 */
      remoteMethod(query) {
        let params = {}
        params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getGroups(params).then(res => {
          this.groups = res.data._items
        })
      },
      /** 提交表单 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ruleForm.paid_at = Math.floor(this.ruleForm.paid_at / 1000)
            this.ruleForm.date = Math.floor(this.ruleForm.date / 1000)
            createGeneral(this.ruleForm).then(res => {
              if (res.data.bCode === 101) {
                this.fetchCosts()
                this.$notify({
                  title: '成功',
                  message: '新增成功',
                  type: 'success',
                  position: 'top-right'
                })
                this.resetForm(formName)
              } else {
                for (const key in res.data.bData) {
                  this.$notify({
                    title: '警告',
                    message: res.data.bData[key],
                    type: 'warning',
                    position: 'top-right'
                  })
                }
              }
              this.addFormVisible = false
            })
          } else {
            console.log('提交错误!!')
            return false
          }
        })
      },
      // 重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      // ----------- 接口获取类 -----------
      fetchCosts() {
        const params = Object.assign({}, this.finalSearchForm, { 'valid': 1 })
        getGeneral(params).then(res => {
          this.costs = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      },
      fetchUsers() {
        getUsers().then(res => {
          this.users = res.data._items
        })
      },
      fetchSbjType() {
        getSbjType({ valid: 1 }).then(res => {
          this.sbjs = res.data
        })
      },
      fetchSbjTypeAll() {
        getSbjType().then(res => {
          this.sbjs_all = res.data
        })
      },
      fetchType() {
        getType().then(res => {
          this.types = res.data
        })
      },
      // 获取承建公司列表
      fetchBranches() {
        getBranches().then(res => {
          for (const x in res.data) {
            this.branch.push(res.data[x])
          }
        })
      },
      // 时间格式化
      dateFormat(row, column) {
        const date = row[column.property]
        return parseTime(date, '{y}-{m}-{d}')
      },
      /** 分页器方法 */
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize
        this.fetchCosts(this.finalSearchForm)
      },
      handleCurrentChange(currentPage) {
        this.pageInfo.currentPage = currentPage
        this.fetchCosts(this.finalSearchForm)
      },
      /** 表格样式设置方法 */
      rowStyle() {
        return 'height: 25px'
      },
      cellStyle() {
        return 'padding: 2px'
      }
    },
    mounted() {
      this.checkUseAndNote()
      this.fetchCosts()
      this.fetchBranches()
      this.fetchUsers()
      this.fetchSbjType()
      this.fetchSbjTypeAll()
      this.fetchType()
    },
    computed: {
      branches() {
        return this.$store.state.user.branches
      },
      finalSearchForm() {
        const res = Object.assign({}, this.searchForm)
        res.pageSize = this.pageInfo.pageSize
        res.page = this.pageInfo.currentPage
        return res
      }
    },
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_generalCost#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style scoped>
.searchForm-style-01 {background-color: #e4f2fb;border-radius: 10px}
.searchForm-style-01 .rowStyle-01{height: 40px;}
</style>
<style>
  .paginationStyle-01 {background-color: rgb(107, 112, 115);border-radius:5px 5px;margin-top: 10px;}
  .paginationStyle-01 .el-pagination__jump {margin-left: 24px;font-weight: 400;color: #ffffff!important;}
  .paginationStyle-01 .el-pagination__total {margin-right: 10px;font-weight: 400;color: #ffffff!important;}

  .cost-dialog .el-dialog {width: 30%;}
</style>
