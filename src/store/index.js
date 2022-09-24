import Vue from 'vue'
import Vuex from 'vuex'
// 导入模块 user
import user from '@/store/user'
// 导入持久化存储
import createPersistedState from 'vuex-persistedstate'

// 注册使用 vuex
Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    createPersistedState()
  ],
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user
  }
})
