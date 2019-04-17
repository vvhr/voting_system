import request from '@/utils/request'

export function getWorkerGroups(params) {
  return request({
    url: '/worker-group/index',
    method: 'get',
    params: params
  })
}

export function getWorkerGroup(params) {
  return request({
    url: '/worker-group/view',
    method: 'get',
    params: params
  })
}

export function updateWorkerGroup(data) {
  return request({
    url: '/worker-group/update',
    method: 'post',
    data: data
  })
}

export function createWorkeGroup(data) {
  return request({
    url: '/worker-group/create',
    method: 'post',
    data: data
  })
}

