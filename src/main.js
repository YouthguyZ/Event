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

// 注册使用 ui组件
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
