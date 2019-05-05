import request from '../utils/request'

export function getThemes(params) {
  params.expand = 'user'
  return request({
    url: '/theme/index',
    method: 'get',
    params: params
  })
}

export function getTheme(params = {}) {
  params.expand = 'user'
  return request({
    url: '/theme/view',
    method: 'get',
    params: params
  })
}

export function createTheme(params) {
  return request({
    url: '/theme/create',
    method: 'post',
    data: params
  })
}

export function updateTheme(params) {
  return request({
    url: '/theme/update',
    method: 'post',
    data: params
  })
}

export function voting(params) {
  return request({
    url: '/theme/voting',
    method: 'post',
    data: params
  })
}
