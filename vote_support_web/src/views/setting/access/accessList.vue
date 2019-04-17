<template>
  <div class="app-container">
    <!--分页器-->
    <div class="block" align="center">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.currentPage"
        :page-sizes="[20, 50, 100]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.totalCount">
      </el-pagination>
    </div>
    <!--// 员工权限表格-->
    <div>
      <el-table border :data="lists" id="lists" :row-style="rowStyle" :cell-style="cellStyle" stripe fit>
        <el-table-column align="center" prop="id" label="ID" width="200"></el-table-column>
        <el-table-column prop="name" label="权限名" ></el-table-column>
        <el-table-column prop="describe" label="描述" width="400"></el-table-column>
        <el-table-column align="center" prop="access" label="我的权限" :formatter="analysisAccess"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { getAccessList, getMyAccess } from '../../../api/access'

  export default {
    name: 'accessList',
    data() {
      return {
        // 权限详情表格数据源 对象
        lists: [],
        // 我的权限
        myAccess: [],
        // 存储查询表单 对象
        searchForm: {},
        // 总页数
        pageInfo: {
          currentPage: 1,
          pageSize: 100,
          totalCount: 0
        }
      }
    },
    methods: {
      /** 解析权限 */
      analysisAccess(row, column) {
        if (this.isEmpty(this.myAccess.access) === false) {
          const str = (this.myAccess.access).toString()
          const reg = row.name + '#'
          if (str.indexOf(reg) > -1) {
            return '已拥有'
          } else return '无'
        } else return '无'
      },
      // 判断字符是否为空的方法
      isEmpty(obj) {
        if (typeof obj === 'undefined' || obj == null || obj === '') {
          return true
        } else {
          return false
        }
      },
      /** 接口获取数据类 */
      fetchAccessLists(params) {
        getAccessList(params).then(res => {
          this.lists = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.pageInfo.currentPage = res.data._meta.currentPage
        })
      },
      fetchMyAccess() {
        getMyAccess().then(res => {
          this.myAccess = res.data
        })
      },
      /** 分页器方法 */
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize
        this.fetchAccessLists(this.finalSearchForm)
      },
      handleCurrentChange(currentPage) {
        this.pageInfo.currentPage = currentPage
        this.fetchAccessLists(this.finalSearchForm)
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
      this.fetchMyAccess()
      this.fetchAccessLists()
    },
    computed: {
      finalSearchForm() {
        const res = Object.assign({}, this.searchForm)
        res.pageSize = this.pageInfo.pageSize
        res.page = this.pageInfo.currentPage
        return res
      }
    }
  }
</script>

<style scoped>
  .btnUpdate{
    margin-right: 10px;
    padding-bottom: 6px;
    padding-top: 6px;
    padding-right: 10px;
    padding-left: 10px
  }

</style>
