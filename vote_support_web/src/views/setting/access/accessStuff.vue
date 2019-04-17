<template>
    <div class="app-container">
      <el-form :inline="true" ref="searchForm" :model="searchForm" label-width="100px">
        <el-form-item label="员工姓名" prop="user_name" label-width="70px">
          <el-input style="width: 300px" v-model="searchForm.user_name" placeholder="输入关键词搜索"></el-input>
        </el-form-item>
        <el-form-item label="权限组名称" prop="access_group_id" label-width="100px">
          <el-select v-model="searchForm.access_group_id" placeholder="请选择分组名称">
            <el-option
              v-for="item in groups"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status" label-width="60px">
          <el-select v-model="searchForm.status" placeholder="搜索在职或离职">
            <el-option
              v-for="item in status"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分公司" prop="branch_id" label-width="60px">
          <el-select v-model="searchForm.branch_id" placeholder="请选择分组名称">
            <el-option
              v-for="item in branches"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button @click="fetchAccessStuffs(searchForm)" icon="el-icon-search" type="primary">点击查询</el-button>
        <el-button @click="onClear()" icon="el-icon-search" type="primary">清空查询</el-button>
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
      <!--// 员工权限表格-->
      <div>
        <el-table border :data="stuffs" id="stuffs" :row-style="rowStyle" :cell-style="cellStyle" stripe fit>
          <el-table-column align="center" prop="id" label="ID" width="100"></el-table-column>
          <el-table-column align="center" prop="user_name" label="员工姓名" width="200"></el-table-column>
          <el-table-column align="center" prop="branch_name" label="分公司" width="200"></el-table-column>
          <el-table-column align="center" prop="access_group_name" label="所在权限组" width="200"></el-table-column>
          <el-table-column align="center" label="状态" width="200">
            <template slot-scope="props">
            {{props.row.user.status === 2?'已离职':'在职'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click="onUpdate(scope.row)" type="warning" class="btnUpdate" icon="el-icon-edit">修改</el-button>
              <!--<el-button @click="onDeleteUser(scope.row.id)" type="danger" class="btnDelete" icon="el-icon-delete"> 删除</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--修改表单-->
      <el-dialog title="修改员工权限组" :visible.sync="ruleFormVisible">
        <el-form :model="ruleForm" ref="ruleForm" label-width="180px" size="mini">
          <el-form-item label="选择权限组">
            <el-select v-model="ruleForm.access_group_id" placeholder="请选择分组名称">
              <el-option
                v-for="item in groups"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
          <el-button @click="ruleFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_accessStuffs   beforeMount()
    修改分组: update_accessStuffGroup    onUpdate()
-->
<script>
  import { getAccessStuff, getAccessGroup, updateStuffGroup } from '../../../api/access'

  export default {
    name: 'accessStuff',
    data() {
      return {
        // 所有权限组
        groups: [],
        // 员工权限表格数据源 对象
        stuffs: [],
        // 存储查询表单 对象
        searchForm: {
          user_name: null,
          access_group_id: null,
          branch_id: null,
          status: null
        },
        status: [
          { id: null, name: '全部' },
          { id: 1, name: '在职' },
          { id: 2, name: '离职' }
        ],
        // 总页数
        pageInfo: {
          currentPage: 1,
          pageSize: 20,
          totalCount: 0
        },
        // 修改权限组窗口可视
        ruleFormVisible: false,
        // 修改权限组表单\
        ruleForm: {
          id: null,
          access_group_id: null
        }
      }
    },
    methods: {
      /** 清空查询 */
      onClear() {
        this.searchForm.user_name = null
        this.searchForm.access_group_id = null
        this.searchForm.branch_id = null
      },
      /** 修改员工权限分组 */
      onUpdate(row) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_accessStuffGroup#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.ruleForm.access_group_id = row.access_group_id
        this.ruleForm.id = row.id
        this.ruleFormVisible = true
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            updateStuffGroup(this.ruleForm).then(res => {
              if (res.data.bCode === 101) {
                this.$notify({
                  title: '修改员工权限成功,限制效果将在员工下次登录时生效',
                  type: 'success',
                  position: 'top-right'
                })
                this.fetchAccessStuffs()
                this.resetForm(formName)
              } else {
                for (const key in res.data.bData) {
                  this.$notify({
                    title: '警告',
                    message: res.data.bData[key],
                    type: 'warning',
                    position: 'top-right'
                  })
                }
              }
              this.ruleFormVisible = false
            })
          } else {
            console.log('提交错误!!')
            return false
          }
        })
      },
      /** 接口获取数据类 */
      fetchAccessStuffs(params) {
        getAccessStuff(params).then(res => {
          this.stuffs = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.pageInfo.currentPage = res.data._meta.currentPage
        })
      },
      /** 分页器方法 */
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize
        this.fetchAccessStuffs(this.finalSearchForm)
      },
      handleCurrentChange(currentPage) {
        this.pageInfo.currentPage = currentPage
        this.fetchAccessStuffs(this.finalSearchForm)
      },
      /** 表格样式设置方法 */
      rowStyle() {
        return 'height: 25px'
      },
      cellStyle() {
        return 'padding: 2px'
      },
      /** 接口类 获取权限组*/
      fetchAccessGroups(params) {
        getAccessGroup(params).then(res => {
          this.groups = res.data._items
        })
      },
      // 重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    },
    mounted() {
      this.fetchAccessGroups()
      this.fetchAccessStuffs()
    },
    computed: {
      finalSearchForm() {
        const res = Object.assign({}, this.searchForm)
        // res.expand = 'cost_user_name,input_user_name,type_name,sbj_name,branch_name'
        res.pageSize = this.pageInfo.pageSize
        res.page = this.pageInfo.currentPage
        return res
      },
      branches() {
        return this.$store.state.user.branches
      }
    },
    // 页面权限检查 如无权限则跳转至404
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_accessStuffs#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
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
