import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
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
// 访问权限控制 未登录时无法进入 可以去登录/注册页面
// 通过路由前置守卫实现
// to：去哪里
// from；来自哪里
// next（）；放行允许通过
// to.path 去的路径
router.beforeEach((to, from, next) => {
  const token = store.state.user.token
  const whiteList = ['/login', '/reg']
  if (!token && !whiteList.includes(to.path)) {
    next('/login')
  } else {
    // 放行
    next()
  }
})

export default router
