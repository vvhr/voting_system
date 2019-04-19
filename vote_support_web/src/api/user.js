import request from '../utils/request'
import { _join } from '../utils/string'

export function getUsers(params) {
  const str = _join(params)
  return request({
    url: '/user/index?' + str,
    method: 'get'
  })
}

export function createUser(params) {
  return request({
    url: '/user/create',
    method: 'post',
    data: params
  })
}

export function updatePassword(params) {
  return request({
    url: '/user/update-password',
    method: 'post',
    data: params
  })
}

export function updateUser(params) {
  return request({
    url: '/user/update',
    method: 'post',
    data: params
  })
}

export function getView(params) {
  params.expand = 'department_name,department_branch'
  return request({
    url: '/user/view',
    method: 'get',
    params: params
  })
}
