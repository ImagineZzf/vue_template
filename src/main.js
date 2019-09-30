import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@plugins/element.js'
import '@scss/base.scss'

import { axios, axiosLoading } from '@plugins/axios'

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
Vue.config.productionTip = false
// 开发环境开启devtool
Vue.config.devtools = !IS_PROD

Vue.prototype.$axios = axios
Vue.prototype.$axiosLoading = axiosLoading

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
