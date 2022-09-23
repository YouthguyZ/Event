<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 注册的表单区域 -->
      <el-form :model="regForm" status-icon :rules="rules" ref="regForm"  class="demo-regForm">
        <el-form-item  prop="username">
          <el-input type="text" prefix-icon="el-icon-user" v-model="regForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item  prop="password">
          <el-input type="password" prefix-icon="el-icon-lock" v-model="regForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item  prop="repassword">
          <el-input type="password" prefix-icon="el-icon-lock" v-model="regForm.repassword" placeholder="请输入密码"></el-input>
        </el-form-item>
          <el-button type="primary" style="width:100%" @click="hReg">注册</el-button>
          <el-link type="info">去登录</el-link>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Reg',
  data () {
    // 自定义规则校验
    const checkpass = (rule, value, callback) => {
      if (value !== this.regForm.password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      regForm: {
        username: '',
        password: '',
        repassword: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^[a-zA-Z][a-zA-Z0-9]{1,9}$/, message: '请输入不以数字开头的1-10位字符用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          // \S 非空字符
          { pattern: /^\S{6,10}$/, message: '请输入6-10位非空字符密码', trigger: 'blur' }
        ],
        repassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { pattern: /^\S{6,10}$/, message: '请输入正确密码', trigger: 'blur' },
          // 自定义校验 验证密码与确认密码是否一致
          { validator: checkpass, trigger: 'blur' }
        ]

      }
    }
  },
  methods: {
    hReg () {
      // 注册
      // console.log(111)
      // 1.兜底校验
      this.$refs.regForm.validate(async valid => {
        // eslint-disable-next-line no-useless-return
        if (!valid) return
        // 发请求
        const { data: res } = await this.$http.post('/api/reg', {
          // this.regFrom 请求体参数
          username: this.regForm.username,
          password: this.regForm.password,
          repassword: this.regForm.repassword
        })
        console.log(res)
        // 提示用户
        if (res.code === 0) {
          this.$message.success(res.message)
          // 跳转登录
          this.$router.push('/login')
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.reg-container {
  background: url('../../assets/images/login_bg.jpg') center;
  background-size: cover;
  height: 100%;

  .reg-box {
    width: 400px;
    height: 330px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    padding: 0 30px;
    box-sizing: border-box;
    transform: translate(-50%, -50%);

    .title-box {
      height: 60px;
      background: url('../../assets/images/login_title.png') center no-repeat;
    }
  }
}
</style>
