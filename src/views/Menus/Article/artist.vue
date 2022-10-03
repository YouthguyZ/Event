<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <el-option v-for="item in cateList" :key="item.id" :label="item.cate_name" :value="item.id"></el-option>
              <!-- <el-option label="区域二" value="beijing"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px;">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="initArticleList">筛选</el-button>
            <el-button type="info" size="small" @click="resetFrom">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click="pubDialog=true">发表文章</el-button>
      </div>

      <!-- 文章表格区域 -->
        <el-table
          :data="articleList"
          border
          stripe
          style="width: 100%">
          <el-table-column
            prop="title"
            label="文章标题"
            width="180">
          </el-table-column>
          <el-table-column
            prop="cate_name"
            label="文章分类"
            width="180">
          </el-table-column>
          <el-table-column

            label="发表时间">
            <template v-slot="{row}">
              {{formatDate(row.pub_date)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="state"
            label="状态">
          </el-table-column>
          <el-table-column
            label="操作">
            <el-button size="mini" type="danger">删除</el-button>
          </el-table-column>
        </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="q.pagenum"
        :page-sizes="[3,5, 10, 15, 20]"
        :page-size="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 发表文章的 Dialog 对话框 -->
    <el-dialog title="发表文章"
    :visible.sync="pubDialog"
    :before-close="handleClose"
    fullscreen
    >
      <!-- <span>这是一段信息</span> -->
      <!-- 发布文章的对话框 -->
      <el-form :model="pubForm" :rules="pubFormRules" ref="pubForm" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%;">
            <el-option v-for="item in cateList" :key="item.id" :label="item.cate_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <!-- 使用 v-model 进行双向的数据绑定 -->
          <quill-editor v-model="pubForm.content" @blur="$refs.pubForm.validateField('content')"></quill-editor>
        </el-form-item>
        <el-form-item label="文章封面" prop="cover_img">
          <!-- 用来显示封面的图片 -->
          <img v-if="preview" :src="preview" alt="" class="cover-img" ref="imgRef" />
          <img v-else src="../../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
          <br />
          <!-- 文件选择框，默认被隐藏 -->
          <input type="file" style="display: none;" accept="image/*" ref="iptFileRef" @change="hImg"/>
          <!-- 选择封面的按钮 -->
          <el-button type="text" @click="$refs.iptFileRef.click()">+ 选择封面</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="hPub('已发布')">发布</el-button>
          <el-button type="info" @click="hPub('草稿')">保存草稿</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'ArtList',
  data() {
    return {
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      pubDialog: false,
      // 表单的数据对象
      pubForm: {
        title: '',
        cate_id: '',
        content: '',
        cover_img: '',
        state: ''
      },
      // 表单的验证规则对象
      pubFormRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        cate_id: [{ required: true, message: '请选择文章标题', trigger: 'change' }],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        cover_img: [
          { required: true, message: '请添加文章封面', trigger: 'blur' }
        ]
      },
      cateList: [],
      articleList: [],
      // 预览头像
      preview: '',
      total: 0
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭吗，关闭会丢失数据？', '提示', { type: 'warning' })
        .then(_ => {
          done()
          this.preview = ''
        })
        .catch(_ => {})
    },
    async getCateList() {
      const { data: res } = await this.$http.get('/my/cate/list')
      if (res.code === 0) {
        this.cateList = res.data
      }
    },
    async initArticleList() {
      const { data: res } = await this.$http.get('/my/article/list', { params: this.q })
      // console.log(res)
      if (res.code === 0) {
        this.articleList = res.data
        this.total = res.total
      }
    },
    hImg(e) {
      // console.log(e)
      const file = e.target.files[0]
      if (file) {
        this.pubForm.cover_img = file
        // 使用 url 地址预览
        // const str = URL.createObjectURL(file)
        // console.log(str)
        this.preview = URL.createObjectURL(file)
        // 校验封面
        this.$refs.pubForm.validateField('cover_img')
      } else {
        this.pubForm.cover_img = ''
        this.preview = ''
      }
    },
    hPub(state) {
      this.pubForm.state = state
      // 兜底校验
      this.$refs.pubForm.validate(async valid => {
        if (!valid) return
        // formdata 格式文件
        const fd = new FormData()
        for (const k in this.pubForm) {
          fd.append(k, this.pubForm[k])
        }
        const { data: res } = await this.$http.post('/my/article/add', fd)
        console.log(res)
        if (res.code === 0) {
          this.$message.success(res.message)
          this.pubDialog = false
          // 清空表单数据
          this.$refs.pubForm.resetFields()
          this.preview = ''
          this.initArticleList()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.q.pagesize = val
      // 默认展示第一页数据
      this.pagenum = 1
      // 重新刷新
      this.initArticleList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      // 为页码值赋值
      this.q.pagenum = val
      // 重新发起请求
      this.initArticleList()
    },
    // 重置功能
    resetFrom() {
      this.q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      }
      this.initArticleList()
    }
  },
  created() {
    this.getCateList()
    this.initArticleList()
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
// less 深度选择器 /deep/
/deep/.ql-editor{
  height: 300px;
}
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
.el-pagination {
  margin-top: 15px;
}
</style>
