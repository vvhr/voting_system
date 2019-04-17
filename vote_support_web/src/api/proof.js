/** 本接口用于凭证生成页面 */
import request from '../utils/request'

export function getProof(params = {}) {
  params.expand = 'costApplys'
  return request({
    url: '/cost-proof/index',
    method: 'get',
    params: params
  })
}

export function getMax(params = {}) {
  return request({
    url: '/cost-proof/max',
    method: 'get',
    params: params
  })
}

export function getTotal() {
  return request({
    url: '/cost-proof/total',
    method: 'get'
  })
}

export function updateProof(params) {
  return request({
    url: '/cost-proof/update',
    data: params,
    method: 'post'
  })
}

export function payProof(params) {
  return request({
    url: '/cost-proof/pay',
    data: params,
    method: 'post'
  })
}

export function refuseProof(params) {
  return request({
    url: '/cost-proof/refuse',
    data: params,
    method: 'post'
  })
}

export function repayProof(params) {
  return request({
    url: '/cost-proof/repay',
    data: params,
    method: 'post'
  })
}

// 检索未生成凭证的已打款报销单,批量生成凭证
export function createProofBatch1(params) {
  return request({
    url: '/cost-proof/batch-create1',
    data: params,
    method: 'post'
  })
}

// 检索未生成凭证的待打款报销单,批量生成凭证
export function createProofBatch2(params) {
  return request({
    url: '/cost-proof/batch-create2',
    data: params,
    method: 'post'
  })
}

//  更新所有凭证下的申请的凭证号和打款时间
export function updateApplicationsOfAll() {
  return request({
    url: '/cost-proof/update-applications-of-all',
    method: 'post'
  })
}

//  更新所有凭证的报销人和申请人
export function updateCostUserAndInputUser() {
  return request({
    url: '/cost-proof/update-cost-user-of-proofs',
    method: 'post'
  })
}

