/** 本接口用于报销申请审批,审批流程,待审申请 */
import request from '../utils/request'

// 获取申请，模糊搜索
export function getApply(params = {}) {
  params.expand = 'cost_user_name,input_user_name,type_name,sbj_name,sbjR_name,project,group,financial,first,second,third,fourth'
  return request({
    url: '/cost-apply/index',
    method: 'get',
    params: params
  })
}

// 获取申请，非模糊搜索
export function getApply_(params = {}) {
  params.expand = 'cost_user_name,input_user_name,type_name,sbj_name,sbjR_name,project,group,financial,first,second,third,fourth'
  return request({
    url: '/cost-apply/view',
    method: 'get',
    params: params
  })
}

// 添加申请
export function createApply(params) {
  return request({
    url: '/cost-apply/create',
    method: 'post',
    data: params
  })
}

// 添加报销单
export function createRceipt(params) {
  return request({
    url: '/cost-apply/create-receipt',
    method: 'post',
    data: params
  })
}

// 批量添加申请
export function createApplyExcel(params) {
  return request({
    url: '/cost-apply/excel',
    method: 'post',
    data: params
  })
}

// 批量检查错误
export function checkApplyExcel(params) {
  return request({
    url: '/cost-apply/check',
    method: 'post',
    data: params
  })
}

// 修改申请
export function updateApply(params) {
  return request({
    url: '/cost-apply/update',
    method: 'post',
    data: params
  })
}

// 撤回申请
export function deleteApply(params) {
  return request({
    url: '/cost-apply/delete',
    method: 'post',
    data: params
  })
}

// 非财务审批
export function passApply(params) {
  return request({
    url: '/cost-apply/pass',
    method: 'post',
    data: params
  })
}

/** 审批流程 */
// 获取审批流程
export function getApproval(params = {}) {
  params.expand = 'first,second,third,fourth,branch'
  return request({
    url: '/cost-approval/index',
    method: 'get',
    params: params
  })
}

// 修改审批流程
export function updateApproval(params) {
  return request({
    url: '/cost-approval/update',
    method: 'post',
    data: params
  })
}

/** 待我审批*/
// 查询待我审批的申请 查询我已审批的申请 查询全部失败的申请 查询全部申请
export function getApproved(params = {}) {
  params.expand = 'cost_user_name,input_user_name,type_name,sbj_name,sbjR_name,project,group,financial,first,second,third,fourth'
  return request({
    url: '/cost-apply/approved',
    method: 'get',
    params: params
  })
}

/** 财务审批 */
// 查询待我审批的申请 查询我已审批的申请 查询全部失败的申请 查询全部申请
export function getFinance(params = {}) {
  params.expand = 'cost_user_name,input_user_name,type_name,sbj_name,sbjR_name,project,group,financial,payer,first,second,third,fourth'
  return request({
    url: '/cost-apply/finance',
    method: 'get',
    params: params
  })
}

// 财务审批申请
export function payApply(params) {
  return request({
    url: '/cost-apply/pay',
    method: 'post',
    data: params
  })
}

//
export function createReceiptNo(params) {
  return request({
    url: '/cost-apply/create-receipt-no',
    method: 'post',
    data: params
  })
}

// 批量关联报销记录
export function associatedApply(params = {}) {
  return request({
    url: '/cost-apply/associated-apply',
    method: 'post',
    data: params
  })
}

// 批量修复数据
export function fixed(params = {}) {
  return request({
    url: '/cost-apply/fixed',
    method: 'post',
    data: params
  })
}

export function getApprovedTotal() {
  return request({
    url: '/cost-apply/approved-total',
    method: 'get'
  })
}

export function getFinanceTotal() {
  return request({
    url: '/cost-apply/finance-total',
    method: 'get'
  })
}
