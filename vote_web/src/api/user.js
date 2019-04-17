import request from '@/utils/fetch'

export function createUser (params) {
  return request({
    url: '/user-public/create',
    method: 'post',
    data: params
  })
}
