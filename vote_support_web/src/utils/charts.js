import echarts from 'echarts'
// xAxis = [], series = [], legend = [], titleText = 'ECharts', el = 'chart'
export function drawChart(chartOptions) {
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(document.getElementById(chartOptions.el))
  // 绘制图表
  myChart.setOption({
    title: {
      text: chartOptions.titleText
    },
    tooltip: {},
    legend: {
      data: chartOptions.legend
    },
    xAxis: {
      data: chartOptions.xAxis
    },
    yAxis: {},
    series: chartOptions.series
  })
}
// titleText = 'PieCharts', legend = [], seriesCommentTitle = 'title', seriesData = [], el = 'chart'
export function drawPieChart(chartOptions) {
  const pieChart = echarts.init(document.getElementById(chartOptions.el))
  pieChart.setOption({
    title: {
      text: chartOptions.titleText,
      subtext: '占比',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: chartOptions.legend
    },
    series: [
      {
        name: chartOptions.seriesCommentTitle,
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: chartOptions.seriesData,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          normal: {
            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}次 {per|{d}%}  ',
            backgroundColor: '#eee',
            borderColor: '#aaa',
            borderWidth: 1,
            borderRadius: 4,
            rich: {
              a: {
                color: '#999',
                lineHeight: 22,
                align: 'center'
              },
              hr: {
                borderColor: '#aaa',
                width: '100%',
                borderWidth: 0.5,
                height: 0
              },
              b: {
                fontSize: 16,
                lineHeight: 33
              },
              per: {
                color: '#eee',
                backgroundColor: '#334455',
                padding: [2, 4],
                borderRadius: 2
              }
            }
          }
        }
      }
    ]
  })
}
