import request from '@/utils/request'

export function getWorkers(params) {
  return request({
    url: '/worker/index',
    method: 'get',
    params: params
  })
}

export function getWorker(params) {
  return request({
    url: '/worker/view',
    method: 'get',
    params: params
  })
}

export function updateWorker(data) {
  return request({
    url: '/worker/update',
    method: 'post',
    data: data
  })
}

export function createWorker(data) {
  return request({
    url: '/worker/create',
    method: 'post',
    data: data
  })
}

