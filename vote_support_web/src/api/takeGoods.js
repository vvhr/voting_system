import request from '@/utils/request'

export function getTakeGoods(params) {
  return request({
    url: '/take-goods/index',
    method: 'get',
    params: params
  })
}

export function getTakeGood(params) {
  return request({
    url: '/take-goods/view',
    method: 'get',
    params: params
  })
}

export function updateTakeGoods(data) {
  return request({
    url: '/take-goods/update',
    method: 'post',
    data: data
  })
}

export function createTakeGoods(data) {
  return request({
    url: '/take-goods/create',
    method: 'post',
    data: data
  })
}

