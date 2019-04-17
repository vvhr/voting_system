<template>
  <div class="app-container">
    <!--搜索表单-->
    <div>
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="分公司">
          <el-select v-model="searchForm.branch_id" placeholder="请选择所属分公司">
            <el-option label="所有" :value="0" :key="-1"></el-option>
            <el-option v-for="(branch, key) in branches" :label="branch.name" :value="parseInt(branch.id)" :key="key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="所有" :value="0" :key="-1"></el-option>
            <el-option v-for="(value, key) in taskStatus" :label="value" :value="parseInt(key)" :key="key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="创建日期">
          <el-date-picker
            v-model="searchForm.dateRange"
            value-format = "timestamp"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button @click="onSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onCreateTask"><i class="el-icon-edit"></i> 新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--创建任务的表单-->
    <el-dialog title="编辑任务" :visible.sync="dialogVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="115px" class="demo-ruleForm">
        <el-form-item label="部门" prop="department_id" v-if="editMode === 1">
          <el-cascader
            :props ="{ value:'id', label:'name', children: 'department' }"
            :options="branches"
            v-model="department_ids"
            @change="onChangeDepartment">
          </el-cascader>
        </el-form-item>

        <el-form-item label="职员" prop="user_id" v-if="editMode === 1">
          <el-select v-model="ruleForm.user_id" placeholder="请选择">
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <span style="color: #a0a0a0">此处默认为部门负责人</span>
        </el-form-item>

        <el-form-item label="任务名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入任务名称"></el-input>
        </el-form-item>

        <el-form-item label="计划完成时间" prop="ended_at">
          <el-date-picker
            v-model="ruleForm.ended_at"
            type="date"
            format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="任务内容" prop="content">
          <el-input type="textarea" v-model="ruleForm.content" :rows="3" placeholder="请输入任务名称"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!--分页器-->
    <div style="padding:0 10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.currentPage"
        :page-sizes="[2,5,10,20,30]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.totalCount">
      </el-pagination>
    </div>
    <!--任务列表-->
    <table class="_table">
      <thead>
        <tr>
          <th>id</th>
          <th>任务名称</th>
          <th>任务内容</th>
          <th>执行人</th>
          <th>任务状态</th>
          <th>创建时间</th>
          <th>剩余天数</th>
          <th>操作</th>
          <th>录入者</th>
        </tr>
      </thead>
      <tbody>
       <tr v-for="(item, key) in tasks" :key="key">
         <td style="width: 50px">{{item.id}}</td>
         <td style="width: 200px">{{item.name}}</td>
         <td style="width: 700px">{{item.content}}</td>
         <td style="width: 100px">{{item.user_name}}</td>
         <td style="width: 80px">{{taskStatus[item.status]}}</td>
         <td style="width: 100px">{{item.created_at | parseTime}}</td>
         <td style="width: auto">{{parseInt((item.ended_at - item.created_at)/86400)}} 天</td>
         <td>
           <el-button @click="onUpdateTask(item.id, item.creator_id)"><i class="el-icon-edit"></i> 修改</el-button>
           <el-button @click="onDeleteTask(item.id, item.creator_id)"><i class="el-icon-delete"></i> 删除</el-button>
         </td>
         <td style="width: 100px">{{item.creator_name}}</td>
       </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { getUsers } from '@/api/user'
  import { deleteTask, updateTask, getTask, getTasks, createTask } from '@/api/task'
  import { parseTime } from '@/utils/index'

  const _date = new Date()
  const defaultRuleForm = {
    id: 0,
    user_id: null,
    content: '',
    ended_at: _date.setMonth(_date.getMonth() + 1),
    name: ''
  }

  export default {
    data() {
      return {
        // 带快捷键的时间选择器选项参数
        pickerOptions: {
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
        searchForm: {
          branch_id: 0,
          status: 0,
          dateRange: []
        },
        pageInfo: {
          currentPage: 1,
          pageSize: 5,
          totalCount: 0
        },
        // 1 为create 2 为update
        taskStatus: { 1: '执行中', 2: '已完成' },
        editMode: 1,
        dialogVisible: false,
        users: [],
        tasks: [],
        department_ids: [],
        ruleForm: Object.assign({}, defaultRuleForm),
        rules: {
          content: [
            { required: true, message: '请输入任务内容', trigger: 'blur' }
          ],
          user_id: [
            { required: true, message: '请选择职员', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入任务名称', trigger: 'blur' }
          ],
          ended_at: [
            { required: true, message: '请选择任务完成日期', trigger: 'blur' }
          ]
        }
      }
    },
    filters: {
      parseTime: function(value) {
        if (!value) return ''
        value = value.toString()
        return parseTime(value, '{y}-{m}-{d}')
      }
    },
    computed: {
      branches() {
        return this.$store.state.user.branches
      },
      finalSearchForm() {
        const res = Object.assign({}, this.searchForm)
        res.expand = 'user_name,department_name,branch_name,creator_name'
        if (res.dateRange !== null && res.dateRange.length > 0) {
          res.started_at = Math.floor(res.dateRange[0] / 1000)
          res.ended_at = Math.floor(res.dateRange[1] / 1000)
        } else {
          res.started_at = 0
          res.ended_at = 0
        }
        res.pageSize = this.pageInfo.pageSize
        res.page = this.pageInfo.currentPage
        return res
      }
    },
    mounted() {
      // this.fetchUsers('11')
      this.fetchTasks(this.finalSearchForm)
      const _date = new Date()
      _date.setMonth(_date.getMonth() + 1)
      this.ruleForm.ended_at = _date
    },
    methods: {
      findChargeUserIdByDepartmentId(department_id) {
        for (const k in this.branches) {
          for (const sub_k in this.branches[k].department) {
            // console.log('branch', this.branches[k])
            // console.log(this.branches[k].department[sub_k].id, '=', department_id)
            if (this.branches[k].department[sub_k].id === department_id) {
              // console.log('current selected department', this.branches[k].department[sub_k])
              return this.branches[k].department[sub_k].user_id ? parseInt(this.branches[k].department[sub_k].user_id) : null
            }
          }
        }
      },
      fetchUsers(department_id) {
        getUsers({ department_id: department_id }).then(res => {
          this.users = res.data._items
          if (this.users[0] !== undefined) {
            // this.ruleForm.user_id = this.users[0].id
            this.ruleForm.user_id = this.findChargeUserIdByDepartmentId(department_id)
          } else {
            this.ruleForm.user_id = null
          }
        })
      },
      fetchTasks(params) {
        getTasks(params).then(res => {
          this.tasks = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
        })
      },
      // option是当前部门级联数组
      onChangeDepartment(option) {
        this.fetchUsers(option[option.length - 1])
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params = Object.assign({}, this.ruleForm)
            params.ended_at = Math.floor(params.ended_at / 1000)
            if (this.editMode === 1) {
              createTask(params).then(res => {
                if (res.data.bCode === 101) {
                  this.$notify({
                    title: '成功',
                    message: '新增成功',
                    type: 'success',
                    position: 'top-right'
                  })
                  this.dialogVisible = false
                  this.fetchTasks(this.finalSearchForm)
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
              })
            } else if (this.editMode === 2) {
              updateTask(params).then(res => {
                if (res.data.bCode === 101) {
                  this.$notify({
                    title: '成功',
                    message: '修改成功',
                    type: 'success',
                    position: 'top-right'
                  })
                  this.dialogVisible = false
                  this.fetchTasks(this.finalSearchForm)
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
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      onCreateTask() {
        this.editMode = 1
        this.ruleForm = Object.assign({}, defaultRuleForm)
        this.dialogVisible = true
      },
      onUpdateTask(id, creator_id) {
        if (this.$store.state.user.userId !== creator_id) {
          this.$notify({
            title: '警告',
            message: '你只能修改自己创建的记录',
            type: 'warning',
            position: 'top-right'
          })
          return
        }
        this.editMode = 2
        getTask(id).then(res => {
          res.data.ended_at *= 1000
          this.ruleForm = res.data
          this.dialogVisible = true
        })
      },
      onDeleteTask(id, creator_id) {
        if (this.$store.state.user.userId !== creator_id) {
          this.$notify({
            title: '警告',
            message: '你只能删除自己创建的记录',
            type: 'warning',
            position: 'top-right'
          })
          return
        }
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteTask(id).then(res => {
            this.fetchTasks(this.finalSearchForm)
            if (res.data.bCode === 101) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else if (res.data.bCode === 102) {
              this.$message({
                type: 'error',
                message: res.data.bData.msg
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      onSearch() {
        this.fetchTasks(this.finalSearchForm)
      },
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize
        this.fetchTasks(this.finalSearchForm)
      },
      handleCurrentChange(currentPage) {
        this.pageInfo.currentPage = currentPage
        this.fetchTasks(this.finalSearchForm)
      }
    }
  }
</script>
