<template>
    <div class="" style="padding: 0;margin: 0;width: 100%;">
      <el-button type="primary"  @click="onSubmitLook(id)" size="mini">查看记录</el-button>
      <el-dialog
        title="流程记录"
        :visible.sync="dialogVisible"
        width="40%"
        :modal="false">
        <div id="app" style="width: 100%;display:inline-block">
          <el-form ref="searchForm" :model="searchForm" label-width="70px">
            <el-col :span="6">
              <el-form-item label="项目阶段" prop="flow_id">
                <el-select v-model="searchForm.flow_id" placeholder="项目阶段">
                  <el-option v-for="(val, key) in flowType" :key="key" :label="val.name" :value="val.flow_id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="生产状态" prop="status">
                <el-select v-model="searchForm.status" placeholder="生产状态">
                  <el-option v-for="(val, key) in status" :key="key" :label="val.name" :value="val.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出版状态" prop="checkStatus">
                <el-select v-model="searchForm.checkStatus" placeholder="出版状态">
                  <el-option v-for="(val, key) in CheckStatus" :key="key" :label="val.name" :value="val.id"></el-option>
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
            <th>项目阶段</th>
            <th>生产状态</th>
            <th>出版状态</th>
            <th>修改该时间</th>
            <th>完成时间</th>
          </tr>
          </thead>
          <tbody  v-for="(item, key) in list" :key="key">
          <tr>
            <td>{{item.id}}</td>
            <td>{{item.flow_id | parseDesign}}</td>
            <td>{{item.status | parseStatus}}</td>
            <td>{{item.checkStatus | parseCheckStatus}}</td>
            <td>{{item.update_at | parseTime}}</td>
            <td>{{item.complete_at | parseTime}}</td>
          </tr>
          </tbody>
        </table>
      </el-dialog>
    </div>
</template>

<script>
  import { parseTime } from '../../../../utils/index'
  import { indexChildFlowHistory } from '../../../../api/ChildflowHistory'

  export default {
    name: 'projectChild',
    props: {
      message: { // 流程信息
        type: Array
      },
      id: {
        type: Number
      }
    },
    data() {
      return {
        dialogVisible: false, // 主页面展开
        flowType: [
          {
            flow_id: 1,
            name: '项目建议书'
          },
          {
            flow_id: 2,
            name: '初设阶段'
          },
          {
            flow_id: 3,
            name: '施工图阶段'
          },
          {
            flow_id: 4,
            name: '可研阶段'
          }
        ],
        status: [
          {
            id: null,
            name: '全部'
          },
          {
            id: 0,
            name: '未开始'
          },
          {
            id: 1,
            name: '前期工作'
          },
          {
            id: 2,
            name: '勘查设计'
          },
          {
            id: 3,
            name: '内部校审'
          },
          {
            id: 4,
            name: '概预算编制'
          },
          {
            id: 5,
            name: '成果提交'
          },
          {
            id: 6,
            name: '已完成'
          }
        ],
        CheckStatus: [
          { id: null, name: '全部' },
          { id: 0, name: '送校核' },
          { id: 1, name: '返回设计' },
          { id: 2, name: '送审核' },
          { id: 3, name: '送批准' },
          { id: 4, name: '返回审核' },
          { id: 5, name: '已完成' }
        ],
        searchForm: {
          project_child_id: null,
          flow_id: null,
          status: null,
          checkStatus: null,
          page: 1,
          pageSize: 10,
          totalCount: 0
        },
        list: {}
      }
    },
    filters: {
      parseDesign: function(value) {
        if (value === 1) {
          return '项目建议书'
        }
        if (value === 2) {
          return '可研阶段'
        }
        if (value === 3) {
          return '初设阶段'
        }
        if (value === 4) {
          return '施工图阶段'
        }
        return value
      },
      parseStatus: function(value) {
        if (value === 0) {
          return '未开始'
        }
        if (value === 1) {
          return '前期工作'
        }
        if (value === 2) {
          return '勘查设计'
        }
        if (value === 3) {
          return '内部校审'
        }
        if (value === 4) {
          return '概预算编制'
        }
        if (value === 5) {
          return '成果提交'
        }
        if (value === 6) {
          return '已完成'
        }
        return value
      },
      parseCheckStatus: function(value) {
        if (value === 0) {
          return '送校核'
        }
        if (value === 1) {
          return '返回设计'
        }
        if (value === 2) {
          return '送审核'
        }
        if (value === 3) {
          return '送批准'
        }
        if (value === 4) {
          return '返回审核'
        }
        if (value === 5) {
          return '已完成'
        }
      },
      parseTime: function(value) {
        if (!value) return ''
        value = value.toString()
        return parseTime(value, '{y}年{m}月{d}日')
      }
    },
    methods: {
      fetchIndexChildFlowHistory() {
        indexChildFlowHistory(this.searchForm).then(res => {
          this.list = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
          console.log(this.list)
          console.log(res)
        })
      },
      // 一页多少行
      handleSizeChange(pageSize) {
        this.searchForm.pageSize = pageSize
        this.fetchViewsFlowType()
      },
      // 翻页
      handlePageChange(currentPage) {
        this.searchForm.page = currentPage
        this.fetchViewsFlowType()
      },
      onSubmitLook(id) {
        this.dialogVisible = true
        this.searchForm.project_child_id = id
        console.log(this.searchForm.project_child_id)
        this.fetchIndexChildFlowHistory()
      },
      onSubmitSearchForm() {
        this.fetchIndexChildFlowHistory()
      }
    }
  }
</script>

<style scoped>

</style>
