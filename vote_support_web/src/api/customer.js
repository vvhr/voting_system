import request from '../utils/request'

export function createCustomer(data) {
  return request({
    url: '/customer/create',
    method: 'post',
    data: data
  })
}
export function updateCustomer(data) {
  return request({
    url: '/customer/update',
    method: 'post',
    data: data
  })
}
export function getCustomers(params = {}) {
  return request({
    url: '/customer/index',
    method: 'get',
    params: params
  })
}

export function getCustomer(id) {
  return request({
    url: '/customer/view',
    method: 'get',
    params: { id: id }
  })
}

