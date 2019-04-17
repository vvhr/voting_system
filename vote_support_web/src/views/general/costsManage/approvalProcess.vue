<template>
  <div class="app-container">
    <!--头部-->
    <div class="header">
      <el-row :gutter="20">
        <el-col :span="1.5" style="margin-right: 5px">
          <div class="tips">温馨提示</div>
        </el-col>
        <el-col :span="15">
          <div class="tips-text"><b>在本页设置各个分公司的报销申请审批流程!</b> 当申请金额小于等于3000元时,审批流程跳过第四级!</div>
        </el-col>

      </el-row>
    </div>
    <!--中部-->
    <div class="body">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-card class="box-card">
            <div slot="header" class="box-card-title">
              <span>华建集团总经办</span>
              <el-button @click="onUpdate(namesJT)" style="float: right; padding: 3px 3px" type="danger"> 修 改</el-button>
            </div>
            <div class="text item">
              <a style="color: #3399ff">一级审核人 </a>{{ this.namesJT.length < 1 ? '暂无': this.namesJT.first.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">二级审核人 </a>{{ this.namesJT.length < 1 ? '暂无': this.namesJT.second.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">三级审核人 </a>{{ this.namesJT.length < 1 ? '暂无': this.namesJT.third.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">四级审核人 </a>{{ this.namesJT.length < 1 ? '暂无': this.namesJT.fourth.username }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card class="box-card">
            <div slot="header" class="box-card-title">
              <span>华建集团综合管理部</span>
              <el-button @click="onUpdate(namesJTZH)" style="float: right; padding: 3px 3px" type="danger"> 修 改</el-button>
            </div>
            <div class="text item">
              <a style="color: #3399ff">一级审核人 </a>{{ this.namesJTZH.length < 1 ? '暂无': this.namesJTZH.first.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">二级审核人 </a>{{ this.namesJTZH.length < 1 ? '暂无': this.namesJTZH.second.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">三级审核人 </a>{{ this.namesJTZH.length < 1 ? '暂无': this.namesJTZH.third.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">四级审核人 </a>{{ this.namesJTZH.length < 1 ? '暂无': this.namesJTZH.fourth.username }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card class="box-card">
            <div slot="header" class="box-card-title">
              <span>华建集团经营部</span>
              <el-button @click="onUpdate(namesJTJY)" style="float: right; padding: 3px 3px" type="danger"> 修 改</el-button>
            </div>
            <div class="text item">
              <a style="color: #3399ff">一级审核人 </a>{{ this.namesJTJY.length < 1 ? '暂无': this.namesJTJY.first.username}}
            </div>
            <div class="text item">
              <a style="color: #3399ff">二级审核人 </a>{{ this.namesJTJY.length < 1 ? '暂无': this.namesJTJY.second.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">三级审核人 </a>{{ this.namesJTJY.length < 1 ? '暂无': this.namesJTJY.third.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">四级审核人 </a>{{ this.namesJTJY.length < 1 ? '暂无': this.namesJTJY.fourth.username }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card class="box-card">
            <div slot="header" class="box-card-title">
              <span>华建集团项目部</span>
              <el-button @click="onUpdate(namesJTXM)" style="float: right; padding: 3px 3px" type="danger"> 修 改</el-button>
            </div>
            <div class="text item">
              <a style="color: #3399ff">一级审核人 </a>{{ this.namesJTXM.length < 1 ? '暂无': this.namesJTXM.first.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">二级审核人 </a>{{ this.namesJTXM.length < 1 ? '暂无': this.namesJTXM.second.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">三级审核人 </a>{{ this.namesJTXM.length < 1 ? '暂无': this.namesJTXM.third.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">四级审核人 </a>{{ this.namesJTXM.length < 1 ? '暂无': this.namesJTXM.fourth.username }}
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-card class="box-card">
            <div slot="header" class="box-card-title">
              <span>华建电力设计</span>
              <el-button @click="onUpdate(namesHJ)" style="float: right; padding: 3px 3px" type="danger"> 修 改</el-button>
            </div>
            <div class="text item">
              <a style="color: #3399ff">一级审核人 </a>{{ this.namesHJ.length < 1 ? '暂无': this.namesHJ.first.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">二级审核人 </a>{{ this.namesHJ.length < 1 ? '暂无': this.namesHJ.second.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">三级审核人 </a>{{ this.namesHJ.length < 1 ? '暂无': this.namesHJ.third.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">四级审核人 </a>{{ this.namesHJ.length < 1 ? '暂无': this.namesHJ.fourth.username }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card class="box-card">
            <div slot="header" class="box-card-title">
              <span>富华电力</span>
              <el-button @click="onUpdate(namesFH)" style="float: right; padding: 3px 3px" type="danger"> 修 改</el-button>
            </div>
            <div class="text item">
              <a style="color: #3399ff">一级审核人 </a>{{ this.namesFH.length < 1 ? '暂无': this.namesFH.first.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">二级审核人 </a>{{ this.namesFH.length < 1 ? '暂无': this.namesFH.second.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">三级审核人 </a>{{ this.namesFH.length < 1 ? '暂无': this.namesFH.third.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">四级审核人 </a>{{ this.namesFH.length < 1 ? '暂无': this.namesFH.fourth.username }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card class="box-card">
            <div slot="header" class="box-card-title">
              <span>源通电力</span>
              <el-button @click="onUpdate(namesYT)" style="float: right; padding: 3px 3px" type="danger"> 修 改</el-button>
            </div>
            <div class="text item">
              <a style="color: #3399ff">一级审核人 </a>{{ this.namesYT.length < 1 ? '暂无': this.namesYT.first.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">二级审核人 </a>{{ this.namesYT.length < 1 ? '暂无': this.namesYT.second.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">三级审核人 </a>{{ this.namesYT.length < 1 ? '暂无': this.namesYT.third.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">四级审核人 </a>{{ this.namesYT.length < 1 ? '暂无': this.namesYT.fourth.username }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card class="box-card">
            <div slot="header" class="box-card-title">
              <span>华建物联</span>
              <el-button @click="onUpdate(namesWL)" style="float: right; padding: 3px 3px" type="danger"> 修 改</el-button>
            </div>
            <div class="text item">
              <a style="color: #3399ff">一级审核人 </a>{{ this.namesWL.length < 1 ? '暂无': this.namesWL.first.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">二级审核人 </a>{{ this.namesWL.length < 1 ? '暂无': this.namesWL.second.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">三级审核人 </a>{{ this.namesWL.length < 1 ? '暂无': this.namesWL.third.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">四级审核人 </a>{{ this.namesWL.length < 1 ? '暂无': this.namesWL.fourth.username }}
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-card class="box-card">
            <div slot="header" class="box-card-title">
              <span>华建云南</span>
              <el-button @click="onUpdate(namesYN)" style="float: right; padding: 3px 3px" type="danger"> 修 改</el-button>
            </div>
            <div class="text item">
              <a style="color: #3399ff">一级审核人 </a>{{ this.namesYN.length < 1 ? '暂无': this.namesYN.first.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">二级审核人 </a>{{ this.namesYN.length < 1 ? '暂无': this.namesYN.second.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">三级审核人 </a>{{ this.namesYN.length < 1 ? '暂无': this.namesYN.third.username }}
            </div>
            <div class="text item">
              <a style="color: #3399ff">四级审核人 </a>{{ this.namesYN.length < 1 ? '暂无': this.namesYN.fourth.username }}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!--表单-->
    <el-dialog title="修改审批流程" :visible.sync="updateFormVisible" style="width: 1100px">
      <el-form :rules="rules" :model="updateForm" ref="updateForm" label-width="100px" size="mini">
        <el-form-item label="分公司">
          {{this.updateForm.branch_name}}
        </el-form-item>
        <el-form-item label="一级审核人" prop="first_id">
          <el-select style="width: 150px" v-model="updateForm.first_id" filterable remote
            reserve-keyword placeholder="请选择" :remote-method="remoteUsers">
            <el-option v-for="user1 in users" :key="user1.id" :label="user1.name" :value="user1.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级审核人" prop="second_id">
          <el-select style="width: 150px" v-model="updateForm.second_id" filterable remote
                     reserve-keyword placeholder="请选择" :remote-method="remoteUsers">
            <el-option v-for="user2 in users" :key="user2.id" :label="user2.name" :value="user2.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级审核人" prop="third_id">
          <el-select style="width: 150px" v-model="updateForm.third_id" filterable remote
                     reserve-keyword placeholder="请选择" :remote-method="remoteUsers">
            <el-option v-for="user3 in users" :key="user3.id" :label="user3.name" :value="user3.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="四级审核人" prop="fourth_id">
          <el-select style="width: 150px" v-model="updateForm.fourth_id" filterable remote
                     reserve-keyword placeholder="请选择" :remote-method="remoteUsers">
            <el-option v-for="user4 in users" :key="user4.id" :label="user4.name" :value="user4.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-tag>温馨提示: 修改审核流程不影响已创建的申请的审核流程!!</el-tag>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('updateForm')">确定修改</el-button>
        <el-button @click="updateFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_pageApprovalProcess   beforeMount()
    修改华建集团流程: update_approvalJT onUpdate()
    修改华建设计流程: update_approvalHJ onUpdate()
    修改富华电力流程: update_approvalFH onUpdate
    修改源通电力流程: update_approvalYT onUpdate
    修改物联流程:     update_approvalWL onUpdate
-->
<script>
  import { getApproval, updateApproval } from '../../../api/costApply'
  import { getUsers } from '../../../api/user'

  export default {
    name: 'approvalProcess',
    data() {
      return {
        users: [],
        // 审批流程 对象数组
        namesJT: [],
        namesJTZH: [],
        namesJTJY: [],
        namesJTXM: [],
        namesHJ: [],
        namesFH: [],
        namesYT: [],
        namesWL: [],
        namesYN: [],
        // 可视
        updateFormVisible: false,
        updateForm: {
          id: null,
          first_id: null,
          second_id: null,
          third_id: null,
          fourth_id: null,
          branch_name: null,
          branch_id: null
        },
        rules: {
          first_id: [
            { required: true, message: '第一审核人不得为空', trigger: 'blur' }
          ],
          second_id: [
            { required: true, message: '第二审核人不得为空', trigger: 'blur' }
          ],
          third_id: [
            { required: true, message: '第三审核人不得为空', trigger: 'blur' }
          ],
          fourth_id: [
            { required: true, message: '第四审核人不得为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      /** 点击事件类 */
      onUpdate(res) {
        if (res.id === 1 || res.id === 6 || res.id === 7 || res.id === 8) {
          /** 权限检查 */
          if (this.actionCheck_.actionCheck('update_approvalJT#') === false) {
            this.$message.error('错误提示,您没有该操作的权限!')
            return false
          }
        } else if (res.branch_id === 2 || res.branch_id === 6) {
          /** 权限检查 */
          if (this.actionCheck_.actionCheck('update_approvalHJ#') === false) {
            this.$message.error('错误提示,您没有该操作的权限!')
            return false
          }
        } else if (res.branch_id === 3) {
          /** 权限检查 */
          if (this.actionCheck_.actionCheck('update_approvalFH#') === false) {
            this.$message.error('错误提示,您没有该操作的权限!')
            return false
          }
        } else if (res.branch_id === 4) {
          /** 权限检查 */
          if (this.actionCheck_.actionCheck('update_approvalWL#') === false) {
            this.$message.error('错误提示,您没有该操作的权限!')
            return false
          }
        } else if (res.branch_id === 5) {
          /** 权限检查 */
          if (this.actionCheck_.actionCheck('update_approvalYT#') === false) {
            this.$message.error('错误提示,您没有该操作的权限!')
            return false
          }
        }
        this.updateForm.id = res.id
        this.updateForm.branch_id = res.branch_id
        this.updateForm.branch_name = res.branch.name
        this.updateForm.first_id = res.first_id
        this.updateForm.second_id = res.second_id
        this.updateForm.third_id = res.third_id
        this.updateForm.fourth_id = res.fourth_id
        this.updateFormVisible = true
      },
      /** 表单提交类 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            updateApproval(this.updateForm).then(res => {
              if (res.data.bCode === 101) {
                this.$notify({
                  title: '成功',
                  message: '修改审批流程成功!',
                  type: 'success',
                  position: 'top-right'
                })
                this.fetchNames()
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
              this.updateFormVisible = false
            })
          } else {
            console.log('提交错误!!')
            return false
          }
        })
      },
      /** 接口类 */
      // 获取所有公司流程
      fetchNames() {
        this.pageLoading()
        getApproval({ 'id': 1 }).then(res => {
          this.namesJTZH = res.data
        })
        getApproval({ 'id': 6 }).then(res => {
          this.namesJTJY = res.data
        })
        getApproval({ 'id': 7 }).then(res => {
          this.namesJTXM = res.data
        })
        getApproval({ 'id': 8 }).then(res => {
          this.namesJT = res.data
        })
        getApproval({ 'id': 2 }).then(res => {
          this.namesHJ = res.data
        })
        getApproval({ 'id': 3 }).then(res => {
          this.namesFH = res.data
        })
        getApproval({ 'id': 4 }).then(res => {
          this.namesWL = res.data
        })
        getApproval({ 'id': 5 }).then(res => {
          this.namesYT = res.data
        })
        getApproval({ 'id': 9 }).then(res => {
          this.namesYN = res.data
        })
      },
      fetchUsers() {
        getUsers({ 'pageSize': 200 }).then(res => {
          this.users = res.data._items
        })
      },
      // 修改流程
      /** -------- 远程搜索类 -------- */
      remoteUsers(query) {
        let params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getUsers(params).then(res => {
          this.users = res.data._items
          console.log(res.data._items)
        })
      },
      pageLoading() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        setTimeout(() => {
          loading.close()
        }, 500)
      }
    },
    mounted() {
      this.fetchNames()
      this.fetchUsers()
    },
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_pageApprovalProcess#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style scoped>
  .app-container{
    padding-left: 0;
    padding-right: 0;
    padding-top: 0
  }
  .tips {
    color: #fff;
    font-size: small;
    font-family: Microsoft YaHei,serif;
    border-radius: 5px 5px 5px 5px;
    padding: 5px 10px;
    height: 25px;
    width: 72px;
    background-color: #55c51c;
  }
  .tips-text {
    color: #555c66;
    font-size: small;
    font-family: Microsoft YaHei,serif;
    padding: 5px;
  }
  .header{
    padding: 10px 10px 10px 50px;
    background-color: #ffffff;
    height: 40px;
  }
  .body {
    white-space: normal;
    background-color: #d5d7daf2;
    padding: 20px 50px 50px 50px;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .box-card {
    background-color: #fff;
    white-space: normal;
    width: 220px;
    margin-bottom: 20px;
    margin-right: 20px;
  }
  .box-card-title{
    font-family: Microsoft YaHei,serif;
    color: #555c66;
    padding-top: 5px;
    padding-bottom: 5px;
  }

</style>
