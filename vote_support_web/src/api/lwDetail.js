import request from '@/utils/request'

// 获取所有分公司节点
export function getLwDetails(params) {
  params.expand = 'project, username'
  return request({
    url: '/lw-detail/index',
    method: 'get',
    params: params
  })
}

export function createLwDetail(data) {
  return request({
    url: '/lw-detail/create',
    method: 'post',
    data: data
  })
}

export function getLwDetail(params) {
  return request({
    url: '/lw-detail/view',
    method: 'get',
    params: params
  })
}

export function updateLwDetail(data) {
  return request({
    url: '/lw-detail/update',
    method: 'post',
    data: data
  })
}

export function MessageLwDetail(params) {
  return request({
    url: '/lw-detail/message',
    method: 'get',
    params: params
  })
}

// 批量关联报销记录
export function associatedApply() {
  return request({
    url: '/lw-detail/associated-apply',
    method: 'post'
  })
}
