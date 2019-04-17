import request from '@/utils/request'

export function getTakeGoodsRelates(params) {
  return request({
    url: '/take-goods-relate/index',
    method: 'get',
    params: params
  })
}

export function getTakeGoodRelate(params) {
  return request({
    url: '/take-goods-relate/view',
    method: 'get',
    params: params
  })
}

export function updateTakeGoodsRelate(data) {
  return request({
    url: '/take-goods-relate/update',
    method: 'post',
    data: data
  })
}

export function createTakeGoodsRelate(data) {
  return request({
    url: '/take-goods-relate/create',
    method: 'post',
    data: data
  })
}

