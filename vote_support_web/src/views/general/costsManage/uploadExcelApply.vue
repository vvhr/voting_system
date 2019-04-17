<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>操作面板</span>
      </div>
      <i class="el-icon-caret-right"></i> 模式：{{SkipApproval===1?'特殊':'普通'}} <br />
      <i class="el-icon-caret-right"></i> 预计添加数据：{{tableNull == null?0:tableDataLength}} 条 <br />
      <i class="el-icon-caret-right"></i> 成功数：{{successNumber}} 条 <br />
      <i class="el-icon-caret-right"></i> 表格检查：<a style="color: #DD4A68"> {{excelCheck}} </a><el-button class="btn" float="right" type="primary" @click="errorVisible = true"> 查看错误原因</el-button><br />
      <i class="el-icon-caret-right"></i> 操作进度：预计剩余 {{percentTime}} 秒 <el-progress style="width: 350px" :text-inside="true" :stroke-width="18" :percentage="percentage" status="success"></el-progress><br />
      操作：
      <el-button class="btn" float="right" :disabled="checkBtnDisable" type="danger" @click="onClickCheck()">数 据 检 验</el-button>
      <el-button class="btn" float="right" :disabled="confirmBtnDisable" type="danger" @click="onClickCreate()">确 认 添 加</el-button><br />
    </el-card><br />

    <span>导入表格预览：</span> <el-button class="btn" float="right" @click="previewVisible = !previewVisible">{{previewVisible === true?'收缩':'展开'}}</el-button><br />
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;" v-if="previewVisible">
      <el-table-column v-for="item of tableHeader" :prop="item" :label="item" :key="item"/>
    </el-table>

    <el-dialog
      title="错误报告"
      :visible.sync="errorVisible"
      width="50%"
      append-to-body
      center>
      <span><b>格式检查结果：</b></span><br />
      <p v-html="errorNote!==''?errorNote:'暂无记录'"></p><br />

      <span><b>数据检查结果：</b></span><br />
      <span>{{errorData!==''?'提示：有如下数据在添加时未成功,请修正后重新检查再添加':'暂无错误'}}</span><br />
      <p v-html="errorData!==''?errorData:'暂无记录'"></p><br />
      <span slot="footer" class="dialog-footer">
        <a style="font-size: 11px; color: #ff4d51">温馨提示:再次检验数据前,一定要先清空报告!</a><br /><br />
      <el-button type="primary" @click="onSureError()">关 闭</el-button>
        <el-button type="primary" @click="onClearError()">清 空 报 告</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import UploadExcelComponent from '../../../components/UploadExcel/index.vue'
  import { createApplyExcel, checkApplyExcel } from '../../../api/costApply'

  const defaultRuleform = {
    date: 0,
    applyType_name: null,
    group_name: null,
    branch_name: null,
    cost_user_name: null,
    type_name: null,
    money: null,
    use: null,
    sbj_name: null,
    sbjR_name: null,
    note: null,
    receipt_no: null
  }
  export default {
    name: 'uploadExcel',
    components: { UploadExcelComponent },
    props: {
      SkipApproval: Number
    },
    data() {
      return {
        // 导入速率，建议在150以上。
        addSpeed: 140,
        tableData: [],
        tableNull: true,
        tableDataLength: 0,
        tableHeader: [],
        // 初步检查错误报告
        errorNote: '',
        // 确认添加错误报告
        errorData: '',
        errorVisible: false,
        previewVisible: false,
        percentage: 0,
        percentTime: 0,
        successNumber: 0,
        confirmBtnDisable: true,
        checkBtnDisable: true,
        excelCheck: '待检查',
        ruleForm: Object.assign({}, defaultRuleform),
        // submitResult: null,
        // 总条数
        DateLength: 0
      }
    },
    methods: {
      beforeUpload(file) {
        this.resetExcel()
        this.errorData = ''
        this.errorNote = ''
        const isLt1M = file.size / 1024 / 1024 < 5
        if (isLt1M) {
          return true
        }
        // 1.判断大小错误
        this.$message({
          message: '导入的Excel文件大小不得超过5mb',
          type: 'warning'
        })
        return false
      },
      handleSuccess({ results, header }) {
        this.tableData = results
        this.tableHeader = header
        this.tableDataLength = results.length
        this.tableNull = false
        this.percentTime = Math.round(this.tableData.length * this.addSpeed / 1000)
        // 0判断表头长度是否等于11
        if (header.length !== 13) {
          this.$message({
            message: '导入错误，表头长度错误，请确认表头是否是13项！',
            type: 'warning'
          })
          this.excelCheck = '检查不通过'
          return false
        }
        // 1判断表头第1项是否为日期
        // 判断表项是否大于300项
        if (results.length > 300) {
          this.$message({
            message: '导入错误，一次性导入数据不得大于300条！',
            type: 'warning'
          })
          this.excelCheck = '检查不通过'
          return false
        }
        if (this.checkHeader(0, '面单日期') === false) return false
        if (this.checkHeader(1, '申请类型') === false) return false
        if (this.checkHeader(2, '分组名称') === false) return false
        if (this.checkHeader(3, '报销人') === false) return false
        if (this.checkHeader(4, '分公司') === false) return false
        if (this.checkHeader(5, '报销类型') === false) return false
        if (this.checkHeader(6, '金额') === false) return false
        if (this.checkHeader(7, '用途') === false) return false
        if (this.checkHeader(8, '实际科目') === false) return false
        if (this.checkHeader(9, '面单科目') === false) return false
        if (this.checkHeader(10, '备注') === false) return false
        if (this.checkHeader(11, '报销单号') === false) return false
        if (this.checkHeader(12, '申请总条数') === false) return false
        // 通过for循环检查表单
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.isEmpty(this.tableData[i].面单日期)) {
            this.errorNote = this.errorNote + '<br />第' + (i + 1) + '条数据的面单日期缺少，请修正。'
            continue
          }
          // 判断日期是否合法，转字符串后取日期长度,若不合法则跳到下一条
          if ((this.tableData[i].面单日期).toString().length > 10 || (this.tableData[i].面单日期).toString().length < 8) {
            this.errorNote = this.errorNote + '<br />第' + (i + 1) + '条数据的日期错误，请保证日期格式为：2018/0/0 (文本型)，请修正。'
            continue
          }
          // 判断是否为空
          if (this.isEmpty(this.tableData[i].申请类型)) {
            this.errorNote = this.errorNote + '<br />第' + (i + 1) + '条数据的申请类型缺少，请修正。'
            continue
          }
          if (this.isEmpty(this.tableData[i].分组名称)) {
            this.errorNote = this.errorNote + '<br />第' + (i + 1) + '条数据的分组名称缺少，请修正。'
            continue
          }
          if (this.isEmpty(this.tableData[i].报销人)) {
            this.errorNote = this.errorNote + '<br />第' + (i + 1) + '条数据的报销人缺少，请修正。'
            continue
          }
          if (this.isEmpty(this.tableData[i].分公司)) {
            this.errorNote = this.errorNote + '<br />第' + (i + 1) + '条数据的分公司缺少，请修正。'
            continue
          }
          if (this.isEmpty(this.tableData[i].报销类型)) {
            this.errorNote = this.errorNote + '<br />第' + (i + 1) + '条数据的报销类型缺少，请修正。'
            continue
          }
          if (this.isEmpty(this.tableData[i].金额)) {
            this.errorNote = this.errorNote + '<br />第' + (i + 1) + '条数据的金额缺少，请修正。'
            continue
          }
          if (this.isEmpty(this.tableData[i].实际科目)) {
            this.errorNote = this.errorNote + '<br />第' + (i + 1) + '条数据的实际科目缺少，请修正。'
            continue
          }
          if (this.isEmpty(this.tableData[i].面单科目)) {
            this.errorNote = this.errorNote + '<br />第' + (i + 1) + '条数据的面单科目缺少，请修正。'
            continue
          }
          if (this.isEmpty(this.tableData[i].用途)) {
            this.errorNote = this.errorNote + '<br />第' + (i + 1) + '条数据的用途缺少，请修正。'
            continue
          }
          if (this.isEmpty(this.tableData[i].报销单号)) {
            this.errorNote = this.errorNote + '<br />第' + (i + 1) + '条数据的报销单号缺少，请修正。'
            continue
          }
          if (this.isEmpty(this.tableData[i].申请总条数)) {
            this.errorNote = this.errorNote + '<br />第' + (i + 1) + '条数据的申请总条数缺少，请修正。'
          }
        }
        // 如果错误信息长度大于15个字符，说明有错误。
        if (this.errorNote.length > 15) {
          this.$message({
            message: '导入错误，请查看错误报告！',
            type: 'warning'
          })
          this.excelCheck = '检查不通过'
          return false
        } else {
          // 表项初步检查通过
          this.$message({
            message: '表格格式检查完毕，请点击数据检验！',
            type: 'success'
          })
          this.excelCheck = '表格格式检查完毕,请点击数据检验！'
          // 检查按钮可视
          this.checkBtnDisable = false
        }
      },
      // 日期字符串转时间戳
      dateToTimeStamp(date) {
        date = date.substring(0, 10)
        date = date.replace(/-/g, '/')
        return new Date(date).getTime()
      },
      resetExcel() {
        this.tableData = null
        this.tableHeader = null
        this.excelCheck = '待检查'
        this.confirmBtnDisable = true
        this.checkBtnDisable = true
        this.successNumber = 0
        this.percentage = 0
        this.percentTime = 0
      },
      // 判断字符是否为空的方法
      isEmpty(obj) {
        return typeof obj === 'undefined' || obj == null || obj === ''
      },
      // 去除首尾空格
      getTrim(str) {
        return str.toString().replace(/(^\s*)|(\s*$)/g, '')
      },
      sleep(delay) {
        return new Promise((resolve) => setTimeout(resolve, delay))
      },
      // 表头文本检查方法
      checkHeader(i, content) {
        if (this.tableHeader[i] !== content) {
          this.$message({
            message: '导入错误，表头第' + (i + 1) + '项必须是 “' + content + '” ！',
            type: 'warning'
          })
          this.excelCheck = '检查不通过'
          return false
        }
      },
      // 重置表单
      resetForm() {
        this.ruleForm = Object.assign({}, defaultRuleform)
      },
      onSureError() {
        this.errorVisible = false
      },
      onClearError() {
        this.errorVisible = false
        this.errorData = ''
        this.errorNote = ''
      },
      /** 第一次提交: 错误检查 , 仅检查数据,不执行添加 */
      onClickCheck() {
        this.check(0, this.tableData.length)
      },
      check(i, length) {
        this.ruleForm = Object.assign({}, defaultRuleform)
        this.ruleForm.date = this.getTrim(this.tableData[i].面单日期)
        this.ruleForm.date = this.dateToTimeStamp(this.tableData[i].面单日期)
        this.ruleForm.date = Math.floor(this.ruleForm.date / 1000)
        this.ruleForm.applyType_name = this.getTrim(this.tableData[i].申请类型)
        this.ruleForm.group_name = this.getTrim(this.tableData[i].分组名称)
        this.ruleForm.branch_name = this.getTrim(this.tableData[i].分公司)
        this.ruleForm.cost_user_name = this.getTrim(this.tableData[i].报销人)
        this.ruleForm.type_name = this.getTrim(this.tableData[i].报销类型)
        this.ruleForm.money = this.getTrim(this.tableData[i].金额)
        this.ruleForm.sbj_name = this.getTrim(this.tableData[i].面单科目)
        this.ruleForm.sbjR_name = this.getTrim(this.tableData[i].实际科目)
        this.ruleForm.use = this.tableData[i].用途
        this.ruleForm.note = this.tableData[i].备注
        this.ruleForm.receipt_no = this.getTrim(this.tableData[i].报销单号)
        this.ruleForm.receipt_total = this.tableData[i].申请总条数
        this.sleep(150).then(() => {
          // 执行提交
          checkApplyExcel(this.ruleForm).then(res => {
            if (res.data.bCode === 101) {
              this.$notify({
                title: '数据检查通过' + 'x' + (i + 1),
                type: 'success',
                position: 'top-right'
              })
            } else {
              this.errorData = this.errorData + '<br /><i class="el-icon-error"></i> 第' + (i + 1) + '条数据检查失败，原因：' + res.data.bError
            }
            this.percentage = Math.round(((i + 1) / this.tableData.length) * 100)
            this.percentTime = Math.round((this.tableData.length - i) * (this.addSpeed / 1000))
            // 如果循环结束,就判断错误报告长度是否小于15
            if (++i < length) this.check(i, length)
            else if (this.errorData.length < 15) {
              // 确认添加按钮可视
              this.confirmBtnDisable = false
              this.$message({
                message: '恭喜你,表格数据检查完毕,请点击确认添加！',
                type: 'success'
              })
            } else if (this.errorData.length > 15) {
              this.errorVisible = true
            }
          })
        })
      },
      /** 第二次提交: 正式添加 */
      onClickCreate() {
        // 通过递归添加到表单
        this.create(0, this.tableData.length)
      },
      create(i, length) {
        this.ruleForm = Object.assign({}, defaultRuleform)
        this.ruleForm.date = this.getTrim(this.tableData[i].面单日期)
        this.ruleForm.date = this.dateToTimeStamp(this.tableData[i].面单日期)
        this.ruleForm.date = Math.floor(this.ruleForm.date / 1000)
        this.ruleForm.applyType_name = this.getTrim(this.tableData[i].申请类型)
        this.ruleForm.group_name = this.getTrim(this.tableData[i].分组名称)
        this.ruleForm.branch_name = this.getTrim(this.tableData[i].分公司)
        this.ruleForm.cost_user_name = this.getTrim(this.tableData[i].报销人)
        this.ruleForm.type_name = this.getTrim(this.tableData[i].报销类型)
        this.ruleForm.money = this.getTrim(this.tableData[i].金额)
        this.ruleForm.sbj_name = this.getTrim(this.tableData[i].面单科目)
        this.ruleForm.sbjR_name = this.getTrim(this.tableData[i].实际科目)
        this.ruleForm.use = this.tableData[i].用途
        this.ruleForm.note = this.tableData[i].备注
        this.ruleForm.receipt_no = this.getTrim(this.tableData[i].报销单号)
        this.ruleForm.receipt_total = this.tableData[i].申请总条数
        this.sleep(200).then(() => {
        // 执行提交
          const params = Object.assign({}, this.ruleForm, { 'SkipApproval': this.SkipApproval })
          createApplyExcel(params).then(res => {
            if (res.data.bCode === 101) {
              this.$notify({
                title: '报销申请创建成功' + 'x' + (i + 1),
                type: 'success',
                position: 'top-right'
              })
              this.successNumber = this.successNumber + 1
            } else {
              this.errorData = this.errorData + '<br /><i class="el-icon-error"> 第' + (i + 1) + '条数据添加失败，原因：' + res.data.bError
              this.errorVisible = true
            }
            this.percentage = Math.round(((i + 1) / this.tableData.length) * 100)
            this.percentTime = Math.round((this.tableData.length - i) * (this.addSpeed / 1000))
            if (++i < length) this.create(i, length)
            else {
              this.$notify({
                title: '恭喜您，导入完毕',
                type: 'success',
                position: 'top-center'
              })
              this.checkBtnDisable = true
              this.confirmBtnDisable = true
              this.percentage = 100
              this.percentTime = 0
            }
          })
        })
      }
    }
  }
</script>
<style scoped>
  .btn{
    margin-right: 10px;
    padding: 6px 10px;
  }


  .box-card {
    width: 480px;
    background-color: #c9d5de;
    margin-top: 10px;
  }
</style>
