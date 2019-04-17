import request from '@/utils/request'

export function getBuyGoodsConfigs(params) {
  return request({
    url: '/buy-goods-config/index',
    method: 'get',
    params: params
  })
}

export function getBuyGoodsConfig(params) {
  return request({
    url: '/buy-goods-config/view',
    method: 'get',
    params: params
  })
}

export function updateBuyGoodsConfig(data) {
  return request({
    url: '/buy-goods-config/update',
    method: 'post',
    data: data
  })
}

export function createBuyGoodsConfig(data) {
  return request({
    url: '/buy-goods-config/create',
    method: 'post',
    data: data
  })
}

