// 导入 axios 发请求再 actions 里
import axios from 'axios'
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
    },
    // 获取用户信息
    updateUserInfo(state, info) {
      state.userInfo = info
    }
  },
  actions: {
    // 发请求拿用户信息
    async getUserInfo(context) {
      // 不能直接使用 this 拿$http 引入 axios
      // this.$http.get('/my/userinfo')
      // 需要配置 请求头 Authorization：
      // console.log(context)
      // context 模块里的数据 执行上下文
      // state/commit/dispatch/
      const { data: res } = await axios.get('/my/userinfo', {
        headers: {
          Authorization: context.state.token
        }
      })
      console.log(res)
      // 将结果数据 commit 存入 mutations 中
      // 进行判断
      if (res.code !== 0) return
      context.commit('updateUserInfo', res.data)
    }
  },
  getters: {}
}
