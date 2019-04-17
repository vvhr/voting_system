/** 本接口用于开票系统 */
import request from '../utils/request'

// 获取某个项目的所有申请
export function getInvoice(params = {}) {
  params.expand = 'project,creater,approver,financial'
  return request({
    url: '/invoice/view',
    params: params,
    method: 'get'
  })
}

// 获取所有项目的所有申请
export function getInvoices(params = {}) {
  params.expand = 'project,creater,approver,financial'
  return request({
    url: '/invoice/index',
    params: params,
    method: 'get'
  })
}

// 创建申请
export function createInvoice(params) {
  return request({
    url: '/invoice/create',
    method: 'post',
    data: params
  })
}

// 修改申请
export function updateInvoice(params) {
  return request({
    url: '/invoice/update',
    method: 'post',
    data: params
  })
}

// clean-invoice
// 清理所有申请,重新计算已收款金额,已开票金额
export function cleanInvoice(params) {
  return request({
    url: '/invoice/clean-invoice',
    method: 'post',
    data: params
  })
}
