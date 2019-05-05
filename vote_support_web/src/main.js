import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

import VueClipboard from 'vue-clipboard2'
import Print from 'vue-print-nb'
Vue.use(VueClipboard)
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)
Vue.use(ElementUI, { locale })
Vue.use(Print)

// 注册channel
import channel from './utils/channel'
Vue.prototype.$channel = channel

Vue.config.productionTip = false
// Vue.actionCheck = actionCheck

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
