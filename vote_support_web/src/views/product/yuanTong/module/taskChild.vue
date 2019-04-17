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
            <th>结算金额</th>
            <th>项目进度</th>
            <!--<th>修改时间</th>-->
            <th>阶段计划完成时间</th>
            <th>阶段实际完成时间</th>
          </tr>
          </thead>
          <tbody  v-for="(item, key) in list" :key="key">
            <tr>
              <td>{{item.id}}</td>
              <td>{{item.status | parseStatus}}</td>
              <td>{{item.money_closing}}</td>
              <td>{{item.percent}}%</td>
              <!--<td>{{item.update_at | parseTime}}</td>-->
              <td>{{item.flow_at | parseTime}}</td>
              <td>{{item.yt_complete_at | parseTime}}</td>
            </tr>
          </tbody>
        </table>
      </el-dialog>
    </div>
</template>

<script>
  import { parseTime } from '../../../../utils/index'
  import { projectYtHistoryIndex } from '../../../../api/projectYtHistory'

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
          yt_type: null,
          status: null,
          page: 1,
          pageSize: 10,
          totalCount: 0
        },
        list: {},
        loading: {
          customers: false
        },
        project_type: [
          { id: null, name: '全部' },
          { name: '电力施工', id: 0 },
          { name: '电力物探', id: 1 },
          { name: '电力物联', id: 2 }
        ],
        projectYtStatus: [
          { id: null, name: '全部' },
          { name: '前期', id: 0 },
          { name: '施工准备', id: 1 },
          { name: '进场施工', id: 2 },
          { name: '中间查验', id: 3 },
          { name: '完工', id: 4 },
          { name: '竣工验收', id: 5 },
          { name: '结算', id: 6 },
          { name: '已完成', id: 6 }
        ]
      }
    },
    filters: {
      parseStatus: function(value) {
        if (value === 0 || value === '0') {
          return '前期'
        }
        if (value === 1 || value === '1') {
          return '施工准备'
        }
        if (value === 2 || value === '2') {
          return '进场施工'
        }
        if (value === 3 || value === '3') {
          return '中间查验'
        }
        if (value === 4 || value === '4') {
          return '完工竣工'
        }
        if (value === 5 || value === '5') {
          return '竣工验收'
        }
        if (value === 6 || value === '6') {
          return '结算'
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
      fetchProjectYtHistoryIndex() {
        projectYtHistoryIndex(this.searchForm).then(res => {
          this.list = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      // 查看流程信息操作记录
      onSubmitLook(id) {
        this.searchForm.project_id = id
        this.dialogVisible = true
        this.fetchProjectYtHistoryIndex()
      },
      // 一页多少行
      handleSizeChange(pageSize) {
        this.searchForm.pageSize = pageSize
        this.fetchProjectYtHistoryIndex()
      },
      // 翻页
      handlePageChange(currentPage) {
        this.searchForm.page = currentPage
        this.fetchProjectYtHistoryIndex()
      },
      onSubmitSearchForm() {
        console.log(this.searchForm)
        this.fetchProjectYtHistoryIndex()
      }
    }
  }
</script>

<style scoped>

</style>
