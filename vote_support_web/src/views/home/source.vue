<template>
  <div class="app-container">
    <!--顶部操作按钮及筛选表单-->
    <div>
      <el-form :inline="true" :model="searchForm">

        <el-form-item label="分公司">
          <el-select v-model="searchForm.branch_id" placeholder="请选择所属分公司">
            <el-option label="所有" value="0" :key="-1"></el-option>
            <el-option v-for="(branch, key) in branches" :label="branch.name" :value="branch.id | parseInt " :key="key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="会议主题">
          <el-input v-model="searchForm.name" placeholder="请输入可能包含的字符"></el-input>
        </el-form-item>

        <el-form-item label="举行日期">
          <el-date-picker
            v-model="searchForm.dateRange"
            value-format = "timestamp"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button @click="onCreateSource"><i class="el-icon-edit"></i> 新增会议记录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--创建会议记录的表单-->
    <el-dialog title="会议记录" :visible.sync="dialogVisible" width="800" top="5px" @open="handleOpenDialog" @close="handleClosedDialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">

        <el-form-item label="记录类型" prop="type_id">
          <el-select v-model="ruleForm.type_id" placeholder="请选择记录类型">
            <el-option v-for="(item, key) in sourceType" :label="item.name" :value="item.id" :key="key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分公司" prop="branch_id">
          <el-select v-model="ruleForm.branch_id" placeholder="请选择所属分公司">
            <el-option v-for="(branch, key) in branches" :label="branch.name" :value="branch.id | parseInt" :key="key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="会议主题" prop="name">
          <el-input v-model="ruleForm.name" placeHolder="请输入会议主题或名称"></el-input>
        </el-form-item>

        <el-form-item label="会议日期" prop="meeting_date">
          <el-date-picker v-model="ruleForm.meeting_date" type="date" placeholder="选择日期" value-format="timestamp">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="记录内容" prop="content">
          <!--<el-input type="textarea" v-model="ruleForm.content" :autosize="{ minRows: 8, maxRows: 100}" placeholder="请输入记录内容"></el-input>-->
          <Tinymce :height=200 ref="editor" id="_tinyMce" v-model="ruleForm.content" />
          <!--<el-input type="textarea" v-model="ruleForm.content" />-->
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!--删除确认对话框-->
    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%">
      <span>删除操作是不可恢复的！确认删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDeleteSource()">确 定</el-button>
      </span>
    </el-dialog>
    <!--会议记录列表-->
    <!--会议记录分页器-->
    <div style="padding:0 10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.currentPage"
        :page-sizes="[3,6,12,24]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.totalCount">
      </el-pagination>
    </div>
    <!--宽度调节条-->
    <div style="width: 30%; margin: 10px">
      <el-slider v-model="tableWidth" :format-tooltip="formatTableWidth"></el-slider>
    </div>
    <!--表格-->
    <div>
      <!--<div  class="_table-wrap" :style="{ width: tableWidth*10 + 'px' }">-->
      <table class="_table" border="0" cellpadding="0" cellspacing="0" style="width: 100%">
        <thead>
        <tr>
          <th>id</th>
          <th>会议主题</th>
          <th>分公司</th>
          <th>记录类型</th>
          <th>举行时间</th>
          <th>录入者</th>
          <th>内容</th>
          <th>更新时间</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, key) in sources" :key="key">
          <td>{{item.id}}</td>
          <td>{{item.name }}</td>
          <td>{{item.branch_name }}</td>
          <td>{{item.type_id | parseType }}</td>
          <td>{{item.meeting_date | parseTime}}</td>
          <td>{{item.user_name }}</td>
          <td>
            <!--<div style="height: 500px; overflow: scroll" v-html="item.content"></div>-->
          </td>
          <td>{{item.updated_at | parseTime }}</td>
          <td>
            <el-button type="primary" @click="onShowContent(key)"> 查看详情</el-button>
            <el-button @click="onEditSource(item.id, item.user_id)"><i class="el-icon-edit"></i>修改</el-button>
            <el-button @click="onDeleteSource(item.id, item.user_id)"><i class="el-icon-delete"></i>删除</el-button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <!--显示会议记录内容对话框-->
    <el-dialog :title="activeSource.name" :visible.sync="dialogContentVisible">
      <div style="width: 100%; border-bottom: solid 3px red">&nbsp;</div>
      <div v-html="activeSource.content"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogContentVisible = false">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import { deleteSource, updateSource, viewSource, getSources, createSource } from '@/api/source'
  import { parseTime } from '@/utils/index'
  import Tinymce from '@/components/Tinymce'

  const defaultRuleForm = {
    id: 0,
    name: '',
    meeting_date: +(new Date()),
    type_id: 1,
    branch_id: 1,
    content: '<p>会议记录：</p> <hr/> <p></p>'
  }
  export default {
    components: { Tinymce },
    data() {
      return {
        dialogContentVisible: false,
        activeSource: '',
        active_source_id: 0,
        deleteDialogVisible: false,
        pageInfo: {
          currentPage: 1,
          pageSize: 6,
          totalCount: 0
        },
        sourceType: [
          { id: 1, name: '会议记录' },
          { id: 2, name: '口头交待' },
          { id: 3, name: '其它' }
        ],
        // 宽度调节条默认值
        tableWidth: 50,
        dialogVisible: false,
        // 带快捷键的时间选择器选项参数
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        sources: [],
        searchForm: {
          branch_id: '0',
          name: '',
          dateRange: []
        },
        ruleForm: Object.assign({}, defaultRuleForm),
        rules: {
          content: [
            { required: true, message: '请输入记录内容', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入会议主题', trigger: 'blur' }
          ]
        }
      }
    },
    filters: {
      parseTime: function(value) {
        if (!value) return ''
        value = value.toString()
        return parseTime(value, '{y}-{m}-{d}')
      },
      parseType: function(index) {
        const sourceType = ['会议记录', '口头交待', '其它']
        if (!index) return ''
        return sourceType[index - 1]
      },
      parseInt: function(value) {
        return parseInt(value)
      }
    },
    computed: {
      branches() {
        return this.$store.state.user.branches
      },
      finalSearchForm() {
        const res = {}
        res.branch_id = this.searchForm.branch_id
        res.name = this.searchForm.name
        if (this.searchForm.dateRange !== null && this.searchForm.dateRange.length > 0) {
          res.started_at = Math.floor(this.searchForm.dateRange[0] / 1000)
          res.ended_at = Math.floor(this.searchForm.dateRange[1] / 1000)
        } else {
          res.started_at = 0
          res.ended_at = 0
        }
        res.pageSize = this.pageInfo.pageSize
        res.page = this.pageInfo.currentPage
        return res
      }
    },
    mounted() {
      this.fetchSources({ page: 1 })
    },
    methods: {
      fetchSources(params) {
        getSources(params).then(res => {
          this.sources = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
        })
      },
      // 会记记录内容宽度调节工具格式化
      formatTableWidth(v) {
        return v * 10
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params = Object.assign({}, this.ruleForm)
            params.meeting_date = Math.floor(params.meeting_date / 1000)
            // id为0是新增，不为0是更新
            if (this.ruleForm.id === 0) {
              createSource(params).then(res => {
                if (res.data.bCode === 101) {
                  getSources(this.finalSearchForm).then(res => {
                    this.sources = res.data._items
                    this.$notify({
                      title: '成功',
                      message: '新增成功',
                      type: 'success',
                      position: 'top-right'
                    })
                    console.log('create source is completed')
                    this.dialogVisible = false
                  })
                } else {
                  for (const key in res.data.bData) {
                    this.$notify({
                      title: '警告',
                      message: res.data.bData[key],
                      type: 'warning',
                      position: 'top-right'
                    })
                  }
                }
              })
            } else {
              updateSource(params).then(res => {
                if (res.data.bCode === 101) {
                  getSources(this.finalSearchForm).then(res => {
                    this.sources = res.data._items
                    this.dialogVisible = false
                    this.$notify({
                      title: '成功',
                      message: '修改成功',
                      type: 'success',
                      position: 'top-right'
                    })
                    console.log('update source is completed')
                  })
                } else {
                  for (const key in res.data.bData) {
                    this.$notify({
                      title: '警告',
                      message: res.data.bData[key],
                      type: 'warning',
                      position: 'top-right'
                    })
                  }
                }
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      onCreateSource() {
        this.ruleForm = Object.assign({}, defaultRuleForm)
        this.dialogVisible = true
      },
      onEditSource(source_id, user_id) {
        if (this.$store.state.user.userId !== user_id) {
          this.$notify({
            title: '警告',
            message: '你只能修改自己创建的记录',
            type: 'warning',
            position: 'top-right'
          })
          return
        }
        viewSource(source_id).then(res => {
          this.dialogVisible = true
          res.data.meeting_date *= 1000
          this.ruleForm = Object.assign({}, res.data)
        })
      },
      onSearch() {
        this.fetchSources(this.finalSearchForm)
      },
      onShowContent(key) {
        console.log('显示当前会议记录内容')
        this.dialogContentVisible = true
        this.activeSource = this.sources[key]
      },
      onDeleteSource(id, user_id) {
        if (this.$store.state.user.userId !== user_id) {
          this.$notify({
            title: '警告',
            message: '你只能删除自己创建的记录',
            type: 'warning',
            position: 'top-right'
          })
          return
        }
        this.deleteDialogVisible = true
        this.active_source_id = id
      },
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize
        this.fetchSources(this.finalSearchForm)
      },
      handleCurrentChange(currentPage) {
        this.pageInfo.currentPage = currentPage
        this.fetchSources(this.finalSearchForm)
      },
      handleOpenDialog() {
        console.log('Dialog is opened')
        // 当第一次显示对话框的时候，tinyMce执行初始化回调
        // 每次打开对框，都将tinyMce的编辑状态强制改为false
        if (this.$refs['editor'] !== null && this.$refs['editor'] !== undefined) {
          this.$refs['editor'].hasChange = false
        }
      },
      handleClosedDialog() {
        console.log('Dialog had closed')
      },
      handleDeleteSource() {
        deleteSource(this.active_source_id).then(res => {
          if (res.data.bCode === 101) {
            getSources(this.finalSearchForm).then(res => {
              this.sources = res.data._items
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                position: 'top-right'
              })
              this.deleteDialogVisible = false
            })
          } else {
            for (const key in res.data.bData) {
              this.$notify({
                title: '警告',
                message: res.data.bData[key],
                type: 'warning',
                position: 'top-right'
              })
            }
          }
        })
      }
    }
  }
</script>

<style>
  ._table-wrap{padding: 10px;margin:10px;border: solid thin #e0e0e0; min-width: 300px;box-shadow:10px 10px 5px #888888}
  .el-dialog__body{margin: 0 20px}
</style>
