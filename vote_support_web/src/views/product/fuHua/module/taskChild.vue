<template>
    <div class="" style="padding: 0;margin: 0;width: 100%;">
      <el-button type="primary"  @click="onSubmitLook(id)" size="mini">查看记录</el-button>

      <el-dialog
        title="查看流程"
        :visible.sync="dialogVisible"
        width="50%"
        :modal="false">
        <div id="app" style="width: 100%;display:inline-block">
          <el-form ref="searchForm" :model="searchForm" label-width="70px">
            <el-col :span="6">
              <el-form-item label="生产状态" prop="status">
                <el-select v-model="searchForm.status" placeholder="生产状态">
                  <el-option v-for="(val, key) in projectYtStatus" :key="key" :label="val.name" :value="val.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button @click="onSubmitSearchForm()" icon="el-icon-search" circle style="float: right;margin-right: 50%"></el-button>
            </el-col>
          </el-form>
        </div>
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
        <table class="_table" border="0" cellpadding="0" cellspacing="0" style="width: 100%">
          <thead>
          <tr>
            <th>序号</th>
            <th>生产状态</th>
            <th>项目进度</th>
            <th>修改时间</th>
            <th>排查计划完成时间</th>
            <th>排查完成时间</th>
          </tr>
          </thead>
          <tbody  v-for="(item, key) in list" :key="key">
            <tr>
              <td>{{item.id}}</td>
              <td>{{item.status | parseStatus}}</td>
              <td>{{item.percent}}%</td>
              <td>{{item.update_at | parseTime}}</td>
              <td>{{item.fhPlan_start_at | parseTime}}</td>
              <td>{{item.fhComplete_at | parseTime}}</td>
            </tr>
          </tbody>
        </table>
      </el-dialog>
    </div>
</template>

<script>
  import { parseTime } from '../../../../utils/index'
  import { projectFhHistoryIndex } from '../../../../api/projectFhHistory'

  export default {
    name: 'taskChild',
    props: {
      id: null
    },
    data() {
      return {
        dialogVisible: false, // 主页面展开
        ruleFormDel: {
          id: null
        },
        searchForm: {
          project_id: null,
          status: null,
          page: 1,
          pageSize: 10,
          totalCount: 0
        },
        list: {},
        loading: {
          customers: false
        },
        projectYtStatus: [
          { id: null, name: '全部' },
          { name: '前期准备', id: 0 },
          { name: '外业排查', id: 1 },
          { name: '内页报告编制', id: 2 },
          { name: '报告审核', id: 3 },
          { name: '出版', id: 4 },
          { name: '送出', id: 5 },
          { name: '已完成', id: 6 }
        ]
      }
    },
    filters: {
      parseStatus: function(value) {
        if (value === 0 || value === '0') {
          return '前期准备'
        }
        if (value === 1 || value === '1') {
          return '外业排查'
        }
        if (value === 2 || value === '2') {
          return '内业报告编制'
        }
        if (value === 3 || value === '3') {
          return '报告审核'
        }
        if (value === 4 || value === '4') {
          return '出版'
        }
        if (value === 5 || value === '5') {
          return '送出'
        }
        if (value === 6 || value === '6') {
          return '已完成'
        }
        if (value === 7 || value === '7') {
          return '已完成'
        }
        return value
      },
      parseTime: function(value) {
        if (!value) return ''
        value = value.toString()
        return parseTime(value, '{y}年{m}月{d}日')
      }
    },
    methods: {
      fetchProjectFhHistoryIndex() {
        projectFhHistoryIndex(this.searchForm).then(res => {
          console.log(res)
          this.list = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      // 查看流程信息操作记录
      onSubmitLook(id) {
        this.searchForm.project_id = id
        this.dialogVisible = true
        this.fetchProjectFhHistoryIndex()
      },
      // 一页多少行
      handleSizeChange(pageSize) {
        this.searchForm.pageSize = pageSize
        this.fetchProjectFhHistoryIndex()
      },
      // 翻页
      handlePageChange(currentPage) {
        this.searchForm.page = currentPage
        this.fetchProjectFhHistoryIndex()
      },
      onSubmitSearchForm() {
        console.log(this.searchForm)
        this.fetchProjectFhHistoryIndex()
      }
    }
  }
</script>

<style scoped>

</style>
