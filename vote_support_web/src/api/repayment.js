import request from '@/utils/request'

// 查询我的ID
export function getRepayments(params = {}) {
  params.expand = 'repayUser'
  return request({
    url: '/repayment/index',
    method: 'get',
    params: params
  })
}

// (财务)直接创建还款记录
export function createRepayment(params) {
  return request({
    url: '/repayment/create',
    data: params,
    method: 'post'
  })
}

export function getOverages(params = {}) {
  params.expand = 'user'
  return request({
    url: '/repayment-overage/index',
    method: 'get',
    params: params
  })
}

export function createRepaymentOverage(params) {
  return request({
    url: '/repayment-overage/create',
    data: params,
    method: 'post'
  })
}
