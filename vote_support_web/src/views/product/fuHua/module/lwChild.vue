<template>
  <div class="">
    <el-button type="primary" @click="onSubmitDialog">分包详情</el-button>
    <el-dialog title="分包详情" :visible.sync="dialogVisible" width="50%">
      <el-button type="primary" @click="onSubmitAdd">+</el-button>
      <table class="_table" border="0" cellpadding="0" cellspacing="0" style="width: 100%">
        <thead>
        <tr>
          <th>序号</th>
          <th>分包队伍</th>
          <th>已支付金额</th>
          <!--<th>已开票金额</th>-->
          <th>操作时间</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody v-for="(item, key) in list" :key="key" >
        <tr>
          <td>{{item.id}}</td>
          <td>{{item.fen_team}}</td>
          <td>{{item.repay_cost}}</td>
          <!--<td>{{item.repay_p_cost}}</td>-->
          <td>{{item.create_at | parseTime}}</td>
          <td><el-button type="primary" @click="onSubmitEdit(item)" circle icon="el-icon-edit"></el-button></td>
        </tr>
        <tr v-for="_item in item.children" v-if="item.showVisible"  style="width: 100%;background: #f0f0f0;">
          <td>{{_item.id}}</td>
          <td>{{_item.fen_team}}</td>
          <td>{{_item.repay_cost}}</td>
          <td>{{_item.create_at | parseTime}}</td>
          <td></td>
        </tr>
        <tr v-else-if="dialogHistory === true">
          <p style="color: green">没有记录</p>
        </tr>
        </tbody>
      </table>
    </el-dialog>
  </div>
</template>

<script>
  import { getLwDetails, createLwDetail, getLwDetail, updateLwDetail } from '../../../../api/lwDetail'
  import { replyRes } from '../../../../utils/res'
  import { parseTime } from '../../../../utils'

  const defaultRulefrom = {
    lw_id: null,
    repay_cost: null,
    work_num: null,
    fen_team: '',
    detail_id: null
  }

  export default {
    name: 'lwChild',
    props: {
      id: null
    },
    data() {
      return {
        dialogVisible: false,
        dialogHistory: false,
        dialogAdd: false,
        isBoolean: false,
        ruleForm: Object.assign({}, defaultRulefrom),
        list: {},
        searchForm: {
          lw_id: this.id,
          page: 1,
          pageSize: 10,
          totalCount: 1
        }
      }
    },
    filters: {
      parseTime: function(value) {
        if (!value) return ''
        value = value.toString()
        return parseTime(value, '{y}年{m}月{d}日')
      }
    },
    methods: {
      fetchLwDetails() {
        getLwDetails(this.searchForm).then(res => {
          this.list = res.data._items
        })
      },
      fetchLwDetail(id) {
        getLwDetail({ id: id }).then(res => {
          this.ruleForm = res.data
          this.ruleForm.detail_id = id
        })
      },
      onSubmitDialog() {
        this.dialogVisible = true
        this.fetchLwDetails()
      },
      onSubmitAdd() {
        this.ruleForm = Object.assign({}, defaultRulefrom)
        this.ruleForm.lw_id = this.id
        this.isBoolean = false
        this.dialogAdd = true
      },
      onSubmitEdit(item) {
        this.isBoolean = true
        this.dialogAdd = true
        this.fetchLwDetail(item.id)
      },
      onSubmitDetail(item) {
        if (item.children === undefined) {
          this.fetchLwDetailsHistory(item)
        } else {
          item.showVisible = !item.showVisible
        }
      },
      submitAdd() {
        this.dialogAdd = false
        if (this.isBoolean === false) {
          return createLwDetail(this.ruleForm).then(res => {
            if (replyRes(res)) {
              this.fetchLwDetails()
              this.$emit('upView')
            }
          })
        } else {
          return updateLwDetail(this.ruleForm).then(res => {
            if (replyRes(res)) {
              this.$emit('upView')
              this.fetchLwDetails()
            }
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
