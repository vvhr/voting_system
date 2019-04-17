<template>
  <div class="app-container">
    <!--// 创建分组对话框-->
    <el-dialog title="创建报销分组" :visible.sync="addGroupVisible">
      <el-form :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="报销分组名称" label-width="120px" prop="name">
          <el-input style="width: 500px" v-model="addForm.name" placeholder="请设置报销分组的名称（例如：华建电力2018年12月综合报销）"></el-input>
        </el-form-item>
        <el-form-item label="报销分组编号" label-width="120px" prop="number">
          <el-input style="width: 300px" v-model="addForm.number" placeholder="请设置报销分组的编号（例如：HJ-1812）"></el-input>
        </el-form-item>
        <el-form-item label="分公司" prop="branch_id" label-width="120px">
          <el-select v-model="addForm.branch_id" placeholder="请选择分公司">
            <el-option
              v-for="item in branches"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="submitForm('addForm')">确定创建</el-button>
        <el-button @click="addGroupVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--// 修改分组对话框-->
    <el-dialog title="修改报销分组信息" :visible.sync="updateGroupVisible">
      <el-form :model="updateForm" :rules="rules" ref="updateForm">
        <el-form-item label="报销分组名称" label-width="120px" prop="name">
          <el-input style="width: 500px" v-model="updateForm.name" placeholder="请设置报销分组的名称（例如：华建电力2018年12月综合报销）"></el-input>
        </el-form-item>
        <el-form-item label="报销分组编号" label-width="120px" prop="number">
          <el-input style="width: 300px" v-model="updateForm.number" placeholder="请设置报销分组的编号（例如：HJ-1812）"></el-input>
        </el-form-item>
        <el-form-item label="分公司" prop="branch_id" label-width="120px">
          <el-select v-model="updateForm.branch_name" placeholder="请选择分公司">
            <el-option
              v-for="item in branches"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="submitUpdateForm('updateForm')">确定修改</el-button>
        <el-button @click="updateGroupVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <div>
      <!-- 表格头部组件开始 -->
      <el-form :inline="true" ref="searchForm" :model="searchForm" label-width="100px">
        <div>
          <!--添加新项-->
          <el-form-item>
            <el-button @click="onAddGroup()" type="danger" icon="el-icon-edit">创建报销分组</el-button>
          </el-form-item>
          <!--查询功能-->
          <el-form-item label="分组名称" prop="group_name" label-width="70px">
            <el-input style="width: 300px" v-model="searchForm.group_name" placeholder="输入关键词即可"></el-input>
          </el-form-item>
          <el-button @click="fetchGroups(searchForm)" icon="el-icon-search" type="primary">点击查询</el-button>
        </div>
        <el-form-item label="快捷分类查询">
          <el-button type="text" @click="onQuickQuery('')">全部</el-button>
          <el-button type="text" @click="onQuickQuery('集团')">集团</el-button>
          <el-button type="text" @click="onQuickQuery('综合管理部')">综合管理部</el-button>
          <el-button type="text" @click="onQuickQuery('财务部')">财务部</el-button>
          <el-button type="text" @click="onQuickQuery('经营部')">经营部</el-button>
          <el-button type="text" @click="onQuickQuery('项目部')">项目部</el-button>
          <el-button type="text" @click="onQuickQuery('华建电力')">华建电力</el-button>
          <el-button type="text" @click="onQuickQuery('云南')">云南</el-button>
          <el-button type="text" @click="onQuickQuery('物联')">物联</el-button>
          <el-button type="text" @click="onQuickQuery('源通')">源通</el-button>
          <el-button type="text" @click="onQuickQuery('富华')">富华</el-button><br />
          <el-button type="text" @click="onQuickQuery('18年07月')">2018年07月</el-button>
          <el-button type="text" @click="onQuickQuery('18年08月')">2018年08月</el-button>
          <el-button type="text" @click="onQuickQuery('18年09月')">2018年09月</el-button>
          <el-button type="text" @click="onQuickQuery('18年10月')">2018年10月</el-button>
          <el-button type="text" @click="onQuickQuery('18年11月')">2018年11月</el-button>
          <el-button type="text" @click="onQuickQuery('18年12月')">2018年12月</el-button><br />
          <el-button type="text" @click="onQuickQuery('19年01月')">2019年01月</el-button>
          <el-button type="text" @click="onQuickQuery('19年02月')">2019年02月</el-button>
          <el-button type="text" @click="onQuickQuery('19年03月')">2019年03月</el-button>
          <el-button type="text" @click="onQuickQuery('19年04月')">2019年04月</el-button>
        </el-form-item>

        <div>
        </div>
      </el-form>
    </div>
    <!-- 表格头部组件结束 -->
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
    <!--报销项目报表开始-->
    <div>
      <el-table :data="groups" id="cost" stripe fit :row-style="rowStyle" :cell-style="cellStyle">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table border :data="scope.row.costs" max-height="650" id="group_costs" stripe fit :row-style="rowStyleSon" :cell-style="cellStyle">
              <el-table-column align="center" prop="id" label="ID" width="120"></el-table-column>
              <el-table-column align="center" prop="date" label="日期"  :formatter="dateFormat" width="150"></el-table-column>
              <el-table-column align="center" prop="cost_branch_name" label="报销分公司" width="120"></el-table-column>
              <el-table-column align="center" prop="cost_user_name" label="报销人" width="120"></el-table-column>
              <el-table-column align="center" prop="money" label="金额" width="130"></el-table-column>
              <el-table-column align="center" prop="use" label="用途"></el-table-column>
              <el-table-column align="center" label="有效性" width="80">
                <template slot-scope="scope">
                  {{scope.row.valid === 1?'正常':'已删除'}}
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="id" label="ID" width="120"></el-table-column>
        <el-table-column align="center" prop="name" label="分组名称" width="400" ></el-table-column>
        <el-table-column align="center" prop="number" label="分组编号" width="180"></el-table-column>
        <el-table-column align="center" prop="branch_name" label="分公司" width="200"></el-table-column>
	    	<el-table-column align="center" prop="all" label="报销总金额" width="200"></el-table-column>
        <el-table-column align="center" label="操作" width="550">
          <template slot-scope="scope">
            <el-button @click="onUpdateGroup(scope.row.id)" type="warning" class="btnUpdate" icon="el-icon-edit"> 修改分组</el-button>
            <!--<el-button @click="onAddCost(scope.row.id)" type="danger" class="btnDelete" icon="el-icon-delete"> 添加报销</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_groupCost   beforeMount()
    创建分组: create_group onAddGroup()
    修改分组: update_group onUpdateGroup()
-->
<script>
  import { getGroups, getGeneral, createGroup, updateGroup } from '../../../api/costGeneral'
  import { getUsers } from '../../../api/user'
  import { parseTime } from '../../../utils/index'

  export default {
    name: 'generalCost',
    data() {
      return {
        // 初始化报销项目和报销记录数组对象
        costs: [],
        groups: [],
        // 总页数
        pageInfo: {
          currentPage: 1,
          pageSize: 20,
          totalCount: 0
        },
        // 初始化搜索表单数组
        searchForm: {
          cost_user_id: null,
          group_name: null
        },
        // 初始化添加分组的表单
        addForm: {
          name: '',
          number: '',
          branch_id: null
        },
        // 初始化修改分组的表单
        updateForm: {
          name: '',
          number: '',
          branch_id: null,
          branch_name: null
        },
        // 初始化报销人数组
        costUsers: [],
        // 被选择的列表项id值
        activeID: null,
        // Excel导入 窗口 可视
        excelFormVisible: false,
        // 创建 分组 可视
        addGroupVisible: false,
        // 修改 分组 可视
        updateGroupVisible: false,
        // 定义输入规则
        rules: {
          name: [
            { required: true, message: '分组名称不得为空', trigger: 'blur' }
          ],
          number: [
            { required: true, message: '分组编号不得为空', trigger: 'blur' }
          ],
          branch_id: [
            { required: true, message: '分公司不得为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      /** ----------- 点击事件类 ----------- */
      /** 分类查询按钮 被点击事件 */
      onQuickQuery(name) {
        this.searchForm.group_name = name
        this.fetchGroups(this.searchForm)
      },
      /** 创建分组按钮 被点击事件 */
      onAddGroup() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('create_group#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.addGroupVisible = true
      },
      /** 修改分组按钮 被点击事件 */
      onUpdateGroup(id) {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_group#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.fetchOne(id)
        this.updateGroupVisible = true
      },
      /** ----------- 接口获取类 ----------- */
      /** 获取 报销 列表*/
      fetchGroups(params) {
        getGroups(params).then(res => {
          this.groups = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
        })
      },
      fetchCosts(params) {
        getGeneral(params).then(res => {
          this.costs = res.data._items
          // this.pageInfo.totalCount = res.data._meta.totalCount
        })
      },
      fetchOne(id) {
        getGroups({ id: id }).then(res => {
          this.updateForm = Object.assign({}, res.data._items[0])
          console.log(this.updateForm)
        })
      },
      /** 远程搜索客户列表方法 */
      remoteCostUsers(query) {
        let params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getUsers(params).then(res => {
          this.costUsers = res.data._items
        })
      },
      /** 时间格式化 */
      dateFormat(row, column) {
        const date = row[column.property]
        return parseTime(date, '{y}-{m}-{d}')
      },
      /** 提交新增分组表单 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            createGroup(this.addForm).then(res => {
              if (res.data.bCode === 101) {
                this.$notify({
                  title: '成功',
                  message: '新增成功',
                  type: 'success',
                  position: 'top-right'
                })
                this.fetchGroups()
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
              this.addFormVisible = false
            })
          } else {
            console.log('提交错误!!')
            return false
          }
        })
      },
      /** 提交修改分组表单*/
      submitUpdateForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            updateGroup(this.updateForm).then(res => {
              if (res.data.bCode === 101) {
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  position: 'top-right'
                })
                this.fetchGroups()
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
              this.updateGroupVisible = false
            })
          } else {
            console.log('提交错误!!')
            return false
          }
        })
      },
      // 重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      /** 表格样式设置方法 */
      rowStyle() {
        return 'height: 35px'
      },
      rowStyleSon() {
        return 'height: 20px'
      },
      cellStyle() {
        return 'padding: 2px'
      },
      /** 分页器方法 */
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize
        this.fetchGroups(this.finalSearchForm)
      },
      handleCurrentChange(currentPage) {
        this.pageInfo.currentPage = currentPage
        this.fetchGroups(this.finalSearchForm)
      }
    },
    mounted() {
      this.fetchGroups()
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
      if (this.actionCheck_.actionCheck('read_groupCost#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style scoped>
  .btnUpdate{
    margin-right: 10px;
    padding: 6px 10px;
  }
  .btnDelete{
    margin-right: 10px;
    padding: 6px 10px;
  }
</style>
