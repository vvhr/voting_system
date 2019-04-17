<template>
  <div class="app-container">
    <!--基础报销表格-->
    <div>
      <!-- 表格头部组件 -->
      <el-form :inline="true" ref="searchForm" :model="searchForm" label-width="100px">
        <div>
          <!--科目明细管理-->
          <el-form-item>
            <el-button @click="onGoToSbj()" type="primary" icon="el-icon-edit">科目明细管理</el-button>
          </el-form-item>
          <!--查询功能-->
          <el-form-item label="项目名称">
            <el-input style="width: 300px" placeholder="请输入完整的项目名称" v-model="searchForm.pro_name"></el-input>
          </el-form-item>
          <el-form-item label="报销人" prop="cost_user_id" label-width="70px">
            <el-select
              v-model="searchForm.cost_user_id"
              filterable
              remote
              reserve-keyword
              placeholder="请输入报销人姓名，空格查看全部"
              :remote-method="remoteCostUsers">
              <el-option
                v-for="costUser in costUsers"
                :key="costUser.id"
                :label="costUser.name"
                :value="costUser.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button @click="onSelect" icon="el-icon-search" type="primary">点击查询</el-button>
        </div>
        <div>
        </div>
      </el-form>
    </div>
    <!--分页器-->
    <div class="block" align="center">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.totalCount">
      </el-pagination>
    </div>
    <div>
      <el-tag class='tips' type="success">温馨提示:本页面只显示源通电力分公司的项目下的物资采购记录,如果要显示全公司所有项目的请前往[综合行政]-[项目报销]-[物资采购]页面查看!</el-tag><br />
      <!--选择框-->
      <el-checkbox v-model="show_proof">显示凭证号</el-checkbox>
      <el-checkbox v-model="show_sbjR">显示实际科目</el-checkbox>
      <el-checkbox v-model="show_sbj">显示面单科目</el-checkbox>
      <el-checkbox v-model="show_project_number">显示项目编号</el-checkbox>
      <el-checkbox v-model="show_project_name">显示项目名称</el-checkbox>
      <el-checkbox v-model="show_department">显示报销人部门</el-checkbox>
      <el-checkbox v-model="show_input_user">显示录入人</el-checkbox>
      <el-checkbox v-model="show_use" v-if="checkAccess.use">显示用途</el-checkbox>
      <el-checkbox v-model="show_note" v-if="checkAccess.note">显示备注</el-checkbox>
      <el-checkbox v-model="show_action">显示操作栏</el-checkbox>
      <!--基础报销表格-->
      <div>
        <el-table border :data="costs" id="goods" :row-style="rowStyle" :cell-style="cellStyle" stripe fit>
          <el-table-column align="center" prop="id" label="ID" width="80"></el-table-column>
          <el-table-column align="center" prop="date" label="日期" width="100" :formatter="dateFormat"></el-table-column>
          <el-table-column align="center" prop="proof_no" label="凭证号" width="120" v-if="show_proof"></el-table-column>
          <el-table-column align="center" prop="pro_number" label="项目编号" width="300" v-if="show_project_number"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="project.name" label="工程名称" v-if="show_project_name"></el-table-column>
          <el-table-column align="center" prop="branch_name" label="承建分公司" width="100"></el-table-column>
          <el-table-column align="center" prop="cost_user_name" label="报销人" width="80"></el-table-column>
          <el-table-column align="center" prop="input_user_name" label="录入人" width="80" v-if="show_input_user"></el-table-column>
          <el-table-column align="center" prop="department_name" label="报销人部门" width="100" v-if="show_department"></el-table-column>
          <el-table-column align="center" prop="type_name" label="报销类型" width="80"></el-table-column>
          <el-table-column align="center" prop="subject.name" label="面单科目" width="150" v-if="show_sbj"></el-table-column>
          <el-table-column align="center" prop="really_subject.name" label="实际科目" width="150" v-if="show_sbjR"></el-table-column>
          <el-table-column align="center" prop="money" label="金额" width="100"></el-table-column>
          <el-table-column align="center" prop="use" label="用途" width="300" v-if="show_use"></el-table-column>
          <el-table-column align="center" prop="note" label="备注" width="150" v-if="show_note"></el-table-column>
          <el-table-column align="center" label="操作" width="150" v-if="show_action">
            <template slot-scope="scope">
              <el-button @click="onUpdate(scope.row.id)" type="warning" class="btnUpdate" icon="el-icon-edit">修改</el-button>
              <!--<el-button @click="onDeleteUser(scope.row.id)" type="danger" class="btnDelete" icon="el-icon-delete"> 删除</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_goodsCost_YT             beforeMount()
    添加物资采购记录: create_costGoods_YT    onAdd()
    修改物资采购记录: update_costGoods_YT    onUpdate()
    -
    跳转报销科目: read_sbjType   onGoToSbj()
-->
<script>
  import { getGoods, getType, getSbjType, createGoods } from '../../../api/costGoods'
  import { parseTime } from '../../../utils'
  import { getBranches } from '../../../api/branch'
  import { getUsers } from '../../../api/user'
  import { getProjects } from '../../../api/project'

  export default {
    name: 'basicCost',
    data() {
      return {
        costs: [], // 报销表
        users: [], // 用户表
        types: [], // 报销类型
        sbjs: [], // 报销科目
        pros: [], // 项目查询
        costUsers: [], // 报销人查询
        // 总页数
        pageInfo: {
          currentPage: 1,
          pageSize: 20,
          totalCount: 0
        },
        searchForm: {
          branch_name: '',
          branch_id: null,
          type_name: '',
          sbj_name: '',
          cost_user_name: '',
          cost_user_id: null,
          pro_name: ''
        },
        addFormVisible: false,
        updateVisible: false,
        excelFormVisible: false,
        // 当前选中的项目id
        activeID: null,
        // 表单表头隐藏选择框
        show_project_name: true,
        show_project_number: false,
        show_department: false,
        show_use: true,
        show_note: false,
        show_action: false,
        show_proof: true,
        show_sbj: true,
        show_sbjR: false,
        show_input_user: false,
        branch: [
          { id: null, name: '全部' }
        ],
        checkAccess: {
          use: true,
          note: true
        }
      }
    },
    filters: {
      parseTime(value) {
        if (!value) return ''
        value = value.toString()
        return parseTime(value, '{y}-{m}-{d}')
      }
    },
    methods: {
      /** 用途和备注 选择框权限检查*/
      checkUseAndNote() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('read_basicCost_UseAndNote#') === false) {
          this.checkAccess.use = false
          this.checkAccess.note = false
          this.show_use = false
          this.show_note = false
        }
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
        getProjects(params).then(res => {
          this.pros = res.data._items
        })
      },
      /** 查询按钮 被点击事件 */
      onSelect() {
        this.searchForm.branch_id = 5
        this.fetchCosts(this.searchForm)
      },
      /** 完成按钮 被点击事件 */
      onExcelComplete() {
        this.excelFormVisible = false
        this.fetchCosts()
      },
      /** 修改按钮 被点击事件 */
      onUpdate(id) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_costGoods_YT#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }

        this.activeID = id
        this.updateVisible = true
      },
      /** 添加按钮 被点击事件*/
      onAdd() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('create_costGoods_YT#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.addFormVisible = true
      },
      /** 提交表单 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ruleForm.date = Math.floor(this.ruleForm.date / 1000)
            console.log(this.ruleForm)
            createGoods(this.ruleForm).then(res => {
              if (res.data.bCode === 101) {
                this.$notify({
                  title: '成功',
                  message: '新增成功',
                  type: 'success',
                  position: 'top-right'
                })
                this.fetchCosts({ branch_id: 5 })
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
      // 通过接口获取报销科目列表
      fetchCosts(params) {
        getGoods(params).then(res => {
          this.costs = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
        })
      },
      fetchUsers() {
        getUsers().then(res => {
          this.users = res.data._items
        })
      },
      fetchSbjType() {
        getSbjType().then(res => {
          this.sbjs = res.data
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
      /** -------- 表格样式设置方法 -------- */
      rowStyle() {
        return 'height: 25px'
      },
      cellStyle() {
        return 'padding: 2px'
      }
    },
    mounted() {
      this.fetchCosts({ branch_id: 5 })
      this.fetchBranches()
      this.fetchUsers()
      this.fetchSbjType()
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
      if (this.actionCheck_.actionCheck('read_goodsCost_YT#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style scoped>
  .btnUpdate{
    margin-right: 10px;
    padding-bottom: 6px;
    padding-top: 6px;
    padding-right: 10px;
    padding-left: 10px
  }
  .btnDelete{
    margin-right: 10px;
    padding-bottom: 6px;
    padding-top: 6px;
    padding-right: 10px;
    padding-left: 10px
  }
  .tips{
    margin-bottom: 5px;
    margin-top: 5px;
  }
</style>
