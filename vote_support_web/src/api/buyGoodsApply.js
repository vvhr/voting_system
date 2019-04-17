import request from '@/utils/request'

export function getBuyGoodsApplys(params) {
  return request({
    url: '/buy-goods-apply/index',
    method: 'get',
    params: params
  })
}

export function getBuyGoodsApply(params) {
  return request({
    url: '/buy-goods-apply/view',
    method: 'get',
    params: params
  })
}

export function updateBuyGoodsApply(data) {
  return request({
    url: '/buy-goods-apply/update',
    method: 'post',
    data: data
  })
}

export function createBuyGoodsApply(data) {
  return request({
    url: '/buy-goods-apply/create',
    method: 'post',
    data: data
  })
}

export function TotalBuyGoodsApply(params) {
  return request({
    url: '/buy-goods-apply/total',
    method: 'get',
    params: params
  })
}

