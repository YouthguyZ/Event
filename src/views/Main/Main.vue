<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt="" />
      <!-- 右侧的菜单 -->
      <el-menu
        class="el-menu-top"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img v-if="userInfo.user_pic" :src="userInfo.user_pic" alt="" class="avatar"/>
            <img v-else src="../../assets/logo.png" alt="" class="avatar" />
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1"><i class="el-icon-s-operation" @click="huser"></i>基本资料</el-menu-item>
          <el-menu-item index="1-2"><i class="el-icon-camera"></i>更换头像</el-menu-item>
          <el-menu-item index="1-3"><i class="el-icon-key"></i>重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" @click="hLogout"><i class="el-icon-switch-button" ></i>退出</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <!-- 左侧边栏区域 -->
      <el-aside width="200px">
        <div class="user-box">
          <img v-if="userInfo.user_pic" :src="userInfo.user_pic" alt="" />
          <img v-else src="../../assets/logo.png" alt="" />
          <span>欢迎 {{userInfo.nickname||userInfo.username}}</span>
        </div>
        <!-- 左侧菜单栏 -->
        <!--
          @open="handleOpen"
          @close="handleClose"
          router
          是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
         -->
        <el-menu
          :router="true"
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          >
          <!-- template 虚拟标签
            el-submenu 拥有子菜单 可以嵌套
            通过 是否拥有 children 来判断是否循环
          -->
          <template v-for="item in menus">
          <el-submenu v-if="item.children" :index="item.indexPath" :key="item.indexPath">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.title}}</span>
            </template>
              <el-menu-item v-for="child in item.children" :key="child.indexPath" :index="child.indexPath">
                <i :class="child.icon"></i>
                {{child.title}}
              </el-menu-item>
          </el-submenu>
          <el-menu-item v-else :index="item.indexPath" :key="item.indexPath">
            <i :class="item.icon"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 页面主体区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>© www.YouthguyZ.com - 张畏也</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
// 使用辅助函数 便捷使用拿数据
import { mapState } from 'vuex'
export default {
  name: 'Main',
  data() {
    return {
      menus: []
    }
  },
  methods: {
    hLogout() {
      // 确认退出吗
      this.$confirm('确认要退出吗大哥?', '提示', {
        type: 'warning'
      }).then(() => {
        // 清空 token
        this.$store.commit('user/updateToken', '')
        // 跳转回登录页
        this.$router.push('/login')
      }).catch(() => {
      })
    },
    async getMenus() {
      const { data: res } = await this.$http.get('/my/menus'
      // {
      //   headers: {
      //     Authorization: this.token
      //   }
      // }
      )
      // console.log(res)
      if (res.code === 0) {
        this.menus = res.data
      }
    },
    huser() {
      console.log(111)
    }
  },
  computed: {
    // 辅助函数 mapstate/mapgetters 再 computed 里使用
    ...mapState('user', ['userInfo'])
  },
  created() {
    // 渲染左侧列表拿数据
    this.getMenus()
    // 页面渲染发请求拿数据
    this.$store.dispatch('user/getUserInfo')
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }
  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #F2F2F2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}
// 左侧边栏用户信息区域
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 12px;
  }
}
// 侧边栏菜单的样式
.el-aside {
  .el-submenu,
  .el-menu-item {
    width: 200px;
    user-select: none;
  }
}
</style>
