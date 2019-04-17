import request from '@/utils/request'

// 获取所有分公司节点
export function createChildFlow(params) {
  return request({
    url: '/child-flow/create',
    method: 'post',
    data: params
  })
}

export function viewChildFlow(params) {
  params.expand = 'project_child'
  return request({
    url: '/child-flow/view',
    method: 'get',
    params: params
  })
}
export function viewsChildFlow(params) {
  return request({
    url: '/child-flow/views',
    method: 'get',
    params: params
  })
}

export function indexChildFlow(params) {
  return request({
    url: '/child-flow/index',
    method: 'get',
    params: params
  })
}

export function updateChildFlow(params) {
  return request({
    url: '/child-flow/update',
    method: 'post',
    data: params
  })
}
