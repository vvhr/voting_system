<template>
  <div class="app-container">
    <div>
      <el-button>全部任务</el-button>
      <el-button>已完成任务</el-button>
      <el-button>未完成务</el-button>
      <el-date-picker
        v-model="value7"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions">
      </el-date-picker>
    </div>
    <el-tree :data="node" :props="defaultProps" @node-click="handleNodeClick" lazy :load="loadSubNode" accordion>
      <div slot-scope="{ node, data }"  :key = "data.level+'-'+data.id">
        <!--data是一个节点对象-->
        <span>
          {{data.label}}
        </span>
        <!--当节点层级小于4时，为部门或公司或员工，显示作务数量-->
        <span v-if="data.level<4">
          <el-tag v-if="data.task_num.og!=='0'">
            正在执行： {{data.task_num.og}}
          </el-tag>
          <el-tag type="warning" v-if="data.task_num.we!=='0'">
            快过期 {{data.task_num.we}}
          </el-tag>
          <el-tag type="danger" v-if="data.task_num.ae!=='0'">
            已过期 {{data.task_num.ae}}
          </el-tag>
        </span>
        <!--当节点层级等于4时，为任务本身，显示任务剩余天数-->
        <span v-if="data.level==='4'">
          <el-tag>
            {{data.content}}
          </el-tag>
          <!--当剩余天大于3天时，为普通蓝色，否则，标签为红色-->
          <el-tag :type="data.day_remaining>3?'':(data.day_remaining<0?'danger':'warning')">
            {{(data.day_remaining>0?'剩余':'已过期') + Math.abs(data.day_remaining)}}天 | {{data.ended_at}} 到期
          </el-tag>
        </span>
        <!--当节点层级等于5时，为作务实施流程节点，显示完成内容，与创建时间-->
        <span v-if="data.level==='5'">
          <el-tag>
            {{data.content}}
          </el-tag>
          <el-tag>
            更新于{{data.updated_at}}
          </el-tag>
        </span>
      </div>
    </el-tree>
  </div>
</template>
<script>
  import { getRootNode, getLevel2Node, getLevel3Node, getLevel4Node, getLevel5Node } from '@/api/task'
  export default {
    data() {
      // og:on going task
      // we: will expired task
      // ae: already expired task
      // dayRemaining 任务剩余天数
      // 组件模板只是接收变量进行映射渲染。使用组件时，组件标签中的属性是父组件变量与子组件变量进行传递通信中的桥梁
      return {
        mockNode:
        [
          {
            level: 1,
            id: 1,
            label: '物联',
            task_num: {
              og: 100,
              we: 10,
              ae: 0
            },
            children:
            [
              {
                level: 2,
                id: 1,
                label: '综合部',
                task_num: {
                  og: 100,
                  we: 10,
                  ae: 0
                },
                children:
                [
                  {
                    level: 3,
                    id: 1,
                    label: '莫柳莹',
                    task_num: {
                      og: 100,
                      we: 10,
                      ae: 0
                    },
                    children:
                    [
                      {
                        level: 4,
                        id: 1,
                        label: '采购控测器',
                        day_remaining: 2,
                        children:
                        [
                          {
                            level: 5,
                            id: 1,
                            label: '》》',
                            content: '搜集了主要供应商名单',
                            created_at: '218-06-01'
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        node: [],
        // 此处配置在不用插槽时，默认渲染的字段
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        pickerOptions: {
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
        },
        value7: ''
      }
    },
    mounted() {
      this.initRootNode()
    },
    methods: {
      initRootNode() {
        getRootNode().then(res => {
          this.node = res.data
        })
      },
      // 懒加载数据的方法。赋给tree组件的load属性。同时tree组件的lazy要设置为true
      // 这是一个promise对象的回调方法
      loadSubNode(node, resolve) {
        if (node.level === 1) {
          getLevel2Node(node.data.id).then(res => {
            resolve(res.data)
          })
        } else if (node.level === 2) {
          getLevel3Node(node.data.id).then(res => {
            resolve(res.data)
          })
        } else if (node.level === 3) {
          getLevel4Node(node.data.id).then(res => {
            resolve(res.data)
          })
        } else if (node.level === 4) {
          getLevel5Node(node.data.id).then(res => {
            resolve(res.data)
          })
        } else {
          resolve([])
        }
      },
      // 事件回调传入的参数是当前点击的节点
      handleNodeClick(node) {
        console.log('handleNodeClick ')
      }
    }
  }
</script>

<style>
  .el-tree-node__content {
    margin: 10px;
  }
  .el-tag {
    padding: 0 10px;
    height: 25px;
    line-height: 25px;
  }
</style>
