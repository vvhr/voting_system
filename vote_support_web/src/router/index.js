import Vue from 'vue'
import Router from 'vue-router'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import ChildLayout from '../views/product/index'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/home/index')
    }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/vote',
    name: 'vote',
    component: () => import('@/views/vote'),
    meta: { title: '投票页', icon: 'home', roles: ['ghost'] }
  },
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'HomeIndex',
        component: () => import('@/views/home/index'),
        meta: { title: '首页', icon: 'home' }
      }
    ]
  },
  {
    path: '/home',
    component: Layout,
    meta: { title: '会议系统', icon: 'meeting' },
    children: [
      {
        path: 'task-graphic',
        name: 'HomeTaskGraphic',
        component: () => import('@/views/home/taskGraphic'),
        meta: { title: '任务面板', icon: 'task' }
      },
      {
        path: 'my-task',
        name: 'HomeMyTask',
        component: () => import('@/views/home/myTask'),
        meta: { title: '我的任务', icon: 'myTask' }
      },
      {
        path: 'all-task',
        name: 'HomeAllTask',
        component: () => import('@/views/home/allTask'),
        meta: { title: '全部任务', icon: 'allTask' }
      },
      {
        path: 'source',
        name: 'HomeSource',
        component: () => import('@/views/home/source'),
        meta: { title: '会议记录', icon: 'meetingNote' }
      },
      {
        path: 'task',
        name: 'HomeTask',
        component: () => import('@/views/home/task'),
        meta: { title: '任务分配', icon: 'taskAllot' }
      }
    ]
  },
  {
    path: '/market',
    component: Layout,
    name: 'market',
    meta: { title: '经营管理', icon: 'operating' },
    alwaysShow: true,
    children: [
      {
        path: 'myTask',
        name: 'marketMyTask',
        // hidden: true,
        component: () => import('@/views/market/myTask'),
        meta: { title: '我的任务', icon: 'project' }
      },
      {
        path: 'project',
        name: 'marketProject',
        hidden: 'read_project#',
        component: () => import('@/views/market/project'),
        meta: { title: '项目管理', icon: 'project' }
      },
      {
        path: 'sign',
        name: 'marketSign',
        hidden: 'read_contract#',
        component: () => import('@/views/market/sign'),
        meta: { title: '合同管理', icon: 'sign' }
      },
      {
        path: 'marketInvoice',
        name: 'marketInvoice',
        hidden: 'read_pageInvoice#',
        component: () => import('@/views/market/invoice'),
        meta: { title: '开票管理', icon: 'sign' }
      },
      {
        path: 'contract',
        name: 'marketContract',
        hidden: 'read_receipt#',
        component: () => import('@/views/market/contract'),
        meta: { title: '收款管理', icon: 'receipt' }
      },
      {
        path: 'receival',
        name: 'marketReceival',
        hidden: 'read_receipt#',
        component: () => import('@/views/market/receival'),
        meta: { title: '收款记录', icon: 'receipt_02' }
      },
      {
        path: 'price',
        name: 'marketPrice',
        component: () => import('@/views/market/demo'),
        meta: { title: '商务报价', icon: 'money' }
      },
      {
        path: 'customer',
        name: 'marketCustomer',
        hidden: 'read_customer#',
        component: () => import('@/views/market/customer'),
        meta: { title: '客户关系', icon: 'customer' }
      },
      {
        path: 'projectRecover',
        name: 'marketProjectRecover',
        hidden: 'read_projectRecover#',
        component: () => import('@/views/market/projectRecover'),
        meta: { title: '项目回收', icon: 'recover' }
      },
      {
        path: 'laoWuHistory',
        name: 'marketLaoWuHistory',
        hidden: 'read_laoWuHistory#',
        component: () => import('@/views/market/laoWuHistory'),
        meta: { title: '结算记录', icon: 'cost_06' }
      },
      {
        path: 'cooperator',
        name: 'marketCooperator',
        component: () => import('@/views/market/demo'),
        meta: { title: '合作单位', icon: 'Co' }
      }
    ]
  },
  {
    path: '/accounts',
    component: Layout,
    meta: { title: '项目核算', icon: 'accounts4' },
    alwaysShow: true,
    children: [
      {
        path: 'costAccounts',
        name: 'costAccounts',
        hidden: 'read_costAccounts#',
        component: () => import('@/views/accounts/costAccounts'),
        meta: { title: '成本核算', icon: 'accounts1' }
      },
      {
        path: 'profitAccounts',
        name: 'profitAccounts',
        hidden: 'read_profitAccounts#',
        component: () => import('@/views/accounts/profitAccounts'),
        meta: { title: '利润核算', icon: 'accounts2' }
      },
      {
        path: 'outputAccounts',
        name: 'outputAccounts',
        hidden: 'read_outputAccounts#',
        component: () => import('@/views/accounts/outputAccounts'),
        meta: { title: '产值核算', icon: 'accounts3' }
      },
      {
        path: 'departmentAccounts',
        name: 'departmentAccounts',
        hidden: 'read_pageDepartmentAccounts#',
        component: () => import('@/views/accounts/departmentAccounts'),
        meta: { title: '部门统计', icon: 'accounts3' }
      },
      {
        path: 'subjectAccounts',
        name: 'subjectAccounts',
        hidden: 'read_pageDepartmentAccounts#',
        component: () => import('@/views/accounts/subjectAccounts'),
        meta: { title: '科目核算', icon: 'accounts3' }
      }

    ]
  },
  {
    path: '/product',
    component: Layout,
    meta: { title: '生产管理', icon: 'produce' },
    alwaysShow: true,
    children: [
      {
        path: '/productApproval',
        name: 'productApproval',
        component: ChildLayout,
        meta: { title: '用工申请', icon: 'tree' },
        alwaysShow: true,
        children: [
          {
            path: 'myApproval',
            name: 'MyApproval',
            component: () => import('@/views/product/productApproval/myApproval'),
            meta: { title: '我的申请', icon: 'tree' }
          },
          {
            path: 'employmentApplication',
            name: 'EmploymentApplication',
            component: () => import('@/views/product/productApproval/EmploymentApplication'),
            meta: { title: '用工审批', icon: 'tree' }
          },
          {
            path: 'payment',
            name: 'Payment',
            component: () => import('@/views/product/productApproval/payment'),
            meta: { title: '付款审批', icon: 'tree' }
          },
          {
            path: 'approvalSet',
            name: 'ApprovalSet',
            component: () => import('@/views/product/productApproval/approvalSet'),
            meta: { title: '审批设置', icon: 'tree' }
          },
          {
            path: 'worker',
            name: 'Worker',
            component: () => import('@/views/product/productApproval/worker'),
            meta: { title: '工人管理', icon: 'tree' }
          }
        ]
      },
      {
        path: '/fuHua',
        name: 'FuHua',
        component: ChildLayout,
        meta: { title: '富华电力', icon: 'fuhua' },
        alwaysShow: true,
        children: [
          {
            path: 'myTask',
            name: 'fuHuaMyTask',
            component: () => import('@/views/product/fuHua/myTask'),
            meta: { title: '我的任务', icon: 'tree' }
          },
          {
            path: 'taskAllot',
            name: 'fuHuaTaskAllot',
            hidden: 'read_taskAllot_FH#',
            component: () => import('@/views/product/fuHua/taskAllot'),
            meta: { title: '任务分配', icon: 'tree' }
          },
          {
            path: 'evolve',
            name: 'fuHuaEvolve',
            hidden: 'read_evolve_FH#',
            component: () => import('@/views/product/fuHua/evolve'),
            meta: { title: '项目进度', icon: 'tree' }
          },
          {
            path: 'laoWu',
            name: 'fuHuaLaoWu',
            hidden: 'read_laoWu_FH#',
            component: () => import('@/views/product/fuHua/laoWu'),
            meta: { title: '结算中心', icon: 'tree' }
          }
        ]
      },
      {
        path: '/huaJian',
        name: 'HuaJian',
        component: ChildLayout,
        meta: { title: '华建电力', icon: 'huajian' },
        alwaysShow: true,
        children: [
          {
            path: 'myTask',
            name: 'HuaJianMyTask',
            component: () => import('@/views/product/huaJian/myTask'),
            meta: { title: '我的任务', icon: 'tree' }
          },
          {
            path: 'taskAllot',
            name: 'HuaJianTaskAllot',
            hidden: 'read_taskAllot_HJ#',
            component: () => import('@/views/product/huaJian/taskAllot'),
            meta: { title: '任务分配', icon: 'tree' }
          },
          {
            path: 'productTotal',
            name: 'HuaJianProductTotal',
            hidden: 'read_productTotal_HJ#',
            component: () => import('@/views/product/huaJian/productTotal'),
            meta: { title: '项目统计', icon: 'tree' }
          },
          {
            path: 'evolve',
            name: 'HuaJianEvolve',
            hidden: 'read_evolve_HJ#',
            component: () => import('@/views/product/huaJian/evolve'),
            meta: { title: '工程造价', icon: 'tree' }
          },
          {
            path: 'laoWu',
            name: 'HuJianLaoWulaoWu',
            hidden: 'read_evolve_HJ#',
            component: () => import('@/views/product/huaJian/laoWu'),
            meta: { title: '结算中心', icon: 'tree' }
          },
          {
            path: 'report',
            name: 'HuaJianReport',
            hidden: 'read_report_HJ#',
            component: () => import('@/views/product/huaJian/report'),
            meta: { title: '项目报表', icon: 'tree' }
          }
        ]
      },
      {
        path: '/yuanTong',
        name: 'yuanTong',
        component: ChildLayout,
        meta: { title: '源通电力', icon: 'yuantong' },
        alwaysShow: true,
        children: [
          {
            path: 'myTask',
            name: 'yuanTongMyTask',
            hidden: false,
            component: () => import('@/views/product/yuanTong/myTask'),
            meta: { title: '我的任务', icon: 'tree' }
          },
          {
            path: 'taskAllot',
            name: 'yuanTongTaskAllot',
            hidden: 'read_taskAllot_YT#',
            component: () => import('@/views/product/yuanTong/taskAllot'),
            meta: { title: '任务分配', icon: 'tree' }
          },
          {
            path: 'evolve',
            name: 'yuanTongEvolve',
            hidden: 'read_evolve_YT#',
            component: () => import('@/views/product/yuanTong/evolve'),
            meta: { title: '工程进度', icon: 'tree' }
          },
          {
            path: 'laoWu',
            name: 'yuanTongLaoWu',
            hidden: 'read_laoWu_YT#',
            component: () => import('@/views/product/yuanTong/laoWu'),
            meta: { title: '结算中心', icon: 'tree' }
          },
          {
            path: 'goodsCost_YT',
            name: 'goodsCost_YT',
            hidden: 'read_goodsCost_YT#',
            component: () => import('@/views/product/yuanTong/goodsCost'),
            meta: { title: '采购记录', icon: 'tree' }
          },
          {
            path: '/goodsPurchase',
            name: 'GoodsPurchase',
            hidden: 'read_goodsCost_YT#',
            component: ChildLayout,
            meta: { title: '物资采购', icon: 'tree' },
            children: [
              // {
              //   path: 'goods',
              //   name: 'Goods',
              //   hidden: 'read_goodsCost_YT#',
              //   component: () => import('../views/product/yuanTong/goodsPurchase/Goods'),
              //   meta: { title: '仓库管理', icon: 'tree' }
              // },
              // {
              //   path: 'getGoods',
              //   name: 'GetGoods',
              //   hidden: 'read_goodsCost_YT#',
              //   component: () => import('../views/product/yuanTong/goodsPurchase/getGoods'),
              //   meta: { title: '领料申请', icon: 'tree' }
              // },
              {
                path: 'goodsApproval',
                name: 'GoodsApproval',
                hidden: 'read_goodsCost_YT#',
                component: () => import('../views/product/yuanTong/goodsPurchase/goodsApproval'),
                meta: { title: '采购申请', icon: 'tree' }
              },
              {
                path: 'goodsBuy',
                name: 'GoodsBuy',
                hidden: 'read_goodsCost_YT#',
                component: () => import('../views/product/yuanTong/goodsPurchase/goodsBuy'),
                meta: { title: '采购审批', icon: 'tree' }
              },
              {
                path: 'approvalConfig',
                name: 'ApprovalConfig1',
                hidden: 'read_goodsCost_YT#',
                component: () => import('../views/product/yuanTong/goodsPurchase/approvalConfig'),
                meta: { title: '审批设置', icon: 'tree' }
              }
            ]
          }
        ]
      },
      {
        path: '/goodsManage',
        name: 'GoodsManage',
        component: ChildLayout,
        meta: { title: '仓库管理', icon: 'tree' },
        alwaysShow: true,
        children: [
          {
            path: 'goods',
            name: 'Goods',
            component: () => import('@/views/product/goodsManage/goods'),
            meta: { title: '仓库管理', icon: 'tree' }
          },
          {
            path: 'getGoods',
            name: 'GetGoods',
            component: () => import('@/views/product/goodsManage/getGoods'),
            meta: { title: '领料申请', icon: 'tree' }
          },
          {
            path: 'getGoodsApproval',
            name: 'GetGoodsApproval',
            component: () => import('@/views/product/goodsManage/getGoodsApproval'),
            meta: { title: '领料审核', icon: 'tree' }
          }
        ]
      }
    ]
  },
  {
    path: '/general',
    component: Layout,
    meta: { title: '综合行政', icon: 'administrative' },
    alwaysShow: true,
    children: [
      {
        path: '/costsManage',
        name: 'costsManage',
        component: ChildLayout,
        alwaysShow: true,
        // hidden: 'father_costsManage#',
        meta: { title: '报销审批', icon: 'tree' },
        children: [
          {
            path: 'myApply',
            name: 'myApply',
            hidden: false,
            component: () => import('../views/general/costsManage/myApply'),
            meta: { title: '我的申请', icon: 'tree' }
          },
          {
            path: 'applyAll',
            name: 'applyAll',
            hidden: 'read_applyManage_pageApplyAll#',
            component: () => import('../views/general/costsManage/applyAll'),
            meta: { title: '待审申请', icon: 'tree' }
          },
          {
            path: 'approvalProcess',
            name: 'approvalProcess',
            hidden: 'read_pageApprovalProcess#',
            component: () => import('../views/general/costsManage/approvalProcess'),
            meta: { title: '审核流程', icon: 'tree' }
          }
        ]
      },
      {
        path: '/financialCenter',
        name: 'financialCenter',
        component: ChildLayout,
        alwaysShow: true,
        // hidden: 'father_financialCenter#',
        meta: { title: '财务中心', icon: 'money' },
        children: [
          {
            path: '/financialExchanges',
            name: 'financialExchanges',
            component: ChildLayout,
            alwaysShow: true,
            // hidden: 'father_financialExchanges#',
            meta: { title: '金额往来', icon: 'money' },
            children: [
              {
                path: 'applyAll',
                name: 'applyAllFin',
                hidden: 'read_Financial_pageApplyAll#',
                component: () => import('../views/general/financialCenter/financialExchanges/applyAll'),
                meta: { title: '财务审批', icon: 'tree' }
              },
              {
                path: 'proofCreate',
                name: 'proofCreate',
                hidden: 'read_Financial_pageProofCreate#',
                component: () => import('../views/general/financialCenter/financialExchanges/proofCreate'),
                meta: { title: '凭证打款', icon: 'tree' }
              },
              {
                path: 'invoiceApply',
                name: 'invoiceApply',
                hidden: 'read_pageInvoiceApply#',
                component: () => import('../views/general/financialCenter/financialExchanges/invoiceApply'),
                meta: { title: '开票申请', icon: 'tree' }
              },
              {
                path: 'receiptConfirmation',
                name: 'receiptConfirmation',
                hidden: 'read_pageReceiptConfirmation#',
                component: () => import('../views/general/financialCenter/financialExchanges/receiptConfirmation'),
                meta: { title: '收款确认', icon: 'tree' }
              },
              {
                path: 'banksManage',
                name: 'banksManage',
                hidden: true,
                component: () => import('../views/general/financialCenter/financialExchanges/banksManage'),
                meta: { title: '银行管理', icon: 'tree' }
              }
            ]
          },
          {
            path: '/financialReport',
            name: 'financialReport',
            component: ChildLayout,
            alwaysShow: true,
            // hidden: true,
            meta: { title: '财务报表', icon: 'money' },
            children: [
              {
                path: 'bankFlow',
                name: 'bankFlow',
                hidden: 'read_pageBankFlow#',
                component: () => import('../views/general/financialCenter/financialReport/bankFlow'),
                meta: { title: '银行流水', icon: 'tree' }
              },
              {
                path: 'receivable',
                name: 'receivable',
                hidden: 'read_pageReceivable#',
                component: () => import('../views/general/financialCenter/financialReport/receivable'),
                meta: { title: '应收账款', icon: 'tree' }
              },
              {
                path: 'costSummary',
                name: 'costSummary',
                hidden: 'read_pageSummary#',
                component: () => import('../views/general/financialCenter/financialReport/costSummary'),
                meta: { title: '费用汇总', icon: 'tree' }
              }
            ]
          }
        ]
      },
      {
        path: '/generalCosts',
        name: 'generalCosts',
        component: ChildLayout,
        alwaysShow: true,
        meta: { title: '综合报销', icon: 'cost_01' },
        children: [
          {
            path: 'groupCost',
            name: 'groupCost',
            hidden: 'read_groupCost#',
            component: () => import('@/views/general/generalCosts/groupCost'),
            meta: { title: '报销分组', icon: 'group_01' }
          },
          {
            path: 'generalCost',
            name: 'generalCost',
            hidden: 'read_generalCost#',
            component: () => import('@/views/general/generalCosts/generalCost'),
            meta: { title: '报销记录', icon: 'cost_02' }
          }
        ]
      },
      {
        path: '/projectCosts',
        name: 'projectCosts',
        component: ChildLayout,
        alwaysShow: true,
        meta: { title: '项目报销', icon: 'cost_03' },
        children: [
          {
            path: 'basicCost',
            name: 'basicCost',
            hidden: 'read_basicCost#',
            component: () => import('@/views/general/projectCosts/basicCost'),
            meta: { title: '基础报销', icon: 'cost_05' }
          },
          {
            path: 'goodsCost',
            name: 'goodsCost',
            hidden: 'read_goodsCost#',
            component: () => import('@/views/general/projectCosts/goodsCost'),
            meta: { title: '物资采购', icon: 'cost_04' }
          }
        ]
      },
      {
        path: 'sbjType',
        name: 'sbjType',
        hidden: 'read_sbjType#',
        component: () => import('@/views/general/sbjType'),
        meta: { title: '报销科目', icon: 'subject' }
      },
      {
        path: 'carManage',
        name: 'carManage',
        hidden: 'read_carManage#',
        component: () => import('@/views/general/carManage'),
        meta: { title: '车辆管理', icon: 'car' }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    meta: { title: '系统设置', icon: 'setting' },
    alwaysShow: true,
    children: [
      {
        path: '/access',
        name: 'access',
        component: ChildLayout,
        alwaysShow: true,
        meta: { title: '权限管理', icon: 'access' },
        children: [
          {
            path: 'accessList',
            name: 'accessList',
            component: () => import('@/views/setting/access/accessList'),
            meta: { title: '权限列表', icon: 'accessList' }
          },
          {
            path: 'accessStuff',
            name: 'accessStuff',
            hidden: 'read_accessStuffs#',
            component: () => import('@/views/setting/access/accessStuff'),
            meta: { title: '员工权限', icon: 'accessStuffs' }
          },
          {
            path: 'accessGroup',
            name: 'accessGroup',
            hidden: 'read_accessGroup#',
            component: () => import('@/views/setting/access/accessGroup'),
            meta: { title: '权限分组', icon: 'accessGroup' }
          }
        ]
      },
      {
        path: 'password',
        name: 'SettingPassword',
        component: () => import('@/views/setting/password'),
        meta: { title: '更改密码', icon: 'password' }
      },
      {
        path: 'department',
        name: 'SettingDepartment',
        hidden: 'read_department#',
        component: () => import('@/views/setting/department'),
        meta: { title: '部门设置', icon: 'tree' }
      },
      {
        path: 'user',
        name: 'SettingUser',
        hidden: 'read_user#',
        component: () => import('@/views/setting/user'),
        meta: { title: '员工设置', icon: 'stuffs' }
      }
    ]
  },
  { path: '*', name: '404', redirect: '/404', hidden: true }
]
