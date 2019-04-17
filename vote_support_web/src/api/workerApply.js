import request from '@/utils/request'

export function getWorkerApplys(params) {
  return request({
    url: '/worker-apply/index',
    method: 'get',
    params: params
  })
}

export function getWorkerApply(params) {
  return request({
    url: '/worker-apply/view',
    method: 'get',
    params: params
  })
}

export function updateWorkerApply(data) {
  return request({
    url: '/worker-apply/update',
    method: 'post',
    data: data
  })
}

export function createWorkerApply(data) {
  return request({
    url: '/worker-apply/create',
    method: 'post',
    data: data
  })
}

export function getWorkerApplyTotal(params) {
  return request({
    url: '/worker-apply/total',
    method: 'get',
    params: params
  })
}

