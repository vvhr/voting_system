<template>
  <div class="app-container">
    <div class="header">
      <el-row style="background-color: rgb(236, 243, 247);padding-left: 10px;padding-top: 10px;border-radius:10px 10px;box-shadow: 0 1px 1px 1px #c0c4cc;">
        <el-form :inline="true" ref="searchForm" :model="searchForm" label-width="100px">
          <!--第一行-->
          <el-row style="height: 40px;">
              <el-form-item label="项目" label-width="70px">
                <el-input size="small" style="width: 320px" v-model="searchForm.project_name" placeholder="搜索项目名称"></el-input>
                <el-input size="small" style="width: 120px" v-model="searchForm.project_id" placeholder="项目ID"></el-input>
              </el-form-item>
              <el-form-item label="发票" label-width="50px">
                <el-input size="small" style="width: 200px" v-model="searchForm.invoice_no" placeholder="搜索发票号"></el-input>
                <el-input size="small" style="width: 120px" v-model="searchForm.invoice_id" placeholder="发票ID"></el-input>
              </el-form-item>
            <el-form-item label="收款ID" label-width="70px">
              <el-input size="small" v-model="searchForm.id"></el-input>
            </el-form-item>
          </el-row>
          <!--第二行-->
          <el-row style="height: 40px;">
              <el-form-item label="生效状态" label-width="70px">
                <el-select size="small" v-model="searchForm.status">
                  <el-option v-for="(val, key) in receiptStatus" :key="key" :label="val.name" :value="val.id"></el-option>
                </el-select>
              </el-form-item>
          </el-row>
          <!--第三行-->
          <el-row style="height: 40px;">
            <el-button size="small" @click="onSubmitSearchForm()" icon="el-icon-search" style="margin-left: 70px;width: 200px" type="primary">点击搜索</el-button>
            <el-button size="small" @click="resetSearchForm" icon="el-icon-close" style="width: 200px" type="primary">清空</el-button>
          </el-row>
        </el-form>
      </el-row>
      <el-row>
        <!--分页器-->
        <el-col>
          <div class="pagination">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
              :current-page="searchForm.currentPage"
              :page-sizes="[15, 25, 50, 100, 200]"
              :page-size="searchForm.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="searchForm.totalCount">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="body">
      <el-table :data="receipts"
                stripe fit
                @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="45"></el-table-column>
        <el-table-column property="id" label="收款ID" width="65"></el-table-column>
        <el-table-column property="receive_date" label="收款时间" width="170" :formatter="dateFormat"></el-table-column>
        <el-table-column property="money" label="收款金额" width="100"></el-table-column>
        <el-table-column property="invoice_company" label="付款单位" width="200"></el-table-column>
        <el-table-column property="invoice.invoice_no" label="所属发票" width="200"></el-table-column>
        <el-table-column property="project_name.name" label="所属项目" width="300"></el-table-column>
        <el-table-column property="comment" label="收款备注" width="300"></el-table-column>
        <el-table-column property="status" label="生效状态" width="100">
          <template slot-scope="scope">{{scope.row.status === 1?'已生效':'待确认'}}</template>
        </el-table-column>
        <el-table-column property="updated_at" label="生效时间" width="170" :formatter="dateFormat"></el-table-column>
        <el-table-column property="created_at" label="创建时间" width="170" :formatter="dateFormat"></el-table-column>
        <el-table-column property="inputUser.name" label="创建人" width="100"></el-table-column>
        <el-table-column fixed="left" align="center" label="操作" width="130">
          <template slot-scope="scope">
            <el-button @click="onClickConFirmReceipt(scope.row)" :disabled="scope.row.status===1" size="mini" type="primary">确认已收款</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_pageReceiptConfirmation   beforeMount()
-->
<script>
  const defaultSearchForm = {
    id: null,
    status: null,
    project_id: null,
    project_name: null,
    invoice_no: null,
    invoice_id: null,
    currentPage: 1,
    pageSize: 15,
    totalCount: 0
  }
  import { getReceivals, updateReceipt_ } from '../../../../api/receival'
  import { parseTime } from '../../../../utils/index'
  export default {
    data() {
      return {
        receipts: [], // 所有收款记录
        selection: [], // 被选中项
        receiptStatus: [
          { id: null, name: '所有' },
          { id: 0, name: '待确认' },
          { id: 1, name: '已生效' }
        ],
        searchForm: Object.assign({}, defaultSearchForm)
      }
    },
    methods: {
      /** 点击事件类 */
      onSubmitSearchForm() {
        this.fetchReceipts()
      },
      resetSearchForm() {
        this.searchForm = Object.assign({}, defaultSearchForm)
      },
      onClickConFirmReceipt(row) {
        if (this.$store.getters.userId !== 80) {
          this.$message({ message: '您无权操作!', type: 'warning' })
          return
        }
        if (row.status === 0 || row.status === '0') {
          const params = { 'status': 1, 'id': row.id }
          updateReceipt_(params).then(res => {
            if (res.data.bCode === 101) {
              this.$notify({ title: '成功', message: '已确认收款!', type: 'success', position: 'top-right' })
            } else {
              this.$notify({ title: '失败', message: res.data.bData, type: 'warning', position: 'top-right' })
            }
            this.fetchReceipts()
          })
        } else {
          this.$message({ message: '该收款已经确认过,无需重复操作!', type: 'warning' })
        }
      },
      /** 接口获取类 */
      fetchReceipts() {
        getReceivals(this.searchForm).then(res => {
          this.receipts = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      /** 格式过滤类 */
      dateFormat(row, column) {
        const date = row[column.property]
        if (date === null) return '暂无'
        return parseTime(date, '{y}-{m}-{d} {h}:{i}:{m}')
      }, // 时间格式化
      /** 处理器类 */
      handleSelectionChange(val) {
        // 收款表
        this.selection = val
      },
      // 一页多少行
      handleSizeChange(pageSize) {
        this.searchForm.pageSize = pageSize
        this.fetchReceipts()
      },
      // 翻页
      handlePageChange(currentPage) {
        this.searchForm.page = currentPage
        this.fetchReceipts()
      }
    },
    mounted() {
      this.fetchReceipts()
    },
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_pageReceiptConfirmation#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style scoped>
  .body{
    margin-top: 10px;
  }
  .pagination{
    margin-top: 5px;
    text-align: center;
  }
</style>
