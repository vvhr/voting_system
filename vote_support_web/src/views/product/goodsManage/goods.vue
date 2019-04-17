<template>
    <div class="app-container">
      <el-button type="primary" @click="onClickCreate" icon="el-icon-plus" size="mini">录入物资</el-button>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="searchForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="searchForm.totalCount">
        </el-pagination>
      </div>
      <div class="element_table">
        <el-table
          :data="List"
          stripe
          border
          fit
          :status-icon="true"
          style="width: 70%"
          :row-style="rowStyle" :cell-style="cellStyle"
          size="mini">
          <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
          <el-table-column label="物品名称" prop="name" align="center"></el-table-column>
          <el-table-column label="物品编号" prop="goods_no" width="100" align="center"></el-table-column>
          <el-table-column label="规格型号" prop="model_num" width="100" align="center"></el-table-column>
          <el-table-column label="库存量" prop="have_num" width="100" align="center"></el-table-column>
          <el-table-column label="单位" prop="unit" width="100" align="center"></el-table-column>
          <el-table-column label="备注" prop="content" width="100" align="center"></el-table-column>
          <el-table-column label="更新时间" prop="update_at" :formatter="dateFormat" width="100" align="center"></el-table-column>
        </el-table>
      </div>
      <!--录入物资表单-->
      <div>
        <el-dialog
          title="录入物资"
          :visible.sync="createApplyVisible"
          width="30%"
          :before-close="handleClose">
          <el-form :model="ruleForm" ref="ruleForm" label-width="80px" size="mini">
            <el-form-item label="产品名称" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="物资编码" prop="goods_no">
              <el-input v-model="ruleForm.goods_no"></el-input>
            </el-form-item>
            <el-form-item label="规格型号" prop="model_num">
              <el-input v-model="ruleForm.model_num"></el-input>
            </el-form-item>
            <el-form-item label="物品数量" prop="have_num">
              <el-input v-model.number="ruleForm.have_num" type="number"></el-input>
            </el-form-item>
            <el-form-item label="单位" prop="unit">
              <el-input v-model="ruleForm.unit"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="content">
              <el-input v-model="ruleForm.content"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="createApplyVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onSubmitCreate('ruleForm')" size="mini">提 交</el-button>
        </span>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import { replyRes } from '../../../utils/res'
  import { getGoods, createGoods } from '../../../api/goods'
  import { parseTime } from '../../../utils'
  const defaultRuleForm = {
    name: '',
    goods_no: '',
    model_num: '',
    have_num: null,
    unit: '',
    content: ''
  }

  const searchForm = {
    page: 1,
    pageSize: 10,
    totalCount: 0,
    valid: 1
  }
  export default {
    name: 'approvalSet',
    data() {
      return {
        searchForm: Object.assign({}, searchForm),
        ruleForm: Object.assign({}, defaultRuleForm),
        List: [],
        createApplyVisible: false
      }
    },
    mounted() {
      this.fetchGoods()
    },
    methods: {
      /** 物资录入提交按钮*/
      onSubmitCreate() {
        createGoods(this.ruleForm).then(res => {
          if (replyRes(res)) {
            this.createApplyVisible = false
            this.fetchGoods()
          }
        })
      },
      /** 录入物资按钮*/
      onClickCreate() {
        this.createApplyVisible = true
      },
      /** 获取仓库代表*/
      fetchGoods() {
        getGoods(this.searchForm).then(res => {
          this.List = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      handleSizeChange(val) {
        this.searchForm.pageSize = val
        this.fetchGoods()
      },
      handleCurrentChange(val) {
        this.searchForm.page = val
        this.fetchGoods()
      },
      handleClose() {
        this.createApplyVisible = false
      },
      /** -------- 表格样式设置方法 -------- */
      rowStyle() {
        return 'height: 25px'
      },
      cellStyle() {
        return 'padding: 2px'
      },
      /** table表格日期格式化 */
      dateFormat(row, column) {
        if (row === null) {
          return '暂无'
        }
        return parseTime(row[column.property], '{y}-{m}-{d}')
      }
    }
  }
</script>

<style scoped>

</style>
