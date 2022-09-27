<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本资料</span>
    </div>
    <!-- 表单 -->
    <!-- 表单 -->
    <el-form :model="userForm" :rules="userFormRules" ref="userFormRef" label-width="100px">
      <el-form-item label="登录名称" prop="username">
        <el-input v-model="userForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="userForm.nickname" minlength="1" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交修改</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'UserInfo',
  data() {
    return {
      // 浅拷贝 转深拷贝
      // userForm: this.$store.state.user.userInfo ,
      // userForm: Object.assign({}, this.$store.state.userInfo),
      // userForm: JSON.parse(JSON.stringfly(this.$store.state.userInfo)),
      userForm: { ...this.$store.state.user.userInfo },
      // 表单的验证规则对象
      userFormRules: {
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '昵称必须是1-10位的非空字符串', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset() {
      // resetFields对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.userFormRef.resetFields()
    },
    submit() {
      // 兜底校验
      this.$refs.userFormRef.validate(async valid => {
        // 如果未通过校验则中断执行
        if (!valid) return
        // 发请求
        const { data: res } = await this.$http.put('/my/userinfo', this.userForm)
        console.log(res)
        if (res.code !== 0) this.$message.error(res.message)
        this.$message.success(res.message)
        // 渲染数据
        this.$store.dispatch('user/getUserInfo')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
