import request from '@/utils/request'

export function getPriceForms(params) {
  return request({
    url: '/price-form/index',
    method: 'get',
    params: params
  })
}

export function getPriceForm(params) {
  return request({
    url: '/price-form/view',
    method: 'get',
    params: params
  })
}

export function updatePriceForm(data) {
  return request({
    url: '/price-form/update',
    method: 'post',
    data: data
  })
}

export function createPriceForm(data) {
  return request({
    url: '/price-form/create',
    method: 'post',
    data: data
  })
}

