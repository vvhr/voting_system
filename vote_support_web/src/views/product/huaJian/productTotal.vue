<template>
  <div class="app-container">
    <div id="app" style="width: 100%;height: 150px;">
      <el-form ref="ruleForm" :model="ruleForm" label-width="100px">
        <el-col :span="3">
          <el-form-item label="客户名称" prop="customer_id">
            <!--<el-input v-model="ruleForm.customer_id"></el-input>-->
            <el-select
              v-model="ruleForm.customer_id"
              filterable
              remote
              reserve-keyword
              placeholder="关键词搜索，空格表示全部"
              :remote-method="remoteMethod"
              :loading="loading.customers">
              <el-option
                v-for="item in customers"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="选择时间" prop="flow_status" label-width="70px">
            <el-date-picker
              v-model="ruleForm.time"
              type="daterange"
              value-format = "timestamp"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions2">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="3">
        <el-form-item label="搜索">
          <el-button @click="onSubmitForm()" icon="el-icon-search" circle></el-button>
        </el-form-item>
        </el-col>
      </el-form>
    </div>
    <div id="circle" style="width: 600px;height:400px;float: left;padding-right: 60px">

    </div>
    <div id="status" style="width: 600px;height:400px; float: left;">

    </div>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_productTotal_HJ   beforeMount()
-->
<script>
  // import { getProjectType } from '../../api/projectType'
  import { getTotal } from '../../../api/project'
  import echarts from 'echarts'
  import { getCustomers } from '../../../api/customer'

  const defaultRuleForm = {
    customer_id: null,
    start_at: null,
    end_at: null,
    time: []
  }
  export default {
    name: 'taskAllot',
    data() {
      return {
        list: {
          flowArr: {},
          statusArr: {}
        },
        dialogVisible: false,
        loading: {
          customers: false,
          users: false
        },
        customers: {},
        ruleForm: Object.assign({}, defaultRuleForm),
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    mounted() {
      this.fetchChart()
      this.fetchChartPlan()
      this.fetchTotal()
    },
    methods: {
      fetchTotal() {
        return getTotal(this.ruleForm).then(res => {
          this.list = res.data
          console.log(res)
        })
      },
      fetchChart() {
        this.fetchTotal().then(() => {
          const projectArr = []
          for (const x in this.list.flowArr) {
            projectArr.push(parseInt(this.list.flowArr[x]))
          }
          const myChart = echarts.init(document.getElementById('circle'))
          // 指定图表的配置项和数据
          const option = {
            title: {
              text: '项目类型'
            },
            tooltip: {},
            legend: {
              data: ['项目数量']
            },
            xAxis: {
              data: ['配电', '迁改', '配网', '用电安全']
            },
            yAxis: {},
            series: [{
              name: '项目数量',
              type: 'bar',
              label: {
                normal: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: 'black'
                  }
                }
              },
              data: projectArr
            }]
          }
          myChart.setOption(option)
        })
      },
      fetchChartPlan() {
        this.fetchTotal().then(() => {
          const stateArr = []
          for (const x in this.list.statusArr) {
            stateArr.push(parseInt(this.list.statusArr[x]))
          }
          const myChart = echarts.init(document.getElementById('status'))
          // 指定图表的配置项和数据
          const option = {
            title: {
              text: '完成状态'
            },
            tooltip: {},
            legend: {
              data: ['项目数量']
            },
            xAxis: {
              data: ['进行中', '已完成', '过期']
            },
            yAxis: {},
            series: [{
              name: '项目数量',
              type: 'bar',
              label: {
                normal: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: 'black'
                  }
                }
              },
              data: stateArr
            }]
          }
          myChart.setOption(option)
        })
      },
      /** 远程搜索客户列表方法 */
      remoteMethod(query) {
        this.loading.customers = true
        let params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getCustomers(params).then(res => {
          this.customers = res.data._items
          this.loading.customers = false
        })
      },
      onSubmitForm() {
        if (this.searchForm.time !== null && this.searchForm.time.length > 0) {
          this.searchForm.start_at = this.searchForm.time[0]
          this.searchForm.end_at = this.searchForm.time[1]
        } else {
          this.searchForm.start_at = null
          this.searchForm.end_at = null
        }
        this.fetchTotal()
        this.fetchChart()
        this.fetchChartPlan()
      }
    },
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_productTotal_HJ#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style scoped>

</style>
