import request from '@/utils/request'

export function createChildFlowHistory(data) {
  return request({
    url: '/child-flow-history/create',
    method: 'post',
    data: data
  })
}

export function indexChildFlowHistory(params) {
  return request({
    url: '/child-flow-history/index',
    method: 'post',
    params: params
  })
}
