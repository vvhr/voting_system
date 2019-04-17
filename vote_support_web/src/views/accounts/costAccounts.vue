<template>
   <div>
     <div>
       <!-- 表格头部组件 -->
       <el-form :inline="true" ref="searchForm" :model="searchForm" label-width="100px">
         <!--生成核算报表-->
         <el-form-item>
           <el-button @click="onclick()" type="danger" icon="el-icon-edit" class="btn">更新成本核算</el-button><br />
         </el-form-item>
         <!--报表最近更新时间-->
         <el-tag class="btn">报表最近更新日期：<a style="color: #DD4A68">{{noteDate}}</a><br /></el-tag>
         <!--查询功能-->
         <el-form-item class="btn" label="项目名称" prop="pro_id" label-width="70px">
           <el-select
             v-model="searchForm.pro_name"
             filterable
             remote
             reserve-keyword
             placeholder="关键词搜索，空格表示全部"
             :remote-method="remoteMethod"
             style="width: 100%">
             <el-option
               v-for="pro in pros"
               :key="pro.id"
               :label="pro.name"
               :value="pro.name">
             </el-option>
           </el-select>
         </el-form-item>
         <el-button @click="onclickClean()" type="primary" icon="el-icon-circle-close-outline" circle class="cleanBtn"></el-button>
         <el-form-item class="btn" label="分公司" prop="branch_id">
           <el-select v-model="searchForm.branch_name" placeholder="请选择">
             <el-option
               v-for="b in branch"
               :key="b.id"
               :label="b.name"
               :value="b.name">
             </el-option>
           </el-select>
         </el-form-item>
         <el-button class="btn" @click="fetchAccounts(searchForm)" icon="el-icon-search" type="primary">点击查询</el-button>
       </el-form>
       <!--分页器-->
       <div class="block" align="center">
         <el-pagination
           @size-change="handleSizeChange"
           @current-change="handleCurrentChange"
           :current-page="pageInfo.currentPage"
           :page-sizes="[10, 20, 50, 100]"
           :page-size="pageInfo.pageSize"
           layout="total, sizes, prev, pager, next, jumper"
           :total="pageInfo.totalCount">
         </el-pagination>
       </div>
     </div>
     <!--table表格部分-->
     <div>
       <el-table
         v-loading="onLoading.father"
         border
         :data="accounts"
         id="cost"
         :row-style="rowStyle"
         :cell-style="cellStyle"
         stripe
         @sort-change="handleSortChange">
         <el-table-column align="center" prop="pro_id" label="项目ID" width="100"></el-table-column>
         <el-table-column align="center" prop="branch_name" label="承建分公司" width="100"></el-table-column>
         <el-table-column align="center" prop="pro_name" label="项目名称" width="500"></el-table-column>
         <el-table-column align="center" prop="all" label="合计" width="160" sortable="custom"></el-table-column>
         <!--<el-table-column align="center" prop="stuffs" label="员工工资" width="120"></el-table-column>-->
         <el-table-column align="center" prop="basics" label="基础报销" width="120"></el-table-column>
         <el-table-column
           align="center"
           label="查看明细"
           width="80">
           <template slot-scope="scope">
             <el-popover trigger="click" placement="top">
               <p>总金额: {{ scope.row.basics }}</p>
               <el-table v-loading="onLoading.basic" :data="basicCosts" stripe style="width: 100%">
                 <el-table-column prop="id" label="ID" ></el-table-column>
                 <el-table-column prop="date" label="日期" width="120" :formatter="dateFormat"></el-table-column>
                 <el-table-column prop="cost_user_name" label="报销人"></el-table-column>
                 <el-table-column prop="money" label="报销金额" width="120"></el-table-column>
                 <el-table-column prop="valid" label="有效性"></el-table-column>
               </el-table>
               <div slot="reference" class="name-wrapper">
                 <el-button size="mini" type="primary" icon="el-icon-search" @click="onBasicCosts(scope.row.pro_name)" ></el-button>
               </div>
             </el-popover>
           </template>
         </el-table-column>
         <el-table-column align="center" prop="goods" label="物资采购" width="120"></el-table-column>
         <el-table-column
           align="center"
           label="查看明细"
           width="80">
           <template slot-scope="scope">
             <el-popover trigger="click" placement="top">
               <p>总金额: {{ scope.row.goods }}</p>
               <el-table v-loading="onLoading.goods" :data="goodsCosts" stripe style="width: 100%">
                 <el-table-column prop="id" label="ID" ></el-table-column>
                 <el-table-column prop="date" label="日期" width="120" :formatter="dateFormat"></el-table-column>
                 <el-table-column prop="cost_user_name" label="报销人"></el-table-column>
                 <el-table-column prop="money" label="报销金额" width="120"></el-table-column>
                 <el-table-column prop="valid" label="有效性"></el-table-column>
               </el-table>
               <div slot="reference" class="name-wrapper">
                 <el-button size="mini" type="primary" icon="el-icon-search" @click="onGoodsCosts(scope.row.pro_name)" class="findBtn"></el-button>
               </div>
             </el-popover>
           </template>
         </el-table-column>
         <el-table-column align="center" prop="workers" label="工人支出" width="120"></el-table-column>
         <el-table-column
           align="center"
           label="查看明细"
           width="80">
           <template slot-scope="scope">
             <el-popover trigger="click" placement="top">
               <p>总金额: {{ scope.row.workers }}</p>
               <el-table v-loading="onLoading.laowu" :data="workers" stripe style="width: 100%">
                 <el-table-column prop="id" label="ID" ></el-table-column>
                 <el-table-column prop="create_at" label="日期" width="120" :formatter="dateFormat"></el-table-column>
                 <el-table-column prop="fen_team" label="分包团队"></el-table-column>
                 <el-table-column prop="repay_cost" label="支付金额" width="120"></el-table-column>
               </el-table>
               <div slot="reference" class="name-wrapper">
                 <el-button size="mini" type="primary" icon="el-icon-search" @click="onWorkers(scope.row.pro_id)" class="findBtn"></el-button>
               </div>
             </el-popover>
           </template>
         </el-table-column>
         <!--<el-table-column align="center" prop="basic_general" label="基础报销(综合)" width="120"></el-table-column>-->
         <!--<el-table-column align="center" prop="goods_general" label="物资采购(综合)" width="120"></el-table-column>-->
         <!--<el-table-column align="center" prop="qualification" label="资质管养" width="120"></el-table-column>-->
         <!--<el-table-column align="center" prop="market" label="市场费用" width="120"></el-table-column>-->
       </el-table>
     </div>
   </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_costAccounts   beforeMount()
    更新核算: update_costAccounts onclick()
-->
<script>
  import { getProjects } from '../../api/project'
  import { getAccountsNote, updateAccountsNote, getAccountsBasic, createAccountsBasic } from '../../api/accounts'
  import { parseTime } from '../../utils'
  import { getBasic } from '../../api/costBasic'
  import { getGoods } from '../../api/costGoods'
  import { getLwDetails } from '../../api/lwDetail'
  import { getBranches } from '../../api/branch'

  export default {
    name: 'costAccounts',
    data() {
      return {
        pros: [],
        noteDate: null,
        accounts: [],
        branch: [
          { id: null, name: '全部' }
        ],
        updateForm: {
          table_name: 'accounts_basic',
          date: null
        },
        searchForm: {
          pro_name: null,
          branch_name: null,
          sort: null,
          sort_name: null
        },
        // 总页数
        pageInfo: {
          currentPage: 1,
          pageSize: 20,
          totalCount: 0
        },
        // 基础报销 物资报销 初始化
        basicCosts: [],
        goodsCosts: [],
        workers: [],
        // 加载动画
        onLoading: {
          father: false,
          basic: false,
          goods: false,
          laowu: false
        }
      }
    },
    methods: {
      onclickClean() {
        this.searchForm.pro_name = null
      },
      /** 远程搜索项目列表方法 */
      remoteMethod(query) {
        let params = {}
        params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getProjects(params).then(res => {
          this.pros = res.data._items
        })
      },
      // 查看工人结算 点击事件
      onWorkers(params) {
        this.onLoading.laowu = true
        getLwDetails({ 'project_id': params }).then(res => {
          this.workers = res.data._items
          this.onLoading.laowu = false
        })
      },
      // 查看物资报销 点击事件
      onGoodsCosts(name) {
        this.onLoading.goods = true
        getGoods({ 'pro_name': name }).then(res => {
          this.goodsCosts = res.data._items
          this.onLoading.goods = false
        })
      },
      // 查看基础报销 点击事件
      onBasicCosts(name) {
        this.onLoading.basic = true
        getBasic({ 'pro_name': name }).then(res => {
          this.basicCosts = res.data._items
          this.onLoading.basic = false
        })
      },
      fetchProjects(params) {
        this.onLoading.father = true
        getProjects(params).then(res => {
          this.pros = res.data._items
          this.pros.accounts_stuffs = 0
          this.onLoading.father = false
        })
      },
      onclick() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_costAccounts#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        // 更新
        this.onLoading.father = true
        createAccountsBasic().then(res => {
          if (res.data.bCode === 101) {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              position: 'top-right'
            })
            this.updateForm.date = parseTime(new Date())
            updateAccountsNote(this.updateForm)
            this.fetchAccounts()
            this.fetchNote()
            this.onLoading.father = false
          } else {
            this.$notify({
              title: '警告',
              message: '更新失败',
              type: 'warning',
              position: 'top-right'
            })
            this.onLoading.father = false
          }
        })
      },
      // 获取刷新时间
      fetchNote(params) {
        getAccountsNote({ table_name: 'accounts_basic' }).then(res => {
          this.noteDate = res.data[0].date
        })
      },
      fetchAccounts(params) {
        this.onLoading.father = true
        if (this.searchForm.branch_name === '全部') {
          this.searchForm.branch_name = null
        }
        getAccountsBasic(params).then(res => {
          this.accounts = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.pageInfo.currentPage = res.data._meta.currentPage
          this.onLoading.father = false
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
      /** 分页器方法 */
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize
        this.fetchAccounts(this.finalSearchForm)
      },
      handleCurrentChange(currentPage) {
        this.pageInfo.currentPage = currentPage
        this.fetchAccounts(this.finalSearchForm)
      },
      /** 排序 */
      handleSortChange({ column, prop, order }) {
        this.searchForm.sort_name = prop
        if (order === 'ascending') {
          this.searchForm.sort = 4
        } else if (order === 'descending') {
          this.searchForm.sort = 3
        }
        this.fetchAccounts(this.finalSearchForm)
      },
      // 时间格式化
      dateFormat(row, column) {
        const date = row[column.property]
        return parseTime(date, '{y}-{m}-{d}')
      },
      /** -------- 表格样式设置方法 -------- */
      rowStyle() {
        return 'height: 25px'
      },
      cellStyle() {
        return 'padding: 2px'
      }
    },
    mounted() {
      this.fetchAccounts()
      this.fetchNote()
      this.fetchBranches()
    },
    filters: {
      parseTime(value) {
        if (!value) return ''
        value = value.toString()
        return parseTime(value, '{y}-{m}-{d}')
      }
    },
    computed: {
      branches() {
        return this.$store.state.user.branches
      },
      finalSearchForm() {
        const res = Object.assign({}, this.searchForm)
        res.pageSize = this.pageInfo.pageSize
        res.page = this.pageInfo.currentPage
        return res
      }
    },
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_costAccounts#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style scoped>
  .btn{
    margin-left: 20px;
    margin-top: 20px;
  }
  .findBtn{
    /*padding-top: 10px;*/
    /*padding-right: 10px;*/
    /*padding-bottom: 10px;*/
    /*padding-left: 10px;*/
  }
  .cleanBtn{
    padding: 0px;
    width: 15px;
    border-top-width: 0px;
    border-bottom-width: 0px;
    border-right-width: 5px;
    border-left-width: 0px;
  }
</style>
