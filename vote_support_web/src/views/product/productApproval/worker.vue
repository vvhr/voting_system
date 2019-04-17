<template>
    <div class="app-container">
      <div style="display: flex;justify-content:flex-start">
        <div class="worker_manage" style="width: 55%;margin-right: 20px">
          <el-button type="primary" @click="onClickCreate" icon="el-icon-plus" size="mini">添加工人</el-button>
          <div class="dialog_product_approval">
            <el-dialog
              :title="editDialogVisible === false ? '添加工人' : '修改工人'"
              :visible.sync="createDialogVisible"
              width="30%"
              :before-close="handleClose">
              <el-form :model="ruleForm" ref="ruleForm" label-width="90px" size="small">
                <el-form-item label="工人名称" prop="name">
                  <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="工人组别" prop="sort">
                  <el-select v-model.number="ruleForm.wk_id" placeholder="请选择工人组别">
                    <el-option :label="item.name" :value="item.id" v-for="(item, key) in groupList" :key="key"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="工种类型" prop="is_house">
                  <el-select v-model.number="ruleForm.type" placeholder="请选择工种类型">
                    <el-option label="排查" :value="1"></el-option>
                    <el-option label="物探" :value="2"></el-option>
                    <el-option label="施工" :value="3"></el-option>
                    <el-option label="其他" :value="4"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                  <el-input v-model.number="ruleForm.phone" type="number"></el-input>
                </el-form-item>
                <el-form-item label="身份证号码" prop="id_card">
                  <el-input v-model="ruleForm.id_card"></el-input>
                </el-form-item>
                <el-form-item label="房补" prop="is_house">
                  <el-select v-model.number="ruleForm.is_house" placeholder="是否有房补">
                    <el-option label="无" :value="0"></el-option>
                    <el-option label="有" :value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="意外险" prop="is_insurance">
                  <el-select v-model.number="ruleForm.is_insurance" placeholder="是否有意外险">
                    <el-option label="无" :value="0"></el-option>
                    <el-option label="有" :value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="content">
                  <el-input v-model="ruleForm.content"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
          <el-button @click="createDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onSubmitWorkerApply('ruleForm')" size="mini">提 交</el-button>
        </span>
            </el-dialog>
          </div>
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
              style="width: 100%"
              size="mini">
              <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
              <el-table-column label="工人名称"  width="100" prop="name" align="center"></el-table-column>
              <el-table-column label="工种类型" width="100" align="center">
                <template slot-scope="scope">
                  {{scope.row.type | parseType}}
                </template>
              </el-table-column>
              <el-table-column label="工人组别" prop="workerGroup.name" width="100" align="center">
              </el-table-column>
              <el-table-column label="电话" prop="phone" width="100" align="center"></el-table-column>
              <el-table-column label="身份证号码" prop="id_card"  align="center"></el-table-column>
              <el-table-column label="房补"  width="100" align="center">
                <template slot-scope="scope">
                  {{scope.row.is_house | parseState}}
                </template>
              </el-table-column>
              <el-table-column label="意外险" width="100" align="center">
                <template slot-scope="scope">
                  {{scope.row.is_insurance | parseState}}
                </template>
              </el-table-column>
              <el-table-column label="修改" align="center" width="90">
                <template slot-scope="scope">
                  <el-button @click="onClickEdit(scope.row)" type="primary" size="mini">修改</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div>
          <el-button type="primary" @click="onClickCreateGroup" icon="el-icon-plus" size="mini">创建工人组别</el-button>
          <div class="dialog_product_approval">
            <el-dialog
              :title="editGroupDialogVisible === false ? '添加工人组别' : '修改工人组别'"
              :visible.sync="createGroupDialogVisible"
              width="30%"
              :before-close="handleClose">
              <el-form :model="groupForm" ref="ruleForm" label-width="90px" size="small">
                <el-form-item label="工人组别" prop="name">
                  <el-input v-model="groupForm.name"></el-input>
                </el-form-item>
                <!--<el-form-item label="工人组长" prop="sort">-->
                  <!--<el-input v-model="groupForm.name"></el-input>-->
                <!--</el-form-item>-->
              </el-form>
              <span slot="footer" class="dialog-footer">
              <el-button @click="createGroupDialogVisible = false" size="mini">取 消</el-button>
              <el-button type="primary" @click="onSubmitCreateGroup('ruleForm')" size="mini">提 交</el-button>
              </span>
            </el-dialog>

            <el-dialog
              title="设置组长"
              :visible.sync="setGroupVisible"
              width="30%"
              :before-close="handleClose">
              <el-form :model="groupForm" ref="ruleForm" label-width="90px" size="small">
                <el-form-item label="工人组长" prop="sort">
                  <el-select
                    v-model="groupForm.group_id"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="关键词搜索，空格表示全部"
                    :remote-method="remoteMethod"
                    :loading="loading.worker_name"
                    style="width: 100%">
                    <el-option
                      v-for="item in workerName"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
              <el-button @click="setGroupVisible = false" size="mini">取 消</el-button>
              <el-button type="primary" @click="onSubmitSetGroup('ruleForm')" size="mini">提 交</el-button>
              </span>
            </el-dialog>
          </div>

          <div class="element_table" style="margin-top: 32px;">
            <el-table
              :data="groupList"
              stripe
              border
              fit
              :status-icon="true"
              style="width: 100%"
              size="mini">
              <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
              <el-table-column label="工人组别" prop="name" align="center"></el-table-column>
              <el-table-column label="组长" prop="worker.name" align="center"></el-table-column>
              <el-table-column label="组长设置" align="center" width="100">
                <template slot-scope="scope">
                  <el-button @click="onClickSetGroup(scope.row)" type="primary" size="mini">设置组长</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

    </div>
</template>

<script>
  import { createWorker, getWorkers, updateWorker, getWorker } from '../../../api/worker'
  import { replyRes } from '../../../utils/res'
  import { createWorkeGroup, getWorkerGroups, getWorkerGroup, updateWorkerGroup } from '../../../api/workerGroup'

  const defaultRuleForm = {
    name: null, // 工人名称
    phone: null, // 电话
    id_card: '', // 身份证号码
    is_house: null, // 是否有房补
    is_insurance: null, // 是否有意外险
    content: '', // 备注
    type: null, // 工种类型
    wk_id: null // 工人组别
  }

  const defaultGroupForm = {
    name: '',
    group_id: null
  }
  export default {
    name: 'approvalSet',
    data() {
      return {
        searchForm: {
          expand: 'workerGroup',
          page: 1,
          pageSize: 10,
          totalCount: 0
        },
        createDialogVisible: false,
        editDialogVisible: false,
        createGroupDialogVisible: false,
        editGroupDialogVisible: false,
        setGroupVisible: false,
        ruleForm: Object.assign({}, defaultRuleForm),
        groupForm: Object.assign({}, defaultGroupForm),
        List: [],
        groupList: [],
        loading: {
          worker_name: false
        },
        workerName: {}
      }
    },
    mounted() {
      this.fetchWorkers()
      this.fetchWorkerGroups()
    },
    filters: {
      parseState: function(value) {
        if (value === 0) {
          return '无'
        }
        return '有'
      },
      parseType: function(value) {
        if (value === 1) {
          return '排查'
        }
        if (value === 2) {
          return '物探'
        }
        if (value === 3) {
          return '施工'
        }
        if (value === 4) {
          return '其他'
        }
        return value
      }
    },
    methods: {
      fetchWorkers() {
        getWorkers(this.searchForm).then(res => {
          this.List = res.data._items
          this.searchForm.totalCount = res.data._meta.totalCount
        })
      },
      fetchWorkerGroups() {
        getWorkerGroups({ expand: 'worker' }).then(res => {
          this.groupList = res.data._items
        })
      },
      /** 获取工人组别表*/
      fetchWorkerGroup(id) {
        return getWorkerGroup({ id: id }).then(res => {
          this.groupForm = res.data
          return this.groupForm
        }).then(res => {
          getWorkers({ id: res.group_id }).then(res => {
            this.workerName = res.data._items
          })
        })
      },
      fetchWorker(item) {
        return getWorker({ id: item.id }).then(res => {
          this.ruleForm = res.data
        })
      },
      /** 创建工人组别*/
      onClickCreateGroup() {
        this.createGroupDialogVisible = true
        this.editGroupDialogVisible = false
      },
      /** 创建审批人 */
      onClickCreate() {
        this.createDialogVisible = true
        this.editDialogVisible = false
      },
      /** 修改 */
      onClickEdit(item) {
        this.createDialogVisible = true
        this.editDialogVisible = true
        this.fetchWorker(item)
      },
      /** 设置组长按钮*/
      onClickSetGroup(item) {
        this.fetchWorkerGroup(item.id)
        this.setGroupVisible = true
      },
      /** 创建组别*/
      onSubmitCreateGroup() {
        createWorkeGroup(this.groupForm).then(res => {
          if (replyRes(res)) {
            this.createGroupDialogVisible = false
            this.fetchWorkerGroups()
          }
        })
      },
      /** 设置组长*/
      onSubmitSetGroup() {
        this.groupForm.isType = 1 // 用于判断是否是这只队长
        updateWorkerGroup(this.groupForm).then(res => {
          if (replyRes(res)) {
            this.setGroupVisible = false
            this.fetchWorkerGroups()
          }
        })
      },
      onSubmitWorkerApply() {
        if (this.createDialogVisible === true && this.editDialogVisible === false) {
          createWorker(this.ruleForm).then(res => {
            if (replyRes(res)) {
              this.createDialogVisible = false
              this.ruleForm = Object.assign({}, defaultRuleForm)
              this.fetchWorkers()
            }
          })
        } else {
          updateWorker(this.ruleForm).then(res => {
            if (replyRes(res)) {
              this.editDialogVisible = false
              this.createDialogVisible = false
              this.ruleForm = Object.assign({}, defaultRuleForm)
              this.fetchWorkers()
            }
          })
        }
      },
      handleSizeChange(val) {
        this.searchForm.pageSize = val
        this.fetchWorkers()
      },
      handleCurrentChange(val) {
        this.searchForm.page = val
        this.fetchWorkers()
      },
      /** 申请窗口关闭时调用方法 */
      handleClose() {
        this.setGroupVisible = false
        this.createDialogVisible = false
        this.createGroupDialogVisible = false
        this.ruleForm = Object.assign({}, defaultRuleForm)
      },
      /** 远程搜索客户列表方法 */
      remoteMethod(query) {
        this.loading.worker_name = true
        let params = {}
        if (query !== null && query.trim() !== '') {
          params = { name: query.trim() }
        }
        getWorkers(Object.assign(params, { isUseWorker: 0 })).then(res => {
          this.workerName = res.data._items
          this.loading.worker_name = false
        })
      }
    }
  }
</script>

<style scoped>

</style>
