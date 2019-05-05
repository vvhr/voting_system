// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import qs from 'qs'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
// 注册channel
import channel from './utils/channel'
Vue.prototype.$channel = channel
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false
Vue.prototype.$axios = axios // 全局注册，使用方法为:this.$axios
Vue.prototype.qs = qs // 全局注册，使用方法为:this.qs
/* eslint-disable no-new */

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
