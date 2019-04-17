import request from '@/utils/request'

export function getGoods(params) {
  return request({
    url: '/goods/index',
    method: 'get',
    params: params
  })
}

export function getGood(params) {
  return request({
    url: '/goods/view',
    method: 'get',
    params: params
  })
}

export function updateGoods(data) {
  return request({
    url: '/goods/update',
    method: 'post',
    data: data
  })
}

export function createGoods(data) {
  return request({
    url: '/goods/create',
    method: 'post',
    data: data
  })
}

