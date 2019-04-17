import request from '@/utils/fetch'

export function getTest (params) {
  return request({
    url: '/user-public/test',
    method: 'get',
    params: params
  })
}
