import request from '@/utils/request'

export function CreateReport(params) {
  return request({
    url: '/report/create',
    method: 'post',
    data: params
  })
}

export function IndexReport(params) {
  return request({
    url: '/report/index',
    method: 'get',
    params: params
  })
}

