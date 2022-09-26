import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入 ui组件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入 axios 库
import axios from 'axios'
import '@/assets/global.less'

// 设置请求基地址
axios.defaults.baseURL = 'http://www.liulongbin.top:3008'

// 挂载到 vue 原型上去
Vue.prototype.$http = axios

// 设置请求拦截器 同意携带 token
// 添加请求拦截器
axios.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  // console.log(config)
  // 不能使用 this.$store
  // console.log(store)
  // 判断是否有 token
  const token = store.state.user.token
  if (token) {
    config.headers.Authorization = token
  }
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 注册使用 ui组件
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
