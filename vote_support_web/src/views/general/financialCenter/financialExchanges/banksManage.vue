<template>
    <div class="app-container">
      <el-button @click="onClickCreate()" type="success" size="small" style="margin-bottom: 20px">+ 添加银行账户</el-button>
      <el-table v-loading="loading" border :data="banks" id="banks" :row-style="rowStyle" :cell-style="cellStyle" fit>
        <el-table-column align="center" prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="value" label="名称" width="300"></el-table-column>
        <el-table-column prop="company_name" label="单位" width="300"></el-table-column>
        <el-table-column prop="bank_account" label="账号" width="250"></el-table-column>
        <el-table-column align="right" prop="account_balance" label="余额" width="120"></el-table-column>
        <el-table-column prop="proof_1" label="单位缩写" width="100"></el-table-column>
        <el-table-column prop="proof_2" label="银行缩写" width="100"></el-table-column>
        <el-table-column align="center" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag size="mini" class="tag" :type="scope.row.valid | ValidTagStatusFilter">{{Number(scope.row.valid) === 1?'正常':'已停用'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" width="230" fixed="left" label="操作栏" v-if="this.$store.getters.userId === 145">
          <template slot-scope="scope">
            <el-button-group>
              <el-button @click="onClickEdit(scope.row)" type="primary" icon="el-icon-edit" size="mini">修改</el-button>
              <el-button @click="onClickUpdate(scope.row)" :type="scope.row.valid | ActionTypeFilter" :icon="scope.row.valid | ActionIconFilter" size="mini">{{Number(scope.row.valid) === 1?'停用':'启用'}}</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="操作" :visible.sync="visible.ruleForm" style="width: 1100px">
        <div style="align-content: center;margin-bottom: 15px">
          <el-tag size="mini" type="success">提示 </el-tag>
          您将要 <a style="color: #DD4A68">{{ formType===1?'创建银行账户':'修改银行信息' }}</a>
        </div>
        <el-form :model="ruleForm" label-width="100px" size="mini">
          <el-form-item label="银行名称">
            <el-input style="width: 250px" v-model="ruleForm.value" ></el-input>
          </el-form-item>
          <el-form-item label="银行缩写">
            <el-input style="width: 100px" v-model="ruleForm.proof_2"></el-input>
          </el-form-item>
          <el-form-item label="银行账号">
            <el-input style="width: 250px" v-model="ruleForm.bank_account" ></el-input>
          </el-form-item>
          <el-form-item label="单位名称">
            <el-input style="width: 250px" v-model="ruleForm.company_name" ></el-input>
          </el-form-item>
          <el-form-item label="单位缩写">
            <el-input style="width: 100px" v-model="ruleForm.proof_1"></el-input>
          </el-form-item>
          <el-form-item label="账户余额">
            <el-input style="width: 250px" v-model="ruleForm.account_balance"></el-input>
          </el-form-item>
          <el-form-item label="操作">
            <el-button type="primary" @click="submitForm()">确定修改</el-button>
            <el-button @click="visible.ruleForm = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script>
  import { getBanks, updateBank, createBank } from '../../../../api/bank'
  const defaultRuleForm = {
    proof_1: null,
    proof_2: null,
    bank_name: null,
    bank_account: null,
    company_name: null,
    account_balance: null
  }
  export default {
    name: 'banksManage',
    data() {
      return {
        banks: [],
        loading: false,
        formType: 1, // 1=创建,2=修改
        visible: {
          ruleForm: false
        },
        ruleForm: Object.assign({}, defaultRuleForm)
      }
    },
    filters: {
      ValidTagStatusFilter(valid) {
        const statusMap = {
          1: 'success',
          0: 'info'
        }
        return statusMap[valid]
      }, // 财务审批状态tag标签过滤器
      ActionTypeFilter(valid) {
        const statusMap = {
          1: 'info',
          0: 'success'
        }
        return statusMap[valid]
      },
      ActionIconFilter(valid) {
        const statusMap = {
          1: 'el-icon-error',
          0: 'el-icon-success'
        }
        return statusMap[valid]
      }
    },
    methods: {
      /** 点击事件类 */
      onClickCreate() {
        this.formType = 1
        this.visible.ruleForm = true
        this.resetRuleForm()
      },
      onClickEdit(row) {
        this.formType = 2
        this.resetRuleForm()
        this.ruleForm = Object.assign({}, row)
        this.visible.ruleForm = true
      },
      onClickUpdate(row) {
        const params = {
          valid: Number(!Number(row.valid)),
          id: row.id
        }
        updateBank(params).then(res => {
          if (res.data.bCode === 101) {
            if (Number(row.valid) === 1) this.$notify({ title: '已停用', type: 'success', position: 'top-right' })
            else this.$notify({ title: '已启用', type: 'success', position: 'top-right' })
            this.fetchBanks()
          } else {
            this.$notify({ title: '警告', message: '操作异常,请反馈给管理员', type: 'warning', position: 'top-right' })
          }
        })
      },
      /** API */
      fetchBanks() {
        this.loading = true
        getBanks().then(res => {
          this.banks = res.data._items
          this.loading = false
        })
      },
      /** -------- 表格样式类 -------- */
      rowStyle({ row, rowIndex }) {
        return 'height: 25px'
      },
      cellStyle({ row, column, rowIndex, columnIndex }) {
        return 'padding: 2px'
      },
      /** 表单处理类 */
      submitForm() {
        if (this.formType === 1) {
          createBank(this.ruleForm).then(res => {
            if (res.data.bCode === 101) {
              this.$notify({ title: '成功', message: '创建银行账户成功!', type: 'success', position: 'top-right' })
              this.fetchBanks()
            } else {
              this.$notify({ title: '警告', message: '创建失败,请反馈至管理员', type: 'warning', position: 'top-right' })
            }
            this.resetRuleForm()
            this.visible.ruleForm = false
          })
        } else if (this.formType === 2) {
          updateBank(this.ruleForm).then(res => {
            if (res.data.bCode === 101) {
              this.$notify({ title: '成功', message: '修改银行信息成功!', type: 'success', position: 'top-right' })
              this.fetchBanks()
            } else {
              this.$notify({ title: '警告', message: '创建失败,请反馈至管理员', type: 'warning', position: 'top-right' })
            }
            this.resetRuleForm()
            this.visible.ruleForm = false
          })
        } else {
          this.$notify({ title: '警告', message: '操作无效', type: 'warning', position: 'top-right' })
        }
      },
      resetRuleForm() {
        this.ruleForm = Object.assign({}, defaultRuleForm)
      }
    },
    mounted() {
      this.fetchBanks()
    },
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_Financial_pageProofCreate#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style scoped>

</style>
