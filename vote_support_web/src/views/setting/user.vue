<template>
  <div class="app-container">
    <div id="app" style="width: 100%;display:inline-block">
        <el-form :inline="true" :model="searchForm" ref="searchForm" label-width="70px" class="demo-ruleForm">
          <el-form-item label="员工姓名" prop="name">
            <el-input v-model="searchForm.username"></el-input>
          </el-form-item>
          <el-form-item label="部门" prop="department_id">
            <el-cascader
              :props ="{ value:'id', label:'name', children: 'department' }"
              :options="branches"
              v-model="department_ids"
              @change="onChangeSearch">
            </el-cascader>
          </el-form-item>
          <el-form-item label="状态" prop="status" label-width="60px">
            <el-select v-model="searchForm.status" placeholder="搜索在职或离职">
              <el-option
                v-for="item in status"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitSearchForm()" icon="el-icon-search">搜索员工</el-button>
            <el-checkbox v-model="checked.showLeaved" @change="onSubmitShowLeave()">显示已离职员工</el-checkbox>
          </el-form-item>
        </el-form>
    </div>
    <el-dialog
      title="员工添加"
      :visible.sync="visible.dialogVisible"
      width="40%">
    <!--提交表单-->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="员工姓名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>

        <el-form-item label="部门" prop="department_id">
          <el-cascader
            :props ="{ value:'id', label:'name', children: 'department' }"
            :options="branches"
            v-model="department_ids"
            @change="onChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="职位" prop="role_id">
          <el-select v-model="ruleForm.role_id" placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限组" prop="access_group_id">
          <el-select v-model="ruleForm.access_group_id" >
            <el-option
              v-for="item in accessGroups"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button @click="test()">test</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-button type="primary" @click="submitFormAdd()">创建员工</el-button>
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
    <div>
      <table class="_table" border="0" cellpadding="0" cellspacing="0" style="width: 100%">
        <thead>
        <tr>
          <th>员工ID</th>
          <th>用户名</th>
          <th>分公司</th>
          <th>部门</th>
          <th>岗位</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
        </thead>
        <tr v-for="(item, key) in users" :key="key">
          <td>{{item.id}}</td>
          <td>{{item.username}}</td>
          <td>{{item.branch_name}}</td>
          <td>{{item.department_name}}</td>
          <td>{{item.role_name}}</td>
          <td>{{item.status === 2?'已离职':'正常'}}</td>
          <td><el-button type="primary" icon="el-icon-edit" @click="onSubmitEdit(item)" size="mini" > 修改员工信息 </el-button></td>
        </tr>
      </table>
    </div>
    <el-dialog
      title="员工修改"
      :visible.sync="visible.dialogEdit"
      width="40%">
      <!--提交表单-->
      <el-form :model="ruleFormEdit" ref="ruleFormEdit" label-width="100px" class="demo-ruleForm">
        <el-form-item label="部门" prop="department_id">
          <el-cascader
            :props ="{ value:'id', label:'name', children: 'department' }"
            :options="branches"
            v-model="department_ids"
            @change="onChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="职位" prop="role_id">
          <el-select v-model="ruleFormEdit.role_id" placeholder="请选择职位">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="ruleFormEdit.status" placeholder="请选择状态">
            <el-option
              v-for="st in status"
              :key="st.id"
              :label="st.name"
              :value="st.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFormEdit('ruleForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
  <!--
      Permissions on this page:
      页面访问: read_user   beforeMount()
      新增员工: create_user submitFormAdd()
      修改员工: update_user onSubmitEdit()
  -->
</template>

<script>
  import { createUser, getUsers, getView, updateUser } from '@/api/user'
  import { getRoles } from '@/api/role'
  import { getAccessGroup } from '../../api/access'

  export default
  {
    data() {
      return {
        visible: {
          dialogVisible: false,
          dialogEdit: false
        },
        status: [
          { id: 0, name: '全部' },
          { id: 1, name: '在职' },
          { id: 2, name: '已离职' }
        ],
        // 权限组
        accessGroups: [],
        users: [],
        roles: [],
        department_ids: ['4', '11'],
        ruleForm: {
          access_group_id: 13,
          name: '',
          password: '123456',
          department_id: '11',
          role_id: '',
          page: 1,
          pageSize: 10,
          totalCount: 0
        },
        ruleFormEdit: {
          department_id: null,
          role_id: null
        },
        searchForm: {
          username: '',
          role_id: null,
          department_id: null,
          page: 1,
          pageSize: 10,
          totalCount: 0,
          status: 1
        },
        rules: {
          name: [
            { required: true, message: '请输入员工姓名', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          department_id: [
            { required: true, message: '请选择部门', trigger: 'blur' }
          ],
          role_id: [
            { required: true, message: '请选择岗位', trigger: 'blur' }
          ],
          access_group_id: [
            { required: true, message: '请选择权限', trigger: 'blur' }
          ]
        },
        checked: {
          showLeaved: false
        }
      }
    },
    computed: {
      branches() {
        return this.$store.state.user.branches
      }
    },
    mounted() {
      getRoles().then(res => {
        this.roles = res.data
      })
      this.onSubmitSearchForm()
      this.fetchAccessGroups()
    },
    methods: {
      test() {
        console.log(this.$store.state.user.branches)
      },
      fetchUsers() {
        getUsers(this.searchForm).then(res => {
          this.users = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      fetchView(id) {
        getView({ id: id }).then(res => {
          this.department_ids[0] = res.data.department_branch.toString()
          this.department_ids[1] = res.data.department_id.toString()
          this.ruleFormEdit = res.data
        })
      },
      /** 接口类 获取权限组*/
      fetchAccessGroups(params) {
        getAccessGroup(params).then(res => {
          this.accessGroups = res.data._items
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('test---ruleForm', this.ruleForm)
            createUser(this.ruleForm).then(res => {
              if (res.data.bCode === 101) {
                this.fetchUsers()
                this.$notify({
                  title: '成功',
                  message: '新增成功',
                  type: 'success',
                  position: 'top-right'
                })
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
              this.visible.dialogVisible = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      onSubmitEdit(item) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_user#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.fetchView(item.id)
        this.visible.dialogEdit = true
      },
      submitFormEdit() {
        console.log(this.ruleFormEdit)
        updateUser(this.ruleFormEdit).then(res => {
          if (res.code === 101) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.fetchUsers()
            this.visible.dialogEdit = false
          } else {
            this.$message.error('修改失败')
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      onChange(node) {
        this.ruleForm.department_id = node[node.length - 1]
        this.ruleFormEdit.department_id = node[node.length - 1]
      },
      onChangeSearch(node) {
        this.searchForm.department_id = node[node.length - 1]
      },
      // 一页多少行
      handleSizeChange(pageSize) {
        this.searchForm.pageSize = pageSize
        this.fetchUsers()
      },
      // 翻页
      handlePageChange(currentPage) {
        this.searchForm.page = currentPage
        this.fetchUsers()
      },
      /** 新增员工 被点击事件 */
      submitFormAdd() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('create_user#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.visible.dialogVisible = true
      },
      // 搜索员工
      onSubmitSearchForm() {
        this.fetchUsers()
      },
      // 显示已离职
      onSubmitShowLeave() {
        if (this.checked.showLeaved === true) {
          this.searchForm.status = null
        } else this.searchForm.status = 1
        this.fetchUsers()
      }
    },
    // 页面权限检查 如无权限则跳转至404
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_user#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>
