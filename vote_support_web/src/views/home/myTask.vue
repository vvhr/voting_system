<template>
  <div class="app-container">
    <!--创建任务流水节点表单-->
    <el-dialog title="任务节点" :visible.sync="dialogVisible" width="620" :before-close="handleClose">
      <el-form :model="taskFlowForm" :rules="rules" ref="taskFlowForm" label-width="50px" class="demo-ruleForm">
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="taskFlowForm.content" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">取 消</el-button>
        <el-button @click="submitForm('taskFlowForm')">确 定</el-button>
      </span>
    </el-dialog>


    <!--任务列表-->
    <table class="_table" border="0" cellpadding="0" cellspacing="0">

      <thead>
        <tr><th>id</th><th>任务名称</th><th>任务状态</th><th>任务内容</th><th>创建时间</th><th>到期时间</th><th>剩余天数</th><th>操作</th></tr>
      </thead>

      <tbody v-for="(task, key) in tasks" :key="key">
        <tr>
          <td>{{task.id}}</td>
          <td>{{task.name}}</td>
          <td>{{taskStatus[task.status]}}</td>
          <td style="max-width:200px;word-wrap:break-word;word-break:break-all;">
            {{task.content}}
          </td>
          <td>{{task.created_at | parseTime}}</td>
          <td>{{task.ended_at | parseTime}}</td>
          <td>{{parseInt((task.ended_at - ((new Date())/1000))/86400)}}</td>
          <td>
            <el-button @click="onClickBtn01(task.id, task.status)"><i class="el-icon-edit"></i> 增加节点</el-button>
            <el-button @click="onCompleteTask(task.id, task.status)"><i class="el-icon-edit"></i> 标记完成</el-button>
          </td>
        </tr>
        <tr>
          <td colspan="8">
            <div style="display: flex; flex-wrap:wrap">
              <div v-for="(item, key) in task.task_flow" :key="key" style="padding: 5px">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span><{{key + 1}}> {{item.id}} {{item.created_at | parseTime}}</span>
                  </div>
                  <p>
                    {{item.content}}
                  </p>
                </el-card>
              </div>
            </div>

          </td>
        </tr>
      </tbody>

    </table>
  </div>
</template>

<script>
  import { changeTaskStatus, getTasks } from '@/api/task'
  import { parseTime } from '@/utils/index'
  import { createTaskFlow } from '@/api/taskFlow'
  import _ from 'lodash'

  export default {
    data() {
      return {
        taskStatus: { 1: '执行中', 2: '已完成' },
        dialogVisible: false,
        tasks: [],
        taskFlowForm: {
          task_id: '',
          content: ''
        },
        rules: {
          content: [
            { required: true, message: '请输入任务节点详情', trigger: 'change' }
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
    mounted() {
      this.fetchTasks()
    },
    methods: {
      fetchTasks() {
        getTasks({ user_id: this.$store.state.user.userId, expand: 'task_flow' }).then(res => {
          this.tasks = res.data._items
          for (const index in this.tasks) {
            this.tasks[index].task_flow = _.orderBy(this.tasks[index].task_flow, ['id'], ['asc'])
          }
        })
      },
      onClickBtn01(task_id, status) {
        if (status === 2) {
          this.$message({
            type: 'warning',
            message: '该任务已完成!'
          })
          return
        }
        console.log('i will add a task flow:' + task_id)
        this.taskFlowForm.task_id = task_id
        this.dialogVisible = true
      },
      onCompleteTask(task_id, status) {
        if (status === 2) {
          this.$message({
            type: 'warning',
            message: '该任务已完成!'
          })
          return
        }

        this.$confirm('此操作将不可撤消, 真的要结束这个任务并完成吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          changeTaskStatus({ id: task_id, status: 2 }).then(res => {
            if (res.data.bCode === 101) {
              this.$message({
                type: 'success',
                message: '成功完成任务!'
              })
              this.fetchTasks()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            createTaskFlow(this.taskFlowForm).then(res => {
              if (res.data.bCode === 101) {
                this.$notify({
                  title: '成功',
                  message: '新增成功',
                  type: 'success',
                  position: 'top-right'
                })
                this.fetchTasks()
                this.dialogVisible = false
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
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleClose() {
        console.log('i will close')
      }
    }
  }
</script>

