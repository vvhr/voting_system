<template>
  <div class="app-container">
    <!--顶部操作工具栏-->
    <div >
      <el-button @click = "onClickCreateBtn" type="primary" size="mini"><i class="el-icon-circle-plus-outline"></i> 新增</el-button>
    </div>
    <!--客户编辑表单-->
    <el-dialog :title="this.activeId===0?'新增客户':'编辑客户'" :visible.sync="visible.ruleForm" @close="closeDialog()">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" sizi="mini">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户名称" prop="name">
              <el-input v-model.trim="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="当前地址" prop="fullAddress">
              <div style="border-bottom: dashed 1px #a0a0a0;height: 35px">{{ruleForm.fullAddress}}</div>
            </el-form-item>
            <el-form-item>
              <regionsComponent  v-model="regionIdArr"></regionsComponent>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
              <el-input v-model.trim="ruleForm.address"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="manager">
              <el-input v-model.trim="ruleForm.manager"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="tel">
              <el-input v-model.trim="ruleForm.tel"></el-input>
            </el-form-item>
            <el-form-item label="纳税人识别号" prop="invoice_tax_no">
              <el-input v-model.trim="ruleForm.invoice_tax_no"></el-input>
            </el-form-item>
            <el-form-item label="开户行帐号" prop="invoice_bank_no">
              <el-input v-model.trim="ruleForm.invoice_bank_no"></el-input>
            </el-form-item>
            <el-form-item label="开票联系人" prop="invoice_contract_person">
              <el-input v-model.trim="ruleForm.invoice_contract_person"></el-input>
            </el-form-item>
            <el-form-item label="开票联系人电话" prop="invoice_tel">
              <el-input v-model.trim="ruleForm.invoice_tel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" size="mini">提交</el-button>
          <el-button @click="visible.ruleForm = false" size="mini">关闭</el-button>
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

    <div class="element_table">
      <el-table
        :data="list"
        stripe
        border
        fit
        :status-icon="true"
        style="width: 100%"
        :row-style="rowStyle" :cell-style="cellStyle"
        size="mini">
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="客户名称" width="200" align="center"></el-table-column>
        <el-table-column label="地址"  align="center">
          <template slot-scope="scope">
            {{scope.row.fullAddress}},{{scope.row.address}}
          </template>
        </el-table-column>
        <el-table-column  label="负责人" width="180" align="center">
          <template slot-scope="scope">
            {{scope.row.manager}},{{scope.row.tel}}
          </template>
        </el-table-column>
        <el-table-column prop="invoice_bank_no" label="开票开户行账号" width="150" align="center"></el-table-column>
        <el-table-column prop="invoice_tax_no" label="开标税号" width="150" align="center"></el-table-column>
        <el-table-column label="负责人" width="180" align="center">
          <template slot-scope="scope">
            {{scope.row.invoice_contract_person}},{{scope.row.invoice_tel}}
          </template>
        </el-table-column>
        <el-table-column  label="更新时间" width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.updated_at | parseTime}}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="200">
          <template slot-scope="scope">
            <el-button @click="onClickEditBtn(scope.row.id)" size="mini"><i class="el-icon-edit"></i>修改</el-button>
            <el-button @click="onClickDeleteBtn(scope.row.id)" size="mini"><i class="el-icon-delete"></i>禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--客户列表-->
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_customer   beforeMount()
    新增客户: create_customer onClickCreateBtn()
    修改客户: update_customer onClickEditBtn()
    删除客户: delete_customer onClickEditBtn()
-->
<script>
import { createCustomer, getCustomers, getCustomer, updateCustomer } from '../../api/customer'
import { replyRes } from '../../utils/res'
import regionsComponent from '../../components/region'
import { getFullAddress } from '../../api/region'
import { parseTime } from '../../utils'

const defaultRuleForm = {
  name: 'test',
  region_id: null,
  address: 'test',
  manager: 'test',
  tel: '15888888888',
  invoice_tax_no: '8888888',
  invoice_bank_no: '8888888',
  invoice_contract_person: 'test',
  invoice_tel: '1588888888',
  fullAddress: ''
}
export default {
  components: { regionsComponent },
  data() {
    return {
      /**
       * 创建表单相关变量
       */
      activeId: 0,
      // 当前选中的地址id组
      regionIdArr: [],
      visible: {
        ruleForm: false
      },
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        region_id: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        fullAddress: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
        // invoice_tax_no: [
        //   { required: true, message: '请输入', trigger: 'blur' }
        // ],
        // invoice_bank_no: [
        //   { required: true, message: '请输入', trigger: 'blur' }
        // ],
        // invoice_contract_person: [
        //   { required: true, message: '请输入', trigger: 'blur' }
        // ],
        // invoice_tel: [
        //   { required: true, message: '请输入', trigger: 'blur' }
        // ]
      },
      ruleForm: Object.assign({}, defaultRuleForm),
      /**
       * 客户列表相关变量
       */
      list: [],
      pageInfo: {
        page: 1,
        pageSize: 10,
        totalCount: 0
      }
    }
  },
  filters: {
    parseTime: function(value) {
      if (value === null) {
        return '_________'
      }
      return parseTime(value, '{y}-{m}-{d}')
    }
  },
  mounted() {
    this.fetchList()
  },
  watch: {
    regionIdArr() {
      console.log('watch')
      if (this.regionIdArr.length > 0) {
        this.ruleForm.region_id = this.regionIdArr[this.regionIdArr.length - 1]
        getFullAddress(this.ruleForm.region_id).then(res => {
          this.ruleForm.fullAddress = res.data.fullAddress
        })
      } else {
        this.ruleForm.fullAddress = ''
      }
    }
  },
  methods: {
    /**
     * 客户列表相关命令
     */
    fetchList() {
      getCustomers(this.pageInfo).then(res => {
        this.list = res.data._items
        this.pageInfo.totalCount = res.data._meta.totalCount
      })
    },
    fetchOne() {
      getCustomer(this.activeId).then(res => {
        console.log(res)
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
      /** 权限检查 */
      if (this.actionCheck_.actionCheck('create_customer#') === false) {
        this.$message.error('错误提示,您没有该操作的权限!')
        return false
      }
      this.activeId = 0
      this.visible.ruleForm = true
    },
    onClickEditBtn(id) {
      /** 权限检查 */
      if (this.actionCheck_.actionCheck('update_customer#') === false) {
        this.$message.error('错误提示,您没有该操作的权限!')
        return false
      }
      this.activeId = id
      this.fetchOne()
      this.visible.ruleForm = true
    },
    onClickDeleteBtn(id) {
      /** 权限检查 */
      if (this.actionCheck_.actionCheck('delete_customer#') === false) {
        this.$message.error('错误提示,您没有该操作的权限!')
        return false
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.activeId === 0) {
            // 调用新增顾客接口并响应
            createCustomer(this.ruleForm).then(res => {
              if (replyRes(res)) {
                this.visible.ruleForm = false
              }
            })
          } else {
            // 调用更新顾客接口并响应
            updateCustomer(this.ruleForm).then(res => {
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
      this.regionIdArr = []
      this.fetchList()
    },
    /** -------- 表格样式设置方法 -------- */
    rowStyle() {
      return 'height: 25px'
    },
    cellStyle() {
      return 'padding: 2px'
    }
  },
  beforeMount() {
    /**  页面权限检查 如无权限则跳转至404  */
    if (this.actionCheck_.actionCheck('read_customer#') === false) {
      this.$message.error('错误提示: 您没有访问该页面的权限!')
      this.$router.push({ name: '404' })
    }
  }
}
</script>
