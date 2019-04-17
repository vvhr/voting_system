import request from '@/utils/request'

// 获取所有分公司节点
export function createFlowType(params) {
  return request({
    url: '/flow-type/create',
    method: 'post',
    data: params
  })
}

export function viewsFlowType(params) {
  return request({
    url: '/flow-type/views',
    method: 'get',
    params: params
  })
}

export function updateFlowType(params) {
  return request({
    url: '/flow-type/update',
    method: 'post',
    data: params
  })
}

