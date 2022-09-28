<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>重置密码</span>
    </div>
    <!-- 表单 -->
    <el-form :model="pwdForm" :rules="pwdFormRules" ref="pwdFormRef" label-width="100px">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd">
        <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updatePwd">修改密码</el-button>
        <el-button @click="$refs.pwdFormRef.resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'UserPwd',
  data() {
    // 自定义校验新密码不能与旧密码相同
    const samePwd = (rule, value, callback) => {
      if (value === this.pwdForm.old_pwd) {
        callback(new Error('新旧密码不得一致'))
      } else {
        callback()
      }
    }
    // 自定义校验两次密码不一致
    const rePwd = (rule, value, callback) => {
      if (value !== this.pwdForm.new_pwd) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      // 表单的数据对象
      pwdForm: {
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
      },
      // 表单的验证规则对象
      pwdFormRules: {
        old_pwd: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { pattern: /^\S{6,10}$/, message: '请输入6-15的非空字符', trigger: 'blur' }
        ],
        new_pwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /^\S{6,10}$/, message: '请输入6-15的非空字符', trigger: 'blur' },
          { validator: samePwd, trigger: 'blur' }
        ],
        re_pwd: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { pattern: /^\S{6,10}$/, message: '请输入6-15的非空字符', trigger: 'blur' },
          { validator: rePwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 修改密码
    updatePwd() {
      // 兜底校验
      this.$refs.pwdFormRef.validate(async valid => {
        if (!valid) return
        // console.log(111)
        // 发请求
        // 携带参数 old_pwd: '',
        // new_pwd: '',
        // re_pwd: ''
        const { data: res } = await this.$http.patch('/my/updatepwd', this.pwdForm)
        if (res.code !== 0) this.$message.error(res.message)
        this.$message.success(res.message)
        // 清空字段
        this.$refs.pwdFormRef.resetFields()
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
