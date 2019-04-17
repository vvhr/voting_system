import { asyncRouterMap, constantRouterMap } from '@/router'
import store from '../../store'
// /**
//  * 通过meta.role判断是否与当前用户权限匹配
//  * @param roles
//  * @param route
//  */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.indexOf(role) >= 0)
//   } else {
//     return true
//   }
// }

// /**
//  * 递归过滤异步路由表，返回符合用户角色权限的路由表
//  * @param asyncRouterMap
//  * @param roles
//  */
// function filterAsyncRouter(asyncRouterMap, roles) {
//   const accessedRouters = asyncRouterMap.filter(route => {
//     if (hasPermission(roles, route)) {
//       if (route.children && route.children.length) {
//         route.children = filterAsyncRouter(route.children, roles)
//       }
//       return true
//     }
//     return false
//   })
//   return accessedRouters
// }

// 遍历asyncRouterMap路由表，若用户无该页面的权限，则替换掉hidden属性的值为false，若用户无权限，则替换为true
function dgDelete(arr) {
  arr.forEach((v0, k0) => {
    for (const key in v0) {
      if (v0[key] instanceof Array) {
        dgDelete(v0[key])
      } else {
        /** 经营管理 */
        if (v0[key] === 'read_project#') v0[key] = permission.state.routerHidden.read_project
        if (v0[key] === 'read_contract#') v0[key] = permission.state.routerHidden.read_contract
        if (v0[key] === 'read_pageInvoice#') v0[key] = permission.state.routerHidden.read_pageInvoice
        if (v0[key] === 'read_receipt#') v0[key] = permission.state.routerHidden.read_receipt
        if (v0[key] === 'read_customer#') v0[key] = permission.state.routerHidden.read_customer
        if (v0[key] === 'read_projectRecover#') v0[key] = permission.state.routerHidden.read_projectRecover
        if (v0[key] === 'read_laoWuHistory#') v0[key] = permission.state.routerHidden.read_laoWuHistory
        /** 系统设置 */
        if (v0[key] === 'read_accessStuffs#') v0[key] = permission.state.routerHidden.read_accessStuffs
        if (v0[key] === 'read_accessGroup#') v0[key] = permission.state.routerHidden.read_accessGroup
        if (v0[key] === 'read_department#') v0[key] = permission.state.routerHidden.read_department
        if (v0[key] === 'read_user#') v0[key] = permission.state.routerHidden.read_user
        /** 项目核算 */
        if (v0[key] === 'read_costAccounts#') v0[key] = permission.state.routerHidden.read_costAccounts
        if (v0[key] === 'read_profitAccounts#') v0[key] = permission.state.routerHidden.read_profitAccounts
        if (v0[key] === 'read_outputAccounts#') v0[key] = permission.state.routerHidden.read_outputAccounts
        if (v0[key] === 'read_pageDepartmentAccounts#') v0[key] = permission.state.routerHidden.read_pageDepartmentAccounts
        /** 综合行政 */
        if (v0[key] === 'read_applyManage_pageApplyAll#') v0[key] = permission.state.routerHidden.read_applyManage_pageApplyAll
        if (v0[key] === 'read_pageApprovalProcess#') v0[key] = permission.state.routerHidden.read_pageApprovalProcess
        // 财务中心
        if (v0[key] === 'read_Financial_pageApplyAll#') v0[key] = permission.state.routerHidden.read_Financial_pageApplyAll
        if (v0[key] === 'read_Financial_pageProofCreate#') v0[key] = permission.state.routerHidden.read_Financial_pageProofCreate
        if (v0[key] === 'read_pageInvoiceApply#') v0[key] = permission.state.routerHidden.read_pageInvoiceApply
        if (v0[key] === 'read_pageReceiptConfirmation#') v0[key] = permission.state.routerHidden.read_pageReceiptConfirmation
        if (v0[key] === 'read_pageBankFlow#') v0[key] = permission.state.routerHidden.read_pageBankFlow
        if (v0[key] === 'read_pageReceivable#') v0[key] = permission.state.routerHidden.read_pageReceivable
        if (v0[key] === 'read_pageSummary#') v0[key] = permission.state.routerHidden.read_pageSummary
        // 报销审批
        if (v0[key] === 'read_groupCost#') v0[key] = permission.state.routerHidden.read_groupCost
        if (v0[key] === 'read_generalCost#') v0[key] = permission.state.routerHidden.read_generalCost
        if (v0[key] === 'read_basicCost#') v0[key] = permission.state.routerHidden.read_basicCost
        if (v0[key] === 'read_goodsCost#') v0[key] = permission.state.routerHidden.read_goodsCost
        if (v0[key] === 'read_sbjType#') v0[key] = permission.state.routerHidden.read_sbjType
        if (v0[key] === 'read_carManage#') v0[key] = permission.state.routerHidden.read_carManage
        /** 富华 */
        if (v0[key] === 'read_taskAllot_FH#') v0[key] = permission.state.routerHidden.read_taskAllot_FH
        if (v0[key] === 'read_evolve_FH#') v0[key] = permission.state.routerHidden.read_evolve_FH
        if (v0[key] === 'read_laoWu_FH#') v0[key] = permission.state.routerHidden.read_laoWu_FH
        /** 华建 */
        if (v0[key] === 'read_taskAllot_HJ#') v0[key] = permission.state.routerHidden.read_taskAllot_HJ
        if (v0[key] === 'read_productTotal_HJ#') v0[key] = permission.state.routerHidden.read_productTotal_HJ
        if (v0[key] === 'read_evolve_HJ#') v0[key] = permission.state.routerHidden.read_evolve_HJ
        if (v0[key] === 'read_report_HJ#') v0[key] = permission.state.routerHidden.read_report_HJ
        /** 源通 */
        if (v0[key] === 'read_taskAllot_YT#') v0[key] = permission.state.routerHidden.read_taskAllot_YT
        if (v0[key] === 'read_evolve_YT#') v0[key] = permission.state.routerHidden.read_evolve_YT
        if (v0[key] === 'read_laoWu_YT#') v0[key] = permission.state.routerHidden.read_laoWu_YT
        if (v0[key] === 'read_goodsCost_YT#') v0[key] = permission.state.routerHidden.read_goodsCost_YT
      }
    }
  })
}

// 检查myAccess（用户权限字符串）里是否含有某个页面的访问权限。
function accessCheck(myAccess) {
  /** 经营管理 */
  if (accessHave(myAccess, 'read_project#') === true) permission.state.routerHidden.read_project = false
  if (accessHave(myAccess, 'read_contract#') === true) permission.state.routerHidden.read_contract = false
  if (accessHave(myAccess, 'read_pageInvoice#') === true) permission.state.routerHidden.read_pageInvoice = false
  if (accessHave(myAccess, 'read_receipt#') === true) permission.state.routerHidden.read_receipt = false
  if (accessHave(myAccess, 'read_customer#') === true) permission.state.routerHidden.read_customer = false
  if (accessHave(myAccess, 'read_projectRecover#') === true) permission.state.routerHidden.read_projectRecover = false
  if (accessHave(myAccess, 'read_laoWuHistory#') === true) permission.state.routerHidden.read_laoWuHistory = false
  /** 系统设置 */
  if (accessHave(myAccess, 'read_accessStuffs#') === true) permission.state.routerHidden.read_accessStuffs = false
  if (accessHave(myAccess, 'read_accessGroup#') === true) permission.state.routerHidden.read_accessGroup = false
  if (accessHave(myAccess, 'read_department#') === true) permission.state.routerHidden.read_department = false
  if (accessHave(myAccess, 'read_user#') === true) permission.state.routerHidden.read_user = false
  /** 项目核算 */
  if (accessHave(myAccess, 'read_costAccounts#') === true) permission.state.routerHidden.read_costAccounts = false
  if (accessHave(myAccess, 'read_profitAccounts#') === true) permission.state.routerHidden.read_profitAccounts = false
  if (accessHave(myAccess, 'read_outputAccounts#') === true) permission.state.routerHidden.read_outputAccounts = false
  if (accessHave(myAccess, 'read_pageDepartmentAccounts#') === true) permission.state.routerHidden.read_pageDepartmentAccounts = false
  /** 综合行政 */
  if (accessHave(myAccess, 'read_applyManage_pageApplyAll#') === true) permission.state.routerHidden.read_applyManage_pageApplyAll = false
  if (accessHave(myAccess, 'read_pageApprovalProcess#') === true) permission.state.routerHidden.read_pageApprovalProcess = false
  // 财务中心
  if (accessHave(myAccess, 'read_Financial_pageApplyAll#') === true) permission.state.routerHidden.read_Financial_pageApplyAll = false
  if (accessHave(myAccess, 'read_Financial_pageProofCreate#') === true) permission.state.routerHidden.read_Financial_pageProofCreate = false
  if (accessHave(myAccess, 'read_pageInvoiceApply#') === true) permission.state.routerHidden.read_pageInvoiceApply = false
  if (accessHave(myAccess, 'read_pageReceiptConfirmation#') === true) permission.state.routerHidden.read_pageReceiptConfirmation = false
  if (accessHave(myAccess, 'read_pageBankFlow#') === true) permission.state.routerHidden.read_pageBankFlow = false
  if (accessHave(myAccess, 'read_pageReceivable#') === true) permission.state.routerHidden.read_pageReceivable = false
  if (accessHave(myAccess, 'read_pageSummary#') === true) permission.state.routerHidden.read_pageSummary = false
  // 报销审批
  if (accessHave(myAccess, 'read_groupCost#') === true) permission.state.routerHidden.read_groupCost = false
  if (accessHave(myAccess, 'read_generalCost#') === true) permission.state.routerHidden.read_generalCost = false
  if (accessHave(myAccess, 'read_basicCost#') === true) permission.state.routerHidden.read_basicCost = false
  if (accessHave(myAccess, 'read_goodsCost#') === true) permission.state.routerHidden.read_goodsCost = false
  if (accessHave(myAccess, 'read_sbjType#') === true) permission.state.routerHidden.read_sbjType = false
  if (accessHave(myAccess, 'read_carManage#') === true) permission.state.routerHidden.read_carManage = false
  /** 富华 */
  if (accessHave(myAccess, 'read_taskAllot_FH#') === true) permission.state.routerHidden.read_taskAllot_FH = false
  if (accessHave(myAccess, 'read_evolve_FH#') === true) permission.state.routerHidden.read_evolve_FH = false
  if (accessHave(myAccess, 'read_laoWu_FH#') === true) permission.state.routerHidden.read_laoWu_FH = false
  /** 华建 */
  if (accessHave(myAccess, 'read_taskAllot_HJ#') === true) permission.state.routerHidden.read_taskAllot_HJ = false
  if (accessHave(myAccess, 'read_productTotal_HJ#') === true) permission.state.routerHidden.read_productTotal_HJ = false
  if (accessHave(myAccess, 'read_evolve_HJ#') === true) permission.state.routerHidden.read_evolve_HJ = false
  if (accessHave(myAccess, 'read_report_HJ#') === true) permission.state.routerHidden.read_report_HJ = false
  /** 源通 */
  if (accessHave(myAccess, 'read_taskAllot_YT#') === true) permission.state.routerHidden.read_taskAllot_YT = false
  if (accessHave(myAccess, 'read_evolve_YT#') === true) permission.state.routerHidden.read_evolve_YT = false
  if (accessHave(myAccess, 'read_laoWu_YT#') === true) permission.state.routerHidden.read_laoWu_YT = false
  if (accessHave(myAccess, 'read_goodsCost_YT#') === true) permission.state.routerHidden.read_goodsCost_YT = false
  // console.log(permission.state.routerHidden)
}

// 检查某一个权限字段是否存在
function accessHave(access, name) {
  if (isEmpty(access) === false) {
    const str = (access).toString()
    return str.indexOf(name) > -1
  } else return false
}

// 判断字符串是否为空
function isEmpty(obj) {
  return typeof obj === 'undefined' || obj == null || obj === ''
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    myAccess: '', // 存储myAccessG，供其他局部方法使用
    routerHidden: {
      /** 项目核算 */
      read_costAccounts: true,
      read_profitAccounts: true,
      read_outputAccounts: true,
      read_pageDepartmentAccounts: true,
      /** 综合 */
      read_applyManage_pageApplyAll: true,
      read_pageApprovalProcess: true,
      // 财务中心
      read_Financial_pageApplyAll: true,
      read_Financial_pageProofCreate: true,
      read_pageInvoiceApply: true,
      read_pageReceiptConfirmation: true,
      read_pageBankFlow: true,
      read_pageReceivable: true,
      read_pageSummary: true,
      // 报销审批
      read_groupCost: true,
      read_generalCost: true,
      read_basicCost: true,
      read_goodsCost: true,
      read_sbjType: true,
      read_carManage: true,
      /** 系统设置 */
      read_accessStuffs: true,
      read_accessGroup: true,
      read_department: true,
      read_user: true,
      /** 经营管理 */
      read_project: true,
      read_contract: true,
      read_receipt: true,
      read_pageInvoice: true,
      read_customer: true,
      read_projectRecover: true,
      read_laoWuHistory: true,
      /** 富华 */
      read_taskAllot_FH: true,
      read_evolve_FH: true,
      read_laoWu_FH: true,
      /** 华建 */
      read_taskAllot_HJ: true,
      read_productTotal_HJ: true,
      read_evolve_HJ: true,
      read_report_HJ: true,
      /** 源通 */
      read_taskAllot_YT: true,
      read_evolve_YT: true,
      read_laoWu_YT: true,
      read_goodsCost_YT: true,
      /** 父级路由 （父级路由并不存储在数据库中，而是通过判断其子页面是否有访问权限）目前已停摆,待完成*/
      father_costsManage: true, // 报销审批父级路由
      father_applyManage: true, // 审批管理父级路由
      father_financialApproval: true // 财务审批父级路由
    } // 初始化后，供存储被解析拆分开后的用户权限对象
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        // 因为无法直接引用store.getters.myAccessG全局参数，因此先创建一个局部变量 myAccess来存储。
        this.myAccess = store.getters.myAccessG
        // 权限解析
        setTimeout(accessCheck(this.myAccess), 3000)
        // 修改路由表
        dgDelete(asyncRouterMap)
        // 设置用户可访问的路由表
        commit('SET_ROUTERS', asyncRouterMap)
        resolve()
      }).catch(error => {
        console.log(error)
      })
    }
  }
}

export default permission

