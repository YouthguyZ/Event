import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
// 引入组件
import Reg from '@/views/Reg/Reg.vue'
import Login from '@/views/Login/Login.vue'
import main from '@//views/Main/Main.vue'
import Home from '@/views/Menus/Home/Home'
import userInfo from '@/views/Menus/user/userInfo'
import useravatar from '@/views/Menus/user/useravatar'
import userpwd from '@/views/Menus/user/userpwd'
import artcate from '@/views/Menus/Article/artcate'
import artist from '@/views/Menus/Article/artist'

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, resolve, reject) {
  if (resolve || reject) return originalPush.call(this, location, resolve, reject)
  return originalPush.call(this, location).catch((e) => {})
}

const routes = [
  // 路由规则
  { path: '/reg', component: Reg },
  { path: '/login', component: Login },
  {
    path: '/',
    component: main,
    // 3. 开启路由重定向
    redirect: '/home',
    children: [
      { path: 'home', component: Home },
      { path: 'user-info', component: userInfo },
      { path: 'user-avatar', component: useravatar },
      { path: 'user-pwd', component: userpwd },
      { path: 'art-cate', component: artcate },
      { path: 'art-list', component: artist }
    ]

  }
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
    Vue.prototype.$message.error('宁还未登录啊啊啊！')
    next('/login')
  } else {
    // 放行
    next()
  }
})

export default router
