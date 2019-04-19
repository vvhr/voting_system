<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" ref="loginForm" label-position="left">
      <div class="system-title">在线投票系统</div>
      <hr />
      <div v-if="login_hidden">
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="off" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="off"
          placeholder="请输入密码"></el-input>
      </el-form-item>
      </div>
      <el-form-item>

        <el-button type="success" style="width:58%;" :loading="loading" @click.native.prevent="handleLogin">
          登 录 系 统
        </el-button>
        <a target="_blank" href="http://localhost:8080/">
          <el-button type="primary" style="width:38%;float: right">
            注 册
          </el-button>
        </a>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      login_hidden: false,
      loginForm: {
        username: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    // 视图
    handleLogin() {
      if (this.login_hidden === false) {
        this.login_hidden = true
      } else {
        this.loading = true
        this.$store.dispatch('Login', this.loginForm).then(() => {
          this.loading = false
          this.$router.push({ path: '/' })
        }).catch(() => {
          this.$message.error('登录失败，账号或密码错误')
          this.loading = false
        })
      }
    }
  },
  mounted() {
    // eslint-disable-next-line
    console.log('获取用户IP信息 => ', returnCitySN['cip'] + ',' + returnCitySN['cname'])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #eeeeea;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #ffffff;
      height: 43px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #000 !important;
      }
    }
  }
}
.login-form .el-form-item__content {
  line-height: 0!important;
  position: relative;
  font-size: 14px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container .el-form-item {
  border: 0 solid rgba(255, 255, 255, 0.1)!important;
  background: rgba(141, 226, 226, 0.28);
  border-radius: 5px;
  color: #454545;
  margin-bottom: 8px!important;
  z-index: 101
}

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: url("http://localhost/voting_system/vote_support_web/static/background/01.jpg") no-repeat;
  background-size:100% 100%;
  -moz-background-size:100% 100%;
  .login-form {
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 5px;
    background-color: rgba(48, 49, 51, 0.81);
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 35px 35px 15px 35px;
    margin: 300px auto;
    z-index: 100
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #ffffff;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    color: $light_gray;
    margin: 0 auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .system-title {
    color: #fffff7;
    font-family: "Microsoft YaHei",monospace;
    font-size: 22px;
    text-align: center;
    margin-bottom: 10px;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 15px;
    font-size: 16px;
    color: #ffffff;
    cursor: pointer;
    user-select: none;
  }
  .slideshow {
    position: absolute;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  .slideshow-image {
    position: absolute;
    width: 100%;
    height: 100%;
    background: no-repeat 50% 50%;
    background-size: cover;
    -webkit-animation-name: kenburns;
    animation-name: kenburns;
    -webkit-animation-timing-function: linear;
    animation-timing-function: linear;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    -webkit-animation-duration: 120s;
    animation-duration: 120s;
    opacity: 1;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  .slideshow-image:nth-child(1) {
    -webkit-animation-name: kenburns-1;
    animation-name: kenburns-1;
    z-index: 3;
  }
  .slideshow-image:nth-child(2) {
    -webkit-animation-name: kenburns-2;
    animation-name: kenburns-2;
    z-index: 2;
  }
  .slideshow-image:nth-child(3) {
    -webkit-animation-name: kenburns-3;
    animation-name: kenburns-3;
    z-index: 1;
  }
  .slideshow-image:nth-child(4) {
    -webkit-animation-name: kenburns-4;
    animation-name: kenburns-4;
    z-index: 0;
  }

  @-webkit-keyframes kenburns-1 {
    0% {
      opacity: 1;
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
    }
    1.5625% {
      opacity: 1;
    }
    23.4375% {
      opacity: 1;
    }
    26.5625% {
      opacity: 0;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    100% {
      opacity: 0;
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
    }
    98.4375% {
      opacity: 0;
      -webkit-transform: scale(1.21176);
      transform: scale(1.21176);
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes kenburns-1 {
    0% {
      opacity: 1;
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
    }
    1.5625% {
      opacity: 1;
    }
    23.4375% {
      opacity: 1;
    }
    26.5625% {
      opacity: 0;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    100% {
      opacity: 0;
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
    }
    98.4375% {
      opacity: 0;
      -webkit-transform: scale(1.21176);
      transform: scale(1.21176);
    }
    100% {
      opacity: 1;
    }
  }
  @-webkit-keyframes kenburns-2 {
    23.4375% {
      opacity: 1;
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
    }
    26.5625% {
      opacity: 1;
    }
    48.4375% {
      opacity: 1;
    }
    51.5625% {
      opacity: 0;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    100% {
      opacity: 0;
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
    }
  }
  @keyframes kenburns-2 {
    23.4375% {
      opacity: 1;
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
    }
    26.5625% {
      opacity: 1;
    }
    48.4375% {
      opacity: 1;
    }
    51.5625% {
      opacity: 0;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    100% {
      opacity: 0;
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
    }
  }
  @-webkit-keyframes kenburns-3 {
    48.4375% {
      opacity: 1;
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
    }
    51.5625% {
      opacity: 1;
    }
    73.4375% {
      opacity: 1;
    }
    76.5625% {
      opacity: 0;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    100% {
      opacity: 0;
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
    }
  }
  @keyframes kenburns-3 {
    48.4375% {
      opacity: 1;
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
    }
    51.5625% {
      opacity: 1;
    }
    73.4375% {
      opacity: 1;
    }
    76.5625% {
      opacity: 0;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    100% {
      opacity: 0;
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
    }
  }
  @-webkit-keyframes kenburns-4 {
    73.4375% {
      opacity: 1;
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
    }
    76.5625% {
      opacity: 1;
    }
    98.4375% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
  @keyframes kenburns-4 {
    73.4375% {
      opacity: 1;
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
    }
    76.5625% {
      opacity: 1;
    }
    98.4375% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
}
</style>
