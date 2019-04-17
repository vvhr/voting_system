<template>
  <div class="app-container">
    <!--我是物资科目明细表格-->
    <div>
      <!-- 表格头部组件 -->
      <el-form :inline="true">
        <el-form-item>
          <el-input size="small" v-model="search" placeholder="请输入科目名称可快速搜索！" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="showDelete===false" @click="onClickShow" type="primary" size="small">查看已禁用科目</el-button>
          <el-button v-else @click="onClickShow" type="success" size="small">查看生效中科目</el-button>
        </el-form-item>
        <!--添加新科目钮-->
        <el-form-item>
          <el-button @click="onCreate" type="danger" icon="el-icon-edit" size="small">添加新科目</el-button>
        </el-form-item>
      </el-form>
      <el-tag type="danger" size="mini">提示：修改科目明细前请先与财务核对！科目被禁用后无法再被创建报销时选择使用！</el-tag>
      <el-table border :data="types.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))" id="sbjType" :row-style="rowStyle" :cell-style="cellStyle">
        <el-table-column prop="id" label="科目ID" width="65" align="center"></el-table-column>
        <el-table-column prop="name" label="科目名称" width="250"></el-table-column>
        <el-table-column prop="content" label="涉及项目费用明细" width="400"></el-table-column>
        <el-table-column prop="content" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.valid===1" type="success" size="mini">生效中</el-tag>
            <el-tag v-else type="info" size="mini">已禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button @click="onUpdate(scope.row)" type="warning" class="btnUpdate" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button @click="onDelete(scope.row)" type="info" class="btnUpdate" icon="el-icon-error" size="mini" :disabled="scope.row.valid!==1" v-if="scope.row.valid===1">禁用</el-button>
            <el-button @click="onDelete(scope.row)" type="primary" class="btnUpdate" icon="el-icon-error" size="mini" :disabled="scope.row.valid===1" v-if="scope.row.valid!==1">启用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--添加新科目对话框表单-->
    <el-dialog title="添加新报销科目" :visible.sync="addFormVisible">
      <el-form :rules="rules" :model="ruleForm" ref="ruleForm">
        <!--填写员工姓名-->
        <el-form-item label="科目名称" props="name">
          <el-input v-model="ruleForm.name" placeholder="输入科目名称" auto-complete="off"></el-input>
        </el-form-item>
        <!--填写员工密码-->
        <el-form-item label="涉及项目费用明细说明" props="content">
          <el-input v-model="ruleForm.content" placeholder="暂无" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="subAddForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改科目对话框表单-->
    <el-dialog title="修改报销科目" :visible.sync="updateFormVisible">
      <el-form :rules="rules" :model="updateForm" ref="updateForm">
        <!--填写员工姓名-->
        <el-form-item label="科目名称" props="name">
          <el-input v-model="updateForm.name" placeholder="输入科目名称,不得与已有科目重复" auto-complete="off"></el-input>
        </el-form-item>
        <!--填写员工密码-->
        <el-form-item label="涉及项目费用明细说明" props="content">
          <el-input v-model="updateForm.content" placeholder="暂无" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="submitUpdateForm('updateForm')">确定修改</el-button>
        <el-button @click="updateFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_sbjType           beforeMount()
    新增单条: create_costSubject     onCreate()
    修改单条: update_costSubject     onUpdate()
-->
<script>
  import { getSbjType, createSbjType, updateSbjType } from '../../api/costBasic'

  export default {
    name: 'sbjType',
    data() {
      return {
        types: [],
        // 初始化搜索
        search: '',
        showDelete: false,
        ruleForm: {
          name: '',
          content: ''
        },
        updateForm: {
          id: null,
          name: '',
          content: ''
        },
        addFormVisible: false,
        updateFormVisible: false,
        rules: {
          name: [
            { required: true, message: '请输入科目名称', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 通过接口获取报销科目列表
      fetchSbjType(params) {
        getSbjType(params).then(res => {
          this.types = res.data
        })
      },
      onClickShow() {
        if (this.showDelete === true) {
          this.showDelete = false
          this.fetchSbjType({ valid: 1 })
        } else {
          this.fetchSbjType({ valid: 0 })
          this.showDelete = true
        }
      },
      onCreate() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('create_costSubject#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.addFormVisible = true
      },
      onUpdate(row) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_costSubject#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.updateForm.name = row.name
        this.updateForm.id = row.id
        this.updateForm.content = row.content
        this.updateFormVisible = true
      },
      onDelete(row) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_costSubject#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.updateForm.name = row.name
        this.updateForm.id = row.id
        this.updateForm.content = row.content
        if (row.valid === 1) this.updateForm.valid = 0
        else this.updateForm.valid = 1
        updateSbjType(this.updateForm).then(res => {
          if (res.data.bCode === 101) {
            getSbjType({ valid: 1 }).then(res => { this.types = res.data })
            this.showDelete = false
            this.$notify({ title: '成功', message: '操作成功', type: 'success', position: 'top-right' })
            this.updateFormVisible = false
          } else {
            this.$notify({ title: '警告', message: '操作失败', type: 'warning', position: 'top-right' })
          }
        })
      },
      subAddForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            createSbjType(this.ruleForm).then(res => {
              if (res.data.bCode === 101) {
                getSbjType({ valid: 1 }).then(res => {
                  this.types = res.data
                  this.showDelete = false
                })
                console.log('成功')
                this.$notify({
                  title: '成功',
                  message: '新增成功',
                  type: 'success',
                  position: 'top-right'
                })
                this.addFormVisible = false
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
            console.log('提交失败')
            return false
          }
        })
      },
      submitUpdateForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            updateSbjType(this.updateForm).then(res => {
              if (res.data.bCode === 101) {
                getSbjType({ valid: 1 }).then(res => {
                  this.types = res.data
                  this.showDelete = false
                })
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  position: 'top-right'
                })
                this.updateFormVisible = false
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
            console.log('提交失败')
            return false
          }
        })
      },
      /** 表格样式设置方法 */
      rowStyle() {
        return 'height: 25px'
      },
      cellStyle() {
        return 'padding: 2px'
      }
    },
    mounted() {
      this.fetchSbjType({ valid: 1 })
    },
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_sbjType#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style scoped>
  .btnUpdate{
    padding: 3px 8px;
  }
</style>
