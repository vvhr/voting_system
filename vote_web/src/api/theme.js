import request from '../utils/fetch'

export function getTheme (params = {}) {
  params.expand = 'user'
  return request({
    url: '/theme-public/view',
    method: 'get',
    params: params
  })
}

export function voting (params) {
  return request({
    url: '/theme-public/voting',
    method: 'post',
    data: params
  })
}
