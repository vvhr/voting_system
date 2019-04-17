import request from '@/utils/request'

export function getSources(params = {}) {
  params.expand = 'branch_name,user_name'
  return request({
    url: '/source/index',
    method: 'get',
    params: params
  })
}

export function createSource(params) {
  return request({
    url: '/source/create',
    method: 'post',
    data: params
  })
}

export function viewSource(id) {
  return request({
    url: '/source/view',
    method: 'get',
    params: { id: id }
  })
}

export function updateSource(params) {
  return request({
    url: '/source/update',
    method: 'post',
    data: params
  })
}

export function deleteSource(id) {
  return request({
    url: '/source/delete',
    method: 'post',
    data: { id: id }
  })
}
