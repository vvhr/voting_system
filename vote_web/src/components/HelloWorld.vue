<template>
  <div>
    <!--登录区-->
    <div class="login">
      欢迎访问在线投票系统，您可以登陆后再投票，也可以直接匿名投票！<br>
      <a target="_blank" href="http://localhost:9528/"><el-button type="primary" size="mini">已有账号,直接登录</el-button></a>
      <el-button type="success" size="mini" @click="dialogFormVisible = true">注册账号</el-button>
    </div>
    <!--投票区-->
    <div style="width: 100%;margin: 0 auto">
      <div class="body" v-if="data !== null">
        <el-button @click="onClickFresh" size="mini" style="width: 200px;margin: 10px" type="primary">刷新数据</el-button>
        <div class="theme">
          <el-form :model="data" size="mini" style="text-align: left">
            <el-row>
              <el-col :span="12">
                <el-form-item label="主题">
                  <el-tag :type="optionsTagType(data.state)" size="mini">{{data.state | stateFilter}}</el-tag>
                  {{data.theme_name}}
                </el-form-item>
              </el-col>
              <el-col :span="5"><el-form-item label="编号">{{data.id}}</el-form-item></el-col>
            </el-row>
            <el-form-item label="主题介绍">{{data.theme_content}}</el-form-item>
            <el-row>
              <el-col :span="5"><el-form-item label="发起人">{{data.user.name}}</el-form-item></el-col>
              <el-col :span="6"> <el-form-item label="发起时间">{{data.create_time}}</el-form-item></el-col>
              <el-col :span="6"> <el-form-item label="截止时间">{{data.end_time}}</el-form-item></el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="投票类型">{{data.options_type | optionsTypeFilter}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="可选">{{data.choose_max}} 个选项</el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="投票进度">{{data.voted_total}} / {{data.votes_max}} 票
              <el-progress style="width: 400px;" :text-inside="true" :stroke-width="20" :percentage="data.voted_total/data.votes_max*100"></el-progress>
            </el-form-item>
            <el-form-item label="请选择投票项">
              <el-checkbox-group size="large" style="display: inline-grid;" v-model="new_options" :min="0" :max="data.choose_max">
                <el-checkbox v-for="option in options" :label="option.key" :key="option.key">
                  <el-row class="row-style" style="position: relative;top: -14px;">
                    <div >{{option.name}}</div>
                    <div style="margin-left: 15px">获得 {{option.number}} 票 </div>
                    <div style="margin-left: 15px">
                      <el-progress style="width: 100px;" :text-inside="true" :stroke-width="20" :percentage="getPercent(option.number, data.voted_total)">
                      </el-progress>
                    </div>
                  </el-row>
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="操作">
              <el-button type="danger" style="width: 150px" @click="onClickVoting" :loading="onLoading">确认投票</el-button>
            </el-form-item>
            <el-form-item label="用户信息">
              <el-tag type="danger">
                IP：{{user_ip}}
              </el-tag>
            </el-form-item>
            <el-form-item label="免登录投票链接">
              <a :herf="'http://localhost:8080?theme_id='+theme_id">http://localhost:8080?theme_id={{this.theme_id}}</a>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-else>
        <i class="el-icon-loading"></i>正在加载.....
      </div>
    </div>
    <!--注册账号对话框-->
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
import { getTheme, voting } from '../api/theme'

const defaultRuleForm = {
  username: '',
  name: '',
  password: ''
}
const defaultUpdateForm = {
  theme_id: null,
  user_ip: null,
  create_time: null
}
export default {
  data () {
    return {
      msg: '',
      ruleForm: Object.assign({}, defaultRuleForm),
      dialogFormVisible: false,
      // 当前主题id
      theme_id: 0,
      // 当前主题数据
      data: null,
      // 当前主题的选项内容数据
      options: null,
      // 用户选择的选项数据
      new_options: [],
      // 用户IP
      user_ip: null,
      // 提交表单对象
      updateForm: Object.assign({}, defaultUpdateForm),
      // 加载动画变量
      onLoading: false
    }
  },
  filters: {
    // 选项类型过滤器
    optionsTypeFilter (value) {
      if (value === 0) return '单选'
      else if (value === 1) return '可多选'
      else return '错误'
    },
    // 主题状态过滤器
    stateFilter (value) {
      if (value === 0) return '待开启'
      else if (value === 1) return '投票中'
      else if (value === 2) return '已完成'
      else if (value === 3) return '已取消'
      else return '错误'
    }
  },
  watch: {
    // 监听路由对象是否变化，如果变化则重新获取
    '$route': 'fetchOne'
  },
  methods: {
    // 测试接口状态
    fetchTest () {
      getTest().then(res => {
        this.msg = res.data
        console.log('接口访问状态', res.data)
      })
    },
    // 提交注册表单
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
    },
    /** 接口类 获取单个主题的信息 */
    fetchOne () {
      // 从url地址中提取主题id
      this.theme_id = this.$channel.getUrlKey('theme_id')
      getTheme({ id: this.theme_id }).then(res => {
        this.data = res.data
        this.options = JSON.parse(res.data.options_content)
        // eslint-disable-next-line
        this.user_ip = returnCitySN['cip']
        console.log(this.options)
      })
    },
    /** 刷新 按钮被点击事件 */
    onClickFresh () {
      console.log(this.new_options)
      this.fetchOne()
    },
    /** 确认 按钮被点击事件 */
    onClickVoting () {
      if (this.new_options.length > 0) {
        if (this.data.state === 1) {
          // 将数据库的datatime转timestamp时间戳
          let str = this.data.end_time.toString()
          str = str.replace('/-/g', '/')
          const endTime = new Date(str).getTime()
          // 比较截止时间是否大于当前时间
          if (endTime > new Date()) {
            // 启动加载动画
            this.onLoading = true
            // 解析投票数据
            this.updateForm.voted_total = this.data.voted_total
            for (let i = 0; i < this.options.length; i++) {
              const result = this.new_options.indexOf(this.options[i].key)
              if (result !== -1) {
                this.options[i].number++
                this.updateForm.voted_total++
              }
            }
            // 新的投票数据
            console.log(this.options)
            // eslint-disable-next-line
            this.user_ip = returnCitySN['cip']
            // 将this.options数组对象转JSON
            this.updateForm.options_JSON = JSON.stringify(this.options)
            this.updateForm.user_ip = this.user_ip
            this.updateForm.create_time = this.timestampToTime(new Date())
            this.updateForm.theme_id = this.data.id
            // 提交
            // console.log(this.updateForm)
            voting(this.updateForm).then(res => {
              if (res.data.bCode === 101) {
                this.$notify({ title: '成功', message: '投票成功!', type: 'success', position: 'top-right' })
              } else {
                this.$notify({ title: '警告', message: res.data.bData, type: 'warning', position: 'top-right' })
              }
              // 完成加载动画
              this.onLoading = false
              // 重新刷新数据
              this.fetchOne()
              // 重置表单
              this.updateForm = Object.assign({}, defaultUpdateForm)
            })
          } else {
            this.$message.error('投票失败，该主题已超时，无法继续投票！')
          }
        } else {
          this.$message.error('投票失败，该主题无法投票！')
        }
      } else {
        this.$message.error('投票失败，您没有选择任何选项！')
      }
    },
    /** 样式过滤器 - 投票状态 - tag样式 */
    optionsTagType (value) {
      if (value === 0) return 'primary'
      else if (value === 1) return 'success'
      else if (value === 2) return 'danger'
      else if (value === 3) return 'info'
      else return 'warning'
    },
    /** 进度条计算 */
    getPercent (a, b) {
      return Math.floor(Number(a) / Number(b) * 100)
    },
    /** 时间戳转时间 */
    timestampToTime (timestamp) {
      const date = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      const Y = date.getFullYear() + '-'
      const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      const D = (date.getDate() + 1 < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
      const h = (date.getHours() + 1 < 10 ? '0' + (date.getHours()) : date.getHours()) + ':'
      const m = (date.getMinutes() + 1 < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':'
      const s = (date.getSeconds() + 1 < 10 ? '0' + (date.getSeconds()) : date.getSeconds())
      return Y + M + D + h + m + s
    }
  },
  mounted () {
    this.fetchTest()
    this.theme_id = this.$channel.getUrlKey('theme_id')
    this.fetchOne()
    // eslint-disable-next-line
    this.user_ip = returnCitySN['cip']
  }
}
</script>

<style scoped>
    .login {
      width: 100%;
      background-color: antiquewhite;
      margin-top: 0;
    }
</style>
<style>
  .row-style {
    display: inline-flex;
    justify-content: flex-start;
  }
  .el-checkbox.is-bordered+.el-checkbox.is-bordered {
    margin-left: 0;
    margin-top: 10px;
  }
  .el-checkbox+.el-checkbox {
    margin-left: 0;
  }
</style>
<style scoped>
  .body {
    margin: 0 auto;
  }
  .theme {
    padding: 20px;
    border:1px solid #3A3A3A;
    max-width: 1000px;
    margin: 0 auto;
  }
</style>
