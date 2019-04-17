import request from '@/utils/request'

// 获取所有分公司节点
export function getLaoWus(params) {
  params.expand = 'project'
  return request({
    url: '/lao-wu/index',
    method: 'get',
    params: params
  })
}

export function createLaoWu(data) {
  return request({
    url: '/lao-wu/create',
    method: 'post',
    data: data
  })
}

export function getLaoWu(params) {
  return request({
    url: '/lao-wu/view',
    method: 'get',
    params: params
  })
}

export function updateLaoWu(data) {
  return request({
    url: '/lao-wu/update',
    method: 'post',
    data: data
  })
}
