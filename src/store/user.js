export default {
  // 开启命名空间
  namespaced: true,
  state: {
    token: '',
    userInfo: {}
  },
  mutations: {
    // 提交修改 state 的唯一地方
    // state 参数一
    // payload 载荷 参数二
    updateToken(state, token) {
      state.token = token
    }

  },
  actions: {
    updateUserInfo(state, info) {

    }
  },
  getters: {}
}
