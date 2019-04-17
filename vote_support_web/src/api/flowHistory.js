import request from '@/utils/request'

export function createFlowHistory(data) {
  return request({
    url: '/flow-history/create',
    method: 'post',
    data: data
  })
}

export function indexFlowHistory(params) {
  return request({
    url: '/flow-history/index',
    method: 'post',
    params: params
  })
}
