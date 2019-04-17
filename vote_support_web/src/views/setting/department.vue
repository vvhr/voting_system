<template>
  <div class="app-container">
    <div id="app" style="width: 100%;display:inline-block">
      <el-form :model="searchForm" ref="searchForm" label-width="70px" class="demo-ruleForm">
        <el-col :span="3">
          <el-form-item label="员工姓名" prop="planner">
            <el-select
              v-model="searchForm.user_id"
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
        </el-col>
        <el-col :span="3">
          <el-form-item label="部门" prop="department_id">
            <el-cascader
              :props ="{ value:'id', label:'name', children: 'department' }"
              :options="branches"
              v-model="department_ids"
              @change="onChange">
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <!--<el-form-item>-->
          <el-button @click="onSubmitSearchForm()" icon="el-icon-search" circle style="float: right;margin-right: 50%"></el-button>
          <!--</el-form-item>-->
        </el-col>
      </el-form>
    </div>

    <!--部门负责人设置表单-->
        <el-dialog
          title="提示"
          :visible.sync="dialogAdd"
          width="30%">
        <!--提交表单-->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="所属分公司" prop="branch_id">
            <el-select v-model="ruleForm.branch_id" placeholder="请选择所属分公司">
              <el-option v-for="(branch, key) in branch" :label="branch.name" :value="branch.id" :key="key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
            <el-button @click="dialogAdd = false">取 消</el-button>
          </el-form-item>
        </el-form>
        </el-dialog>

    <!--部门负责人设置表单-->
    <el-dialog
      title="提示"
      :visible.sync="dialog2Visible"
      width="500px">
      <div>
        <el-select v-model="charge_user_id" placeholder="请选择">
          <el-option
            v-for="item in users"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog2Visible = false">取 消</el-button>
        <el-button type="primary" @click="submitSetChargeUserForm">确 定</el-button>
      </span>
    </el-dialog>
          <el-button type="primary" @click="submitFormAdd()">新增</el-button>

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
    <table class="_table" style="max-width: 1000px;border: solid 1px #f0f0f0">
      <thead>
      <tr>
        <th>id</th>
        <th>分公司</th>
        <th>部门</th>
        <th>部门负责人</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(v, k) in departments" :key="k">
        <td>{{v.id}}</td>
        <td>{{v.branch_name}}</td>
        <td>{{v.name}}</td>
        <td v-html="v.charge_user_name?v.charge_user_name:'<span style=\'color:red\'>请设置部门负责人</span>'"></td>
        <td>
          <el-button size="mini" type="primary" @click="onSetChargeUser(v.id)">设置部门负责人</el-button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>

</template>
<!--
    Permissions on this page:
    页面访问: read_department             beforeMount()
    新增部门: create_department           submitFormAdd()
    设置负责人: update_department_leader  onSetChargeUser()
-->
<script>
  import { getDepartments, creatDepartment, updateDepartment } from '@/api/department'
  import { getBranches } from '@/api/branch'
  import { getUsers } from '../../api/user'

  export default {
    data() {
      return {
        dialogVisible: false,
        dialog2Visible: false,
        dialogAdd: false,
        charge_user_id: null,
        branch: [],
        departments: [],
        users: [],
        active_department_id: null,
        ruleForm: {
          name: '',
          branch_id: '1'
        },
        department_ids: ['4', '11'],
        searchForm: {
          page: 1,
          pageSize: 10,
          totalCount: 0,
          department_id: null,
          branch_id: null,
          user_id: null
        },
        loading: {
          customers: false,
          users: false
        },
        user: {}, // 获取用户
        rules: {
          name: [
            { required: true, message: '请输入部门名称', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          branch_id: [
            { required: true, message: '请选择分公司', trigger: 'change' }
          ]
        }
      }
    },
    mounted() {
      this.fetchDepartments()
      this.fetchBranches()
    },
    computed: {
      branches() {
        return this.$store.state.user.branches
      }
    },
    methods: {
      test() {
        console.log(this.$store.state.user.branches)
      },
      fetchBranches() {
        getBranches().then(res => {
          this.branch = res.data
        })
      },
      fetchDepartments() {
        getDepartments(this.searchForm).then(res => {
          this.departments = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            creatDepartment(this.ruleForm).then(res => {
              console.log(res)
              if (res.data.bCode === 101) {
                getBranches().then(res => {
                  this.$store.commit('SET_BRANCHES', res.data)
                })
                this.fetchDepartments({ expand: 'branch_name, charge_user_name' })
                this.$message({
                  message: '创建部门成功',
                  type: 'success'
                })
              } else {
                this.$message.error('创建部门失败')
                console.log(this.data.bData)
              }
              this.dialogAdd = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      /** 设置部门负责人 按钮被点击事件 */
      onSetChargeUser(department_id) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_department_leader#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.active_department_id = department_id
        getUsers({ department_id: department_id }).then(res => {
          if (res.data._items.length > 0) {
            this.dialog2Visible = true
            this.users = res.data._items
            this.charge_user_id = this.users[0].id
          } else {
            this.$message.error('该部门还没有人员，请先在员工设置页面为该部门添加人员')
          }
        })
      },
      submitSetChargeUserForm() {
        updateDepartment({ id: this.active_department_id, user_id: this.charge_user_id }).then(res => {
          if (res.data.bCode === 101) {
            this.$message({
              message: '设置成功',
              type: 'success'
            })
            getBranches().then(res => {
              this.$store.commit('SET_BRANCHES', res.data)
            })
            this.fetchDepartments({ expand: 'branch_name, charge_user_name' })
            this.dialog2Visible = false
          } else {
            this.$message.error('设置失败')
            console.log(res.data.bData)
          }
        })
      },
      onChange(node) {
        console.log('test---', node)
        this.searchForm.department_id = node[node.length - 1]
      },
      // 一页多少行
      handleSizeChange(pageSize) {
        this.searchForm.pageSize = pageSize
        this.fetchDepartments()
      },
      // 翻页
      handlePageChange(currentPage) {
        this.searchForm.page = currentPage
        this.fetchDepartments()
      },
      /** 新增部门被点击事件 */
      submitFormAdd() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('create_department#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.dialogAdd = true
      },
      onSubmitSearchForm() {
        this.fetchDepartments()
      },
      /** 远程搜索员工列表方法 */
      remoteMethodFlow(query) {
        this.loading.customers = true
        let params = {}
        if (query !== null && query.trim() !== '') {
          params = { name: query.trim() }
        }
        console.log(params)
        getUsers(params).then(res => {
          this.user = res.data._items
          this.loading.customers = false
        })
      }
    },
    // 页面权限检查 如无权限则跳转至404
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_department#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>
