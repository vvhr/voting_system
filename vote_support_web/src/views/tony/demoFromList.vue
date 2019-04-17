<template>
  <div class="app-container">
    <!--顶部操作工具栏-->
    <div style="margin: 10px 0">
      <el-button @click = "onClickCreateBtn"><i class="el-icon-circle-plus-outline"></i> 新增</el-button>
    </div>
    <!--编辑表单-->
    <el-dialog :title="this.activeId===0?'新增项目':'编辑项目'" :visible.sync="visible.ruleForm" @close="closeDialog()">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--分页器-->
    <div style="padding:0 10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page="pageInfo.currentPage"
        :page-sizes="[10,30,50,100]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.totalCount">
      </el-pagination>
    </div>
    <!--列表-->
    <table class="_table" border="0" cellpadding="0" cellspacing="0" style="width: 100%">
      <thead>
      <tr>
        <th>id</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, key) in list" :key="key">
        <td>{{item.id}}</td>
        <td>
          <el-button @click="onClickEditBtn(item.id)"><i class="el-icon-edit"></i>修改</el-button>
          <el-button @click="onClickDeleteBtn(item.id)"><i class="el-icon-delete"></i>禁用</el-button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { createReceival, getReceivals, getReceival, updateReceival } from '../../api/receival'
  import { replyRes } from '../../utils/res'
  import { parseTime } from '../../utils'
  import Store from '../../store'

  const defaultRuleForm = {
    name: '测试项目名称'
  }
  export default {
    data() {
      return {
        /**
         * 创建表单相关变量
         */
        activeId: 0,
        visible: {
          ruleForm: false
        },
        rules: {
          name: [
            { required: true, message: '请输入', trigger: 'blur' }
          ]
        },
        ruleForm: Object.assign({}, defaultRuleForm),
        /**
         * 项目列表相关变量
         */
        list: [],
        pageInfo: {
          page: 1,
          pageSize: 10,
          totalCount: 0
        }
      }
    },
    computed: {
      branches() {
        return this.$store.state.user.branches
      }
    },
    filters: {
      parseTime: function(value) {
        if (!value) return ''
        value = value.toString()
        return parseTime(value, '{y}年{m}月{d}日')
      },
      parseBranch: function(value) {
        const list = Store.state.user.branches
        for (const index in list) {
          if (parseInt(list[index].id) === value) {
            return list[index].name
          }
        }
        return value
      }
    },
    mounted() {
      this.fetchList()
    },
    methods: {
      /**
       * 项目列表相关命令
       */
      fetchList() {
        getReceivals(this.pageInfo).then(res => {
          console.log('res', res)
          this.list = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
        })
      },
      fetchOne() {
        getReceival(this.activeId).then(res => {
          this.ruleForm = Object.assign({}, res.data)
        })
      },
      // 一页多少行
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize
        this.fetchList()
      },
      // 翻页
      handlePageChange(currentPage) {
        this.pageInfo.page = currentPage
        this.fetchList()
      },
      /**
       * 创建编辑相关命令
       * */
      onClickCreateBtn() {
        this.activeId = 0
        this.visible.ruleForm = true
      },
      onClickEditBtn(id) {
        this.activeId = id
        this.fetchOne()
        this.visible.ruleForm = true
      },
      onClickDeleteBtn(id) {},
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.activeId === 0) {
              // 调用新增接口并响应
              createReceival(this.ruleForm).then(res => {
                if (replyRes(res)) {
                  this.visible.ruleForm = false
                }
              })
            } else {
              // 调用更新接口并响应
              updateReceival(this.ruleForm).then(res => {
                if (replyRes(res)) {
                  this.visible.ruleForm = false
                }
              })
            }
          } else {
            console.log('ruleForm validate fail')
            return false
          }
        })
      },
      closeDialog() {
        this.ruleForm = Object.assign({}, defaultRuleForm)
        this.fetchList()
      }
    }
  }
</script>
