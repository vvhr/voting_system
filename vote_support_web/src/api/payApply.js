import request from '@/utils/request'

export function getPayApplys(params) {
  return request({
    url: '/pay-apply/index',
    method: 'get',
    params: params
  })
}

export function getPayApply(params) {
  return request({
    url: '/pay-apply/view',
    method: 'get',
    params: params
  })
}

export function updatePayApply(data) {
  return request({
    url: '/pay-apply/update',
    method: 'post',
    data: data
  })
}

export function createPayApply(data) {
  return request({
    url: '/pay-apply/create',
    method: 'post',
    data: data
  })
}

export function getPayApplyTotal(params) {
  return request({
    url: '/pay-apply/total',
    method: 'get',
    params: params
  })
}

