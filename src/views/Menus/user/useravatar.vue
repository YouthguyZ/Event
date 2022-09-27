<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img v-if="avatar" :src="avatar" alt="" class="preview" />
      <img v-else src="../../../assets/images/avatar.jpg" alt="" class="preview" />

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input type="file" accept="image/*" style="display: none;" ref="iptRef" @change="onFileChange"/>
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled="avatar===''" @click="upload">上传头像</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'UserAvatar',
  data() {
    return {
      avatar: ''
    }
  },
  methods: {
    chooseImg() {
      this.$refs.iptRef.click()
    },
    // 文件触发事件 change
    onFileChange(e) {
      // console.log(e)
      const files = e.target.files[0]
      if (files) {
        // console.log(11)
        // 创建对象读取
        const fr = new FileReader()
        // 读取文件 FileReader 文件读取
        fr.readAsDataURL(files)
        fr.onload = (e) => {
          // console.log(e)
          // 设置预览图片
          this.avatar = e.target.result
          // console.log(this.avatar)
        }
        // 拿到结果
      } else {
        // 否则为空
        this.avatar = ''
      }
    },
    async upload() {
      // 发请求
      const { data: res } = await this.$http.patch('/my/update/avatar', { avatar: this.avatar })
      // console.log(res)
      if (res.code !== 0) this.$message.error(res.message)
      this.$message.success(res.message)
      this.avatar = ''
      // 更新用户信息
      this.$store.dispatch('user/getUserInfo')
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
  width: 350px;
  height: 350px;
}
</style>
