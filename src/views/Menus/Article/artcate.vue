<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addDialog=true">添加分类</el-button>
      </div>
      <!-- 表格区域 -->
      <el-table style="width: 100%;" :data="cateList" border stripe>
        <el-table-column label="序号" type="index" width="100"></el-table-column>
        <el-table-column label="分类名称" prop="cate_name"></el-table-column>
        <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row}">
          <el-button type="primary" size="mini" @click="hEdit(row.id)">修改</el-button>
          <el-button type="danger" size="mini" @click="hDel(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="添加文章分类列表"
      :visible.sync="addDialog"
      :close-on-click-modal="false"
      @closed="$refs.addRef.resetFields()"
      width="30%"
     >
      <!-- 添加的表单 -->
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="70px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="hSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改文章分类的对话框 -->
    <el-dialog title="修改文章分类" :visible.sync="editVisible" :close-on-click-modal="false"
      @closed="$refs.editFormRef.resetFields()" width="30%">
      <!-- 修改的表单 -->
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="editForm.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="editForm.cate_alias"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="editVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="editSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ArtCate',
  data() {
    return {
      cateList: [],
      addDialog: false,
      addForm: {
        cate_name: '',
        cate_alias: ''
      },
      // 添加表单的验证规则对象
      addRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      },
      editVisible: false,
      editForm: {
        cate_name: '',
        cate_alias: ''
      },
      editRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('/my/cate/list')
      // console.log(res)
      if (res.code === 0) {
        this.cateList = res.data
      }
    },
    hSubmit() {
      // 兜底校验
      this.$refs.addRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/my/cate/add', this.addForm)
        // console.log(res)
        if (res.code !== 0) this.$message.error(res.message)
        this.$message.success(res.message)
        // 关闭弹窗
        this.addDialog = false
        // 重新更新列表
        this.getCateList()
      })
    },
    async hEdit(id) {
      const { data: res } = await this.$http.get('/my/cate/info', { params: { id } })
      // console.log(res)
      if (res.code === 0) {
        this.editForm = res.data
        this.editVisible = true
      }
    },
    editSubmit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('/my/cate/info', this.editForm)
        // console.log(res)
        if (res.code !== 0) this.$message.error(res.message)
        this.$message.success(res.message)
        this.editVisible = false
        this.getCateList()
      })
    },
    async hDel(id) {
      const { data: res } = await this.$http.delete('/my/cate/del', { params: { id } })
      console.log(res)
      if (res.coed !== 0) this.$message.error(res.message)
      this.$message.success(res.message)
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
