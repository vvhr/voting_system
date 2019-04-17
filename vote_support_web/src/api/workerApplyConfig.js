import request from '@/utils/request'

export function getWorkerApplysConfig(params) {
  return request({
    url: '/worker-apply-config/index',
    method: 'get',
    params: params
  })
}

export function getWorkerApplyConfig(params) {
  return request({
    url: '/worker-apply-config/view',
    method: 'get',
    params: params
  })
}

export function updateWorkerApplyConfig(data) {
  return request({
    url: '/worker-apply-config/update',
    method: 'post',
    data: data
  })
}

export function createWorkerApplyConfig(data) {
  return request({
    url: '/worker-apply-config/create',
    method: 'post',
    data: data
  })
}

