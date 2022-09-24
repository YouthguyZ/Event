import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入组件
import Reg from '@/views/Reg/Reg.vue'
import Login from '@/views/Login/Login.vue'
import main from '@//views/Main/Main.vue'

Vue.use(VueRouter)

const routes = [
  // 路由规则
  { path: '/reg', component: Reg },
  { path: '/login', component: Login },
  { path: '/', component: main }
]

const router = new VueRouter({
  routes
})

export default router
