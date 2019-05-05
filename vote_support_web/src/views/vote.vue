<template>
    <div class="app-container">
      <!--头部搜索及操作框-->
      <div class="row-01">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="搜索主题">
            <el-input style="width: 300px" v-model="searchForm.theme_name" placeholder="请输入投票主题的名称关键词..."></el-input>
          </el-form-item>
          <el-form-item label="主题状态">
            <el-select v-model="searchForm.state" placeholder="全部">
              <el-option label="待开启" value="0"></el-option>
              <el-option label="已完成" value="2"></el-option>
              <el-option label="进行中" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitSearch">查询</el-button>
            <el-button type="primary" @click="onResetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="row-02">
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
      </div>
      <div class="row-03">
        <el-table :data="list" style="width: 100%">
          <el-table-column prop="id" label="id" width="60"></el-table-column>
          <el-table-column label="状态" width="100">
            <template slot-scope="scope">
              <el-tag :type="optionsTagType(scope.row.state)">{{ scope.row.state | stateFilter}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="类型" width="100">
            <template slot-scope="scope">
              <el-tag :type="optionsTagType2(scope.row.options_type)">{{ scope.row.options_type | optionsTypeFilter}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="主题名称" width="400" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="onClickShowThemeDetail(scope.row.id)">{{scope.row.theme_name}}</el-button><br/>
              <span>{{scope.row.theme_content}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="user.name" label="创建人" width="120"></el-table-column>
          <el-table-column prop="create_time" label="创建时间" width="200"></el-table-column>
          <el-table-column prop="end_time" label="截止时间" width="200"></el-table-column>
          <el-table-column label="投票数" width="200">
            <template slot-scope="scope">
              {{scope.row.voted_total}} / {{scope.row.votes_max}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="onClickShowThemeDetail(scope.row.id)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
</template>

<script>
    import { getThemes } from '../api/theme'
    const defaultSearchForm = {
      theme_name: null,
      state: null,
      currentPage: 1,
      pageSize: 10,
      totalCount: 0
    }
    export default {
      name: 'vote',
      data() {
        return {
          // 表格源数据书
          list: [],
          // 搜索表单对象
          searchForm: Object.assign({}, defaultSearchForm)
        }
      },
      filters: {
        // 主题状态过滤器
        stateFilter(value) {
          if (value === 0) return '待开启'
          else if (value === 1) return '投票中'
          else if (value === 2) return '已完成'
          else if (value === 3) return '已取消'
          else return '错误'
        },
        optionsTypeFilter(value) {
          if (value === 0) return '单选'
          else if (value === 1) return '可多选'
          else return '错误'
        }
      },
      methods: {
        fetchList() {
          getThemes(this.searchForm).then(res => {
            this.list = res.data._items
            this.searchForm.totalCount = res.data._meta.totalCount
          })
        },
        /** 主题名称 被点击事件 */
        onClickShowThemeDetail(id) {
          this.$router.push({
            path: '/one',
            query: { theme_id: id }
          })
        },
        // 一页多少行
        handleSizeChange(pageSize) {
          this.searchForm.pageSize = pageSize
          this.fetchList()
        },
        // 翻页
        handlePageChange(currentPage) {
          this.searchForm.page = currentPage
          this.fetchList()
        },
        /** 提交查询 */
        onSubmitSearch() {
          getThemes(this.searchForm).then(res => {
            this.list = res.data._items
          })
        },
        /** 重置查询 */
        onResetSearch() {
          // 重置对象
          this.searchForm = Object.assign({}, defaultSearchForm)
          // 刷新表格
          this.fetchList()
        },
        /** 样式过滤器 - 投票状态 - tag样式 */
        optionsTagType(value) {
          if (value === 0) return 'primary'
          else if (value === 1) return 'success'
          else if (value === 2) return 'danger'
          else if (value === 3) return 'info'
          else return 'warning'
        },
        /** 样式过滤器 - 投票类型 - tag样式 */
        optionsTagType2(value) {
          if (value === 0) return 'primary'
          else if (value === 1) return 'success'
          else return '错误'
        }
      },
      mounted() {
        this.fetchList()
      }
    }
</script>

<style scoped>

</style>
