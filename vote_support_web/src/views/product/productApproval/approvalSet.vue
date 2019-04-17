<template>
    <div class="app-container">
      <el-button type="primary" @click="onClickCreate" icon="el-icon-plus" size="mini">创建</el-button>
      <div class="dialog_product_approval">
        <el-dialog
          title="创建审批人"
          :visible.sync="createDialogVisible"
          width="30%"
          :before-close="handleClose">
          <el-form :model="ruleForm" ref="ruleForm" label-width="90px" size="small">
            <el-form-item label="审批人类型" prop="product_approver_state">
              <el-select v-model.number="ruleForm.type" placeholder="请选择审批状态">
                <el-option label="一级审核人" :value="1"></el-option>
                <el-option label="二级审核人" :value="2"></el-option>
                <el-option label="三级审核人" :value="3"></el-option>
                <el-option label="四级审核人" :value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审批人" prop="project_id">
              <el-select
                v-model.number="ruleForm.approval_id"
                filterable
                remote
                reserve-keyword
                placeholder="关键词搜索，空格表示全部"
                :remote-method="remoteMethod"
                :loading="loading.username"
                style="width: 100%">
                <el-option
                  v-for="item in username"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="createDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onSubmitWorkerApply('ruleForm')" size="mini">提 交</el-button>
        </span>
        </el-dialog>
      </div>
      <div class="element_table">
        <el-table
          :data="applyList"
          stripe
          border
          fit
          :status-icon="true"
          style="width: 30%"
          size="mini">
          <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
          <el-table-column label="审批人类型" prop="type" align="center" :formatter="typeFormat"></el-table-column>
          <el-table-column label="审批人" prop="user" width="100" align="center"></el-table-column>
          <el-table-column label="修改"align="center" width="150">
            <template slot-scope="scope">
              <el-button @click="onClickEdit(scope.row)" type="primary" size="mini">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
</template>

<script>
  import { createWorkerApplyConfig, getWorkerApplysConfig, updateWorkerApplyConfig, getWorkerApplyConfig } from '../../../api/workerApplyConfig'
  import { getUsers } from '../../../api/user'
  import { replyRes } from '../../../utils/res'

  const defaultRuleForm = {
    approval_id: null,
    type: 1
  }
  export default {
    name: 'approvalSet',
    data() {
      return {
        searchForm: {
          expand: 'user',
          page: 1,
          pageSize: 30,
          totalCount: 0
        },
        createDialogVisible: false,
        editDialogVisible: false,
        ruleForm: Object.assign({}, defaultRuleForm),
        loading: {
          username: false
        },
        username: {},
        applyList: []
      }
    },
    mounted() {
      this.fetchWorkerApplysConfig()
    },
    methods: {
      fetchWorkerApplysConfig() {
        getWorkerApplysConfig(this.searchForm).then(res => {
          this.applyList = res.data._items
        })
      },
      fetchWorkerApplyConfig(item) {
        return getWorkerApplyConfig({ id: item.id }).then(res => {
          this.ruleForm = res.data
        }).then(res => {
          getUsers({ id: item.approval_id }).then(res => {
            this.username = res.data._items
            this.loading.username = false
          })
        })
      },
      /** 创建审批人 */
      onClickCreate() {
        this.createDialogVisible = true
      },
      /** 修改 */
      onClickEdit(item) {
        this.createDialogVisible = true
        this.editDialogVisible = true
        this.fetchWorkerApplyConfig(item)
      },
      onSubmitWorkerApply() {
        console.log(this.ruleForm)
        if (this.createDialogVisible === true && this.editDialogVisible === false) {
          createWorkerApplyConfig(this.ruleForm).then(res => {
            if (replyRes(res)) {
              this.createDialogVisible = false
              this.ruleForm = Object.assign({}, defaultRuleForm)
              this.fetchWorkerApplysConfig()
            }
          })
        } else {
          updateWorkerApplyConfig(this.ruleForm).then(res => {
            if (replyRes(res)) {
              this.editDialogVisible = false
              this.createDialogVisible = false
              this.ruleForm = Object.assign({}, defaultRuleForm)
              this.fetchWorkerApplysConfig()
            }
          })
        }
      },
      /** 远程搜索客户列表方法 */
      remoteMethod(query) {
        this.loading.username = true
        let params = {}
        if (query !== null && query.trim() !== '') {
          params = { name: query.trim() }
        }
        getUsers(params).then(res => {
          this.username = res.data._items
          this.loading.username = false
        })
      },
      typeFormat(row) {
        if (row.type === 1) {
          return '一级审核人'
        }
        if (row.type === 2) {
          return '二级审核人'
        }
        if (row.type === 3) {
          return '三级审核人'
        }
        if (row.type === 4) {
          return '四级审核人'
        }
      },
      /** 申请窗口关闭时调用方法 */
      handleClose() {
        this.createDialogVisible = false
        this.ruleForm = Object.assign({}, defaultRuleForm)
      }
    }
  }
</script>

<style scoped>

</style>
