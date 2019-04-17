<template>
<div>
  <download-excel
    class = "export-excel-wrapper"
    :data = "ads"
    :fields = "json_fields"
    name = "银行流水.xls">
    <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
    <el-button :loading="downloadLoading" size="small" icon="el-icon-download" type="success">将本页面流水导出</el-button>
  </download-excel>
</div>
</template>
<script>
  // import { parseTime } from '../../../../utils/index'
  import { parseTime } from '../../../../utils/index'
  export default {
    name: 'exportBankFlow',
    props: {
      ads: null
    },
    data() {
      return {
        list: null,
        listLoading: true,
        downloadLoading: false,
        filename: '',
        autoWidth: true,
        bookType: 'xlsx',
        json_fields: {
          '流水ID': 'id',
          '打款日期': {
            field: 'payer_time',
            callback: value => {
              return this.dateFormat_short(value)
            }
          },
          '凭证编号': 'proof_no',
          '收付款人': {
            field: 'costApplys',
            callback: value => {
              return value[0].cost_user_name
            }
          },
          '收款金额': 'received_money',
          '付款金额': 'money_sum',
          '费用明细(面单)': 'sbj_all',
          '费用明细(实际)': 'sbjR_all',
          '摘要': 'use_all',
          '备注': 'comment',
          '打款银行': 'bank_name',
          '当前余额': 'current_balance',
          '收款单位': 'company_name'
        },
        json_meta: [
          [
            {
              ' key ': ' charset ',
              ' value ': ' utf- 8 '
            }
          ]
        ]
      }
    },
    methods: {
      /** 格式化过滤类 */
      dateFormat_short(date) {
        if (date === null) {
          return '暂无'
        } else return parseTime(date, '{y}-{m}-{d}')
      } // 时间格式化
    }
  }
</script>

<style scoped>

</style>
