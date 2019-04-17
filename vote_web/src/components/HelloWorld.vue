<template>
  <div>
    欢迎访问在线投票系统<br>
    <a target="_blank" href="http://localhost:9528/"><el-button type="primary">已有账号,直接登录</el-button></a>
    <el-button type="success" @click="dialogFormVisible = true">注册账号</el-button>
    <el-dialog title="注册新账号" :visible.sync="dialogFormVisible" width="25%">
      <el-form :model="ruleForm">
        <el-form-item label="用户名" label-width="70px">
          <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="70px">
          <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="70px">
          <el-input v-model="ruleForm.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRuleForm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTest } from '../api/test'
import { createUser } from '../api/user'

const defaultRuleForm = {
  username: '',
  name: '',
  password: ''
}
export default {
  data () {
    return {
      msg: '',
      ruleForm: Object.assign({}, defaultRuleForm),
      dialogFormVisible: false
    }
  },
  methods: {
    fetchTest () {
      getTest().then(res => {
        this.msg = res.data
        console.log('接口访问状态', res.data)
      })
    },
    submitRuleForm () {
      createUser(this.ruleForm).then(res => {
        if (res.data.bCode === 101) {
          this.$notify({
            title: '成功',
            message: '注册成功,请登录!',
            type: 'success',
            position: 'top-right'
          })
        } else {
          this.$notify({
            title: '警告',
            // eslint-disable-next-line
            message: res.data.bData[key],
            type: 'warning',
            position: 'top-right'
          })
        }
        this.dialogFormVisible = false
        this.ruleForm = Object.assign({}, defaultRuleForm)
      })
    }
  },
  mounted () {
    this.fetchTest()
  }
}
</script>

<style scoped>

</style>
