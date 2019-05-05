<template>
  <div class="app-container">
    <!--头部搜索及操作框-->
    <div class="row-01">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item>
          <el-button type="success" @click="visible.createForm = true">创建投票主题</el-button>
        </el-form-item>
        <el-form-item label="搜索主题">
          <el-input style="width: 300px" v-model="searchForm.theme_name" placeholder="请输入投票主题的名称关键词..."></el-input>
        </el-form-item>
        <el-form-item label="主题状态">
          <el-select v-model="searchForm.state" placeholder="请选择主题状态...">
            <el-option label="待开启" value="0"></el-option>
            <el-option label="进行中" value="1"></el-option>
            <el-option label="已完成" value="2"></el-option>
            <el-option label="已取消" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitSearch">查询</el-button>
          <el-button type="primary" @click="onResetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="row-02">
      <!--分页器-->
      <div style="padding:0 10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :current-page="searchForm.currentPage"
          :page-sizes="[10,30,50,100]"
          :page-size="searchForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="searchForm.totalCount">
        </el-pagination>
      </div>
    </div>
    <div class="row-03">
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="id" label="id" width="60"></el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="optionsTagType(scope.row.state)">{{ scope.row.state | stateFilter}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100">
          <template slot-scope="scope">
            <el-tag :type="optionsTagType2(scope.row.options_type)">{{ scope.row.options_type | optionsTypeFilter}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="主题名称" width="400" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="onClickShowThemeDetail(scope.row.id)">{{scope.row.theme_name}}</el-button><br/>
            <span>{{scope.row.theme_content}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user.name" label="创建人" width="120"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="200"></el-table-column>
        <el-table-column prop="end_time" label="截止时间" width="200"></el-table-column>
        <el-table-column label="投票数" width="120">
          <template slot-scope="scope">
            {{scope.row.voted_total}} / {{scope.row.votes_max}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" :disabled="scope.row.state !== 0" @click="onClickUpdate(scope.row)">修改</el-button>
            <el-button type="success" size="mini" :disabled="scope.row.state !== 0" @click="onClickOpen(scope.row)">开启</el-button>
            <el-button type="danger" size="mini"  :disabled="scope.row.state === 3" @click="onClickCancel(scope.row)">取消</el-button>
            <el-button type="warning" size="mini" :disabled="scope.row.state !== 2" @click="onClickDone(scope.row)">完成</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--对话框表单-->
    <el-dialog title="创建新的投票主题" :visible.sync="visible.createForm" width="50%">
      <el-form :model="createForm" size="mini">
        <el-form-item label="主题名称">
          <el-input v-model="createForm.theme_name" placeholder="请输入主题名称！" style="width: 350px"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item label="起始时间">
              <el-date-picker
                value-format="yyyy-MM-dd HH-mm-ss"
                v-model="createForm.create_time" type="datetime" placeholder="选择时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间">
            <el-date-picker
              value-format="yyyy-MM-dd HH-mm-ss"
              v-model="createForm.end_time" type="datetime" placeholder="选择时间"></el-date-picker>
          </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="主题介绍">
          <el-input type="textarea" :rows="3" v-model="createForm.theme_content"
                    placeholder="请介绍您的投票介绍，例如创建原因、投票目的等！" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="主题状态" label-width="70px">
          <el-radio v-model="createForm.state" :label="0">创建后不启动</el-radio>
          <el-radio v-model="createForm.state" :label="1">创建后立即启动</el-radio>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="投票类型" label-width="70px">
              <el-radio v-model="createForm.options_type" :label="0">单选</el-radio>
              <el-radio v-model="createForm.options_type" :label="1">可多选</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大多选" label-width="70px" v-if="createForm.options_type === 1">
             <el-input v-model="createForm.choose_max" style="width: 50px"></el-input> 项
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="最大投票总数" label-width="100px">
          <el-input v-model="createForm.votes_max" style="width: 100px" type="number"></el-input>
          （当达到最大投票总数时投票自动完成！）
        </el-form-item>
        <el-form-item label="选项总数" label-width="70px">
          <el-input v-model="createForm.options_count" :disabled="true" style="width: 100px"></el-input>
          <el-button @click="onClickAddOption" type="primary">新增选项</el-button>
        </el-form-item>
        <el-form-item
          v-for="(option, index) in createForm.options_content"
          :label="'选项' + (index + 1)"
          :key="option.key"
          :prop="'options_content.' + index + '.name'"
          :rules="{ required: true, message: '选项名不能为空', trigger: 'blur' }">
          <el-input v-model="option.name" style="width: 300px"></el-input>
          <el-button @click.prevent="onClickRemoveOption(option)" type="danger" > - </el-button>
        </el-form-item>
        <el-form-item label="操作" label-width="70px">
          <el-button type="success" @click="onClickSubmitCreate">确认创建</el-button>
          <el-button type="primary" @click="onClickResetCreateForm">重置表单</el-button>
          <el-button type="danger" @click="visible.createForm = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="修改主题" :visible.sync="visible.updateForm" width="50%">
      <el-form :model="updateForm" size="mini">
        <el-form-item label="主题名称">
          <el-input v-model="updateForm.theme_name" placeholder="请输入主题名称！" style="width: 350px"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item label="起始时间">
              <el-date-picker
                value-format="yyyy-MM-dd HH-mm-ss"
                v-model="updateForm.create_time" type="datetime" placeholder="选择时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间">
              <el-date-picker
                value-format="yyyy-MM-dd HH-mm-ss"
                v-model="updateForm.end_time" type="datetime" placeholder="选择时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="主题介绍">
          <el-input type="textarea" :rows="3" v-model="updateForm.theme_content"
                    placeholder="请介绍您的投票介绍，例如创建原因、投票目的等！" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="主题状态" label-width="70px">
          <el-radio v-model="updateForm.state" :label="0">不启动</el-radio>
          <el-radio v-model="updateForm.state" :label="1">立即启动</el-radio>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="投票类型" label-width="70px">
              <el-radio v-model="updateForm.options_type" :label="0">单选</el-radio>
              <el-radio v-model="updateForm.options_type" :label="1">可多选</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大多选" label-width="70px" v-if="updateForm.options_type === 1">
              <el-input v-model="updateForm.choose_max" style="width: 50px"></el-input> 项
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="最大投票总数" label-width="100px">
          <el-input v-model="updateForm.votes_max" style="width: 100px" type="number"></el-input>
          （当达到最大投票总数时投票自动完成！）
        </el-form-item>
        <el-form-item label="选项总数" label-width="70px">
          <el-input v-model="updateForm.options_count" :disabled="true" style="width: 100px"></el-input>
          <el-button @click="onClickAddOption_" type="primary">新增选项</el-button>
        </el-form-item>
        <el-form-item
          v-for="(option, index) in updateForm.options_content"
          :label="'选项' + index"
          :key="option.key"
          :prop="'options_content.' + index + '.name'"
          :rules="{ required: true, message: '选项名不能为空', trigger: 'blur' }">
          <el-input v-model="option.name" style="width: 300px"></el-input>
          <el-button @click.prevent="onClickRemoveOption_(option)" type="danger" > - </el-button>
        </el-form-item>
        <el-form-item label="操作" label-width="70px">
          <el-button type="success" @click="onClickSubmitUpdate">确认修改</el-button>
          <el-button type="danger" @click="visible.updateForm = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { getThemes, createTheme, updateTheme } from '../api/theme'
  const defaultSearchForm = {
    theme_name: null,
    state: null,
    currentPage: 1,
    pageSize: 10,
    totalCount: 0
  }
  const defaultCreateForm = {
    state: 0, // 主题状态
    theme_name: '', // 主题名称
    theme_content: '', // 主题介绍详情
    creater_id: null, // 创建人ID
    create_time: null, // 创建时间
    end_time: null, // 截止时间
    votes_max: 500, // 设置最大投票数
    options_count: null, // 设置可供选择的选项数
    options_type: 0, // 设置选择类型
    choose_max: 1, // 设置最大选择数
    // options_content: null // JSON存储选项内容+已投票数的数组
    options_content: [
      { name: '', number: 0 }
    ]
  }
  const defaultUpdateForm = {
    id: null, // 被修改的投票ID
    state: null, // 主题状态
    theme_name: '', // 主题名称
    theme_content: '', // 主题介绍详情
    creater_id: null, // 创建人ID
    create_time: null, // 创建时间
    end_time: null, // 截止时间
    votes_max: 500, // 设置最大投票数
    options_count: null, // 设置可供选择的选项数
    options_type: 1, // 设置选择类型
    choose_max: 3, // 设置最大选择数
    options_content: [] // JSON存储选项内容+已投票数的数组
  }
  export default {
    name: 'mine',
    data() {
      return {
        // 表格源数据书
        list: [],
        // 搜索表单对象
        searchForm: Object.assign({}, defaultSearchForm),
        // 创建投票表单对象
        createForm: Object.assign({}, defaultCreateForm),
        // 修改投票表单对象
        updateForm: Object.assign({}, defaultUpdateForm),
        // 对话框可视属性
        visible: {
          createForm: false,
          updateForm: false
        }
      }
    },
    filters: {
      // 主题状态过滤器
      stateFilter(value) {
        if (value === 0) return '待开启'
        else if (value === 1) return '投票中'
        else if (value === 2) return '已完成'
        else if (value === 3) return '已取消'
        else return '错误'
      },
      optionsTypeFilter(value) {
        if (value === 0) return '单选'
        else if (value === 1) return '可多选'
        else return '错误'
      }
    },
    methods: {
      /** 接口方法 - 获取所有我的主题 */
      fetchList() {
        this.searchForm.creater_id = this.$store.getters.userId
        getThemes(this.searchForm).then(res => {
          this.list = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      /** 主题名称 被点击事件 */
      onClickShowThemeDetail(id) {
        this.$router.push({
          path: '/one',
          query: { theme_id: id }
        })
      },
      /** 分页器方法 - 每页显示条数改变 */
      handleSizeChange(pageSize) {
        this.searchForm.pageSize = pageSize
        this.fetchList()
      },
      /** 分页器方法 - 当前页改变 */
      handlePageChange(currentPage) {
        this.searchForm.page = currentPage
        this.fetchList()
      },
      /** 搜索 - 提交搜索 */
      onSubmitSearch() {
        getThemes(this.searchForm).then(res => {
          this.list = res.data._items
        })
      },
      /** 搜索 - 重置搜索 */
      onResetSearch() {
        this.searchForm = Object.assign({}, defaultSearchForm)
        this.fetchList()
      },
      /** 创建主题 - 新增选项 */
      onClickAddOption() {
        this.createForm.options_content.push({
          name: '',
          number: 0,
          key: Date.now()
        })
        this.createForm.options_count = (this.createForm.options_content).length
      },
      /** 修改主题 - 新增选项 */
      onClickAddOption_() {
        this.updateForm.options_content.push({
          name: '',
          number: 0,
          key: Date.now()
        })
        this.updateForm.options_count = (this.updateForm.options_content).length
      },
      /** 创建主题 - 删除选项 */
      onClickRemoveOption(item) {
        const index = this.createForm.options_content.indexOf(item)
        if (index !== -1) {
          this.createForm.options_content.splice(index, 1)
        }
        this.createForm.options_count = (this.createForm.options_content).length
      },
      /** 修改主题 - 删除选项 */
      onClickRemoveOption_(item) {
        const index = this.updateForm.options_content.indexOf(item)
        if (index !== -1) {
          this.updateForm.options_content.splice(index, 1)
        }
        this.updateForm.options_count = (this.updateForm.options_content).length
      },
      /** 创建主题 - 重置表单 */
      onClickResetCreateForm() {
        this.createForm = Object.assign({}, defaultCreateForm)
      },
      /** 修改主题 - 重置表单 */
      onClickResetUpdateForm() {
        this.updateForm = Object.assign({}, defaultUpdateForm)
      },
      /** 创建主题 - 提交创建 */
      onClickSubmitCreate() {
        // 将options_content数组转JSON
        this.createForm.options_JSON = JSON.stringify(this.createForm.options_content)
        // 获取创建人id
        this.createForm.creater_id = this.$store.getters.userId
        // 提交创建请求
        console.log(this.createForm)
        createTheme(this.createForm).then(res => {
          if (res.data.bCode === 101) {
            this.$notify({ title: '成功', message: '创建主题成功!', type: 'success', position: 'top-right' })
            // 重置表单
            this.onClickResetCreateForm()
            // 隐藏表单
            this.visible.createForm = false
            // 刷新表格
            this.fetchList()
          } else {
            this.$notify({
              title: '警告',
              // eslint-disable-next-line
              message: res.data.bData[key],
              type: 'warning',
              position: 'top-right'
            })
          }
        })
      },
      /** 修改主题 - 提交修改 */
      onClickSubmitUpdate() {
        // 将options_content数组转JSON
        this.updateForm.options_JSON = JSON.stringify(this.updateForm.options_content)
        // 提交更新请求
        console.log(this.updateForm)
        updateTheme(this.updateForm).then(res => {
          if (res.data.bCode === 101) {
            this.$notify({ title: '成功', message: '更新成功!', type: 'success', position: 'top-right' })
            // 重置表单
            this.onClickResetUpdateForm()
            // 隐藏表单
            this.visible.updateForm = false
            // 刷新表格
            this.fetchList()
          } else {
            this.$notify({
              title: '警告',
              // eslint-disable-next-line
              message: res.data.bData[key],
              type: 'warning',
              position: 'top-right'
            })
          }
        })
      },
      /** 修改 按钮被点击事件 */
      onClickUpdate(row) {
        // 清空表单
        this.onClickResetUpdateForm()
        // console.log('读取主题数据 =>', row)
        this.updateForm.id = row.id
        this.updateForm = Object.assign({}, row)
        // JSON转回数组
        this.updateForm.options_content = JSON.parse(row.options_content)
        // console.log('JSON转换 =>', this.updateForm.options_content)
        // console.log('表单对象 =>', this.updateForm)
        // 显示修改对话框
        this.visible.updateForm = true
      },
      /** 开启 按钮被点击事件 */
      onClickOpen(row) {
        const form = { id: row.id, state: 1 }
        updateTheme(form).then(res => {
          if (res.data.bCode === 101) {
            this.$notify({ title: '成功', message: '开启成功!', type: 'success', position: 'top-right' })
            // 刷新表格
            this.fetchList()
          } else {
            this.$notify({
              title: '警告',
              // eslint-disable-next-line
              message: res.data.bData[key],
              type: 'warning',
              position: 'top-right'
            })
          }
        })
      },
      /** 取消 按钮被点击事件 */
      onClickCancel(row) {
        const form = { id: row.id, state: 3 }
        updateTheme(form).then(res => {
          if (res.data.bCode === 101) {
            this.$notify({ title: '成功', message: '取消成功!', type: 'success', position: 'top-right' })
            // 刷新表格
            this.fetchList()
          } else {
            this.$notify({
              title: '警告',
              // eslint-disable-next-line
              message: res.data.bData[key],
              type: 'warning',
              position: 'top-right'
            })
          }
        })
      },
      /** 完成 按钮被点击事件 */
      onClickDone(row) {
        const form = { id: row.id, state: 2 }
        updateTheme(form).then(res => {
          if (res.data.bCode === 101) {
            this.$notify({ title: '成功', message: '已设置主题投票完成!', type: 'success', position: 'top-right' })
            // 刷新表格
            this.fetchList()
          } else {
            this.$notify({
              title: '警告',
              // eslint-disable-next-line
              message: res.data.bData[key],
              type: 'warning',
              position: 'top-right'
            })
          }
        })
      },
      /** 样式过滤器 - 投票状态 - tag样式 */
      optionsTagType(value) {
        if (value === 0) return 'primary'
        else if (value === 1) return 'success'
        else if (value === 2) return 'danger'
        else if (value === 3) return 'info'
        else return 'warning'
      },
      /** 样式过滤器 - 投票类型 - tag样式 */
      optionsTagType2(value) {
        if (value === 0) return 'primary'
        else if (value === 1) return 'success'
        else return '错误'
      }
    },
    mounted() {
      /** 页面加载完毕后立即获取所有我的主题 */
      this.fetchList()
    }
  }
</script>

<style scoped>

</style>
