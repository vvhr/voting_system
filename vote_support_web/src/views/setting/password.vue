<template>
  <div class="app-container">
    <el-form label-width="100px" class="demo-ruleForm">

      <el-form-item label="原密码">
        <el-input type="password" v-model="ruleForm.oldPassword" placeHolder="请输入原密码"></el-input>
      </el-form-item>

      <el-form-item label="新密码">
        <el-input type="password" v-model="ruleForm.password" placeHolder="请输入新密码"></el-input>
      </el-form-item>

      <el-form-item label="确认新密码">
        <el-input type="password" v-model="ruleForm.password2" placeHolder="请输入确认密码"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="onChangePassword">确认修改</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { updatePassword } from '../../api/user'
export default {
  data() {
    return {
      ruleForm: {
        oldPassword: '',
        password: '',
        password2: ''
      }
    }
  },
  methods: {
    onChangePassword() {
      if (this.ruleForm.oldPassword.trim().length < 6 || this.ruleForm.password.trim().length < 6 || this.ruleForm.password2.trim().length < 6) {
        this.$message({
          type: 'error',
          message: '密码最少要六位'
        })
        return
      }

      if (this.ruleForm.password.trim() !== this.ruleForm.password2.trim()) {
        this.$message({
          type: 'error',
          message: '确认密码不一致'
        })
      }
      updatePassword(this.ruleForm).then(res => {
        if (res.data.bCode === 101) {
          this.$message({
            type: 'success',
            message: res.data.bData.msg
          })
        }
        if (res.data.bCode === 102) {
          this.$message({
            type: 'error',
            message: res.data.bData.msg
          })
        }
      })
    }
  }
}
</script>
