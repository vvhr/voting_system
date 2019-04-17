<template>
    <div class="app-container">
      <!--顶部操作工具栏-->
      <div style="margin: 10px 0">
        <el-button @click = "onClickCreateBtn"><i class="el-icon-circle-plus-outline"></i> 新增</el-button>
      </div>
      <table class="_table" border="0" cellpadding="0" cellspacing="0" style="width: 100%">
        <thead>
        <tr>
          <th>序号</th>
          <th>部门名称</th>
          <th>年度产值目标</th>
          <th>本月产值目标</th>
          <th>本月实际产值</th>
          <th>新建项目(本月)</th>
          <th>进行中</th>
          <th>已完成</th>
          <th>本月收款额(万元)</th>
          <th>年度收款额(万元)</th>
        </tr>
        </thead>
        <tr v-for="(item, key) in list" :key="key">
          <td>{{key}}</td>
          <td>{{key | parseKey}}</td>
          <td v-if="item.year_total">{{item.year_total.year_value_goal}}</td>
          <td v-else>0</td>
          <td v-if="item.month">{{item.month.month_value_goal}}</td>
          <td v-else>0</td>
          <td>{{item.money_total > 0 ? item.money_total : 0}}</td>
          <td>{{item.newProject}}</td>
          <td>{{item.uncompleteNum}}</td>
          <td>{{item.completeNum}}</td>
          <td>{{item.receipt>0 ? item.receipt : 0}}</td>
          <td>{{item.yearReceipt>0 ? item.yearReceipt : 0 }}</td>
        </tr>
      </table>
      <div id="report" style="margin-top: 20px;">
        <table class="_table" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
          <thead>
          <tr>
            <th>序号</th>
            <th>客户名称</th>
            <th>累计合同额(年)</th>
            <th>累计合同额(月)</th>
            <th>累计项目(个)</th>
            <th>新建项目(个)</th>
            <th>完成项目(个)</th>
            <th>作废项目(个)</th>
            <th>历史累计可收款项(万元)</th>
            <th>本月累计可后收款项(万元)</th>
          </tr>
          </thead>
          <tr v-for="(item, key) in contractList" :key="key">
            <td>{{key}}</td>
            <td>{{item.type}}</td>
            <td>{{item.contractYear > 0 ? item.contractYear : 0}}</td>
            <td>{{item.contractMonth > 0 ? item.contractMonth : 0}}</td>
            <td>{{item.projectNum}}</td>
            <td>{{item.projectMonth}}</td>
            <td>{{item.projectCom}}</td>
            <td>{{item.projectValid}}</td>
            <td>{{item.hisOne}}</td>
            <td>{{item.hisTwo}}</td>
          </tr>
        </table>
      </div>
      <div id="addDialog">
        <el-dialog title="新增部门产值" :visible.sync="dialogVisible" width="30%">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
            <div v-if="departmentList">
            <el-form-item label="选择部门" prop="region">
              <el-select v-model="ruleForm.department_id" placeholder="请选择活动区域"  style="width: 100%">
                <el-option v-for="(val, key) in departmentList" :key="key" :label="val.name" :value="val.id"></el-option>
              </el-select>
            </el-form-item>
            </div>
            <el-form-item label="年度产值目标" prop="year_value_goal">
              <el-input v-model.number="ruleForm.year_value_goal"></el-input>
            </el-form-item>
            <el-form-item label="选择年度日期">
              <el-date-picker
                v-model="ruleForm.create_at"
                value-format="timestamp"
                type="year"
                placeholder="选择年度产值添加日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="本月产值目标" prop="month_value_goal">
              <el-input v-model.number="ruleForm.month_value_goal"></el-input>
            </el-form-item>
            <el-form-item label="选择月度日期">
              <el-date-picker
                v-model="ruleForm.createM_at"
                value-format="timestamp"
                type="month"
                placeholder="选择月度产值添加日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button :plain="true" type="primary" @click="onSubmitForm('ruleForm')">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
      <div id="chartOne" style="width: 600px;height:400px;">

      </div>
    </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_report_HJ   beforeMount()
    新增部门产值: create_report_HJ   onClickCreateBtn()
-->
<script>
  import { listDepartment } from '../../../api/department'
  import { CreateReport, IndexReport } from '../../../api/report'
  import { getContract } from '../../../api/project'
  // import { drawChart } from '../../../utils/charts'

  const defaultRuleForm = {
    department_id: null,
    year_value_goal: null, // 年度产值目标
    month_value_goal: null, // 本月产值目标
    month_value_reality: null, // 本月实际产值
    create_at: null, // 年度产值添加日期
    createM_at: null // 月度产值添加日期
  }
  export default {
    name: 'report',
    data() {
      return {
        dialogVisible: false,
        ruleForm: Object.assign({}, defaultRuleForm),
        list: {},
        contractList: {},
        rules: {
          year_value_goal: [
            { type: 'number', required: true, message: '请输入金额', trigger: 'blur' }
          ],
          month_value_goal: [
            { type: 'number', required: true, message: '请输入金额', trigger: 'blur' }
          ],
          month_value_reality: [
            { type: 'number', required: true, message: '请输入金额', trigger: 'blur' }
          ]
        },
        departmentList: {},
        chart: {
          el: 'chartOne',
          titleText: '阿萨德',
          legend: ['销量'],
          xAxis: ['a', 'b'],
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20]
          }]
        }
      }
    },
    filters: {
      parseKey: function(value) {
        if (value === '1') {
          return '设计一室'
        }
        if (value === '2') {
          return '设计二室'
        }
        if (value === '3') {
          return '设计三室'
        }
        if (value === '4') {
          return '技经室'
        }
        return value
      }
    },
    mounted() {
      this.fetchListDepartment()
      this.fetchIndexReport()
      this.fetchContract()
      this.fetchChart()
    },
    methods: {
      // 获取部门相关报表
      fetchIndexReport() {
        IndexReport().then(res => {
          this.list = res.data
        })
      },
      // 获取和同类型相关报表
      fetchContract() {
        getContract().then(res => {
          console.log('____', res)
          this.contractList = res.data
        })
      },
      // 获取部门列表
      fetchListDepartment() {
        listDepartment(['设计一室', '设计二室', '设计三室', '技经室']).then(res => {
          this.departmentList = res.data
        })
      },
      fetchChart() {
        // drawChart(this.chart)
      },
      // 新增部门按钮 被点击事件
      onClickCreateBtn() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('create_report_HJ#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.dialogVisible = true
      },
      // 添加部门产值
      onSubmitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            CreateReport(this.ruleForm).then(res => {
              this.fetchIndexReport()
              if (res.data.message === '该月份的生产计划已有' || res.data.errors === '该部门年度计划已有') {
                const message = res.data.message + ' ' + res.data.errors
                this.$message(message)
              }
              this.dialogVisible = false
            })
          } else {
            return false
          }
        })
      }
    },
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_report_HJ#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style scoped>

</style>
