import request from '../utils/request'

export function createReceival(data) {
  const dataNew = Object.assign({}, data)
  dataNew.receive_date /= 1000
  return request({
    url: '/receival/create',
    method: 'post',
    data: dataNew
  })
}

// 创建收款申请
export function createReceipt_(params) {
  return request({
    url: '/receival/create_',
    method: 'post',
    data: params
  })
}
// 更新收款申请
export function updateReceipt_(params) {
  return request({
    url: '/receival/update_',
    method: 'post',
    data: params
  })
}

export function updateReceival(data) {
  return request({
    url: '/receival/update',
    method: 'post',
    data: data
  })
}

export function getReceivals(params = {}) {
  params.expand = 'project_name,inputUser,invoice'
  return request({
    url: '/receival/index',
    method: 'get',
    params: params
  })
}

export function getReceival(id) {
  return request({
    url: '/receival/view',
    method: 'get',
    params: { id: id }
  })
}
