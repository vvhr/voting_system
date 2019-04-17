<template>
  <div class="app-container">
    <div class="apply_header" style="background: #d3e8f1;padding-top: 5px;border-radius: 10px">
      <el-form size="mini" label-width="100px">
        <el-form-item label="搜索栏">
          <el-form ref="searchForm" :model="searchForm" label-width="100px" class="demo-form-inline" :inline="true" size="mini">
              <el-form-item >
                <el-input v-model="searchForm.name" placeholder="项目名称"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="searchForm.customer_id"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="客户名称关键词搜索，空格表示全部"
                  :remote-method="remoteMethod"
                  :loading="loading.customers">
                  <el-option
                    v-for="item in customers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item  prop="origin_type" label-width="70px">
                <el-select v-model="searchForm.origin_type" placeholder="合同类型">
                  <el-option v-for="(val, key) in contract" :key="key" :label="val.origin_type" :value="val.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item  prop="branch_id" label-width="70px">
                <el-select v-model="searchForm.branch_id" placeholder="承建公司">
                  <el-option v-for="(val, key) in branch" :key="key" :label="val.name" :value="val.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="flow_status" label-width="70px">
                <el-date-picker
                  v-model="searchForm.time"
                  type="daterange"
                  value-format = "timestamp"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions2">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
              <el-button @click="onSubmitSearchForm()" icon="el-icon-search"></el-button>
              </el-form-item>
          </el-form>
        </el-form-item>
      </el-form>
    </div>
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
      <el-table-column prop="name" label="项目名称"  align="center"></el-table-column>
      <el-table-column label="项目来源" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.origin_type | parseOriginType}}</span>
        </template>
      </el-table-column>
      <el-table-column label="承建分公司" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.branch_id | parseBranch}}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="leading_user_name" label="生产分公司" align="center" width="100" ></el-table-column>
      <el-table-column label="项目类型" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.project_type_id | parseProjectType}}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="customer_name" label="客户名称" align="center" width="100" ></el-table-column>
      <el-table-column label="合同类型" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.contract_type | parseContractType}}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="money_total" label="合同金额" align="center" width="100" ></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="90">
        <template slot-scope="scope">
          <el-button @click="onClickDeleteBtn(scope.row.id)" type="primary" size="mini" icon="el-icon-edit">启用</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_projectRecover   beforeMount()
    回收项目: update_projectRecover onClickDeleteBtn()
-->
<script>
  import { parseContractType, parseOriginType, updateProject, getProjectsRecover } from '../../api/project'
  import { parseTime } from '../../utils'
  import Store from '../../store'
  import { getCustomers } from '../../api/customer'
  import { getBranches } from '../../api/branch'

  export default {
    name: 'projectRecover',
    data() {
      return {
        /**
         * 项目列表相关变量
         */
        searchForm: {
          name: null,
          start_at: null,
          end_at: null,
          origin_type: null, // 合同类型
          branch_id: null,
          page: 1,
          pageSize: 10,
          totalCount: 0,
          time: []
        },
        contract: [
          { origin_type: '合同状态', id: null },
          { origin_type: '合同签订', id: 1 },
          { origin_type: '委托书', id: 2 },
          { origin_type: '中标通知书', id: 3 },
          { origin_type: '口头订单', id: 4 }
        ],
        branch: [
          { id: null, name: '承建公司' }
        ], // 承建单位
        delForm: {
          id: null,
          valid: 1
        },
        loading: {
          customers: false,
          users: false
        },
        customers: [],
        list: [],
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    filters: {
      parseTime: function(value) {
        if (value === null) {
          return '_________'
        }
        return parseTime(value, '{y}-{m}-{d}')
      },
      parseContractType,
      parseOriginType,
      parseBranch: function(value) {
        const list = Store.state.user.branches
        for (const index in list) {
          if (parseInt(list[index].id) === value) {
            return list[index].name
          }
        }
        return value
      },
      parseProjectType: function(value) {
        if (value === 1) {
          return '配电'
        }
        if (value === 2) {
          return '迁改'
        }
        if (value === 3) {
          return '配网'
        }
        if (value === 4) {
          return '用电安全'
        }
        return value
      }
    },
    mounted() {
      this.fetchProjectsRecover()
      this.fetchBranches()
    },
    methods: {
      fetchProjectsRecover() {
        getProjectsRecover(this.searchForm).then(res => {
          this.list = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      // 获取承建公司列表
      fetchBranches() {
        getBranches().then(res => {
          for (const x in res.data) {
            this.branch.push(res.data[x])
          }
        })
      },
      // 一页多少行
      handleSizeChange(pageSize) {
        this.searchForm.pageSize = pageSize
        this.fetchProjectsRecover()
      },
      // 翻页
      handlePageChange(currentPage) {
        this.searchForm.page = currentPage
        this.fetchProjectsRecover()
      },
      // 警用功能
      onClickDeleteBtn(id) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_projectRecover#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        console.log(this.actionCheck_.actionCheck('update_projectRecover#'))
        this.delForm.id = id
        // 调用更新接口并响应
        updateProject(this.delForm).then(res => {
          this.fetchProjectsRecover()
          if (res.data.bCode === 101) {
            this.$message({
              message: '恭喜你修改成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '很抱歉修改,修改失败',
              type: 'warning'
            })
          }
        })
      },
      onSubmitSearchForm() {
        if (this.searchForm.time !== null && this.searchForm.time.length > 0) {
          this.searchForm.start_at = this.searchForm.time[0]
          this.searchForm.end_at = this.searchForm.time[1]
        } else {
          this.searchForm.start_at = null
          this.searchForm.end_at = null
        }
        this.fetchProjectsRecover()
      },
      /** 远程搜索客户列表方法 */
      remoteMethod(query) {
        this.loading.customers = true
        let params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getCustomers(params).then(res => {
          this.customers = res.data._items
          this.loading.customers = false
        })
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
      if (this.actionCheck_.actionCheck('read_projectRecover#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>
