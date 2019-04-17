import request from '../utils/request'

export function getProjectChild(params = {}) {
  params.expand = 'childFlow'
  return request({
    url: '/project-child/index',
    method: 'get',
    params: params
  })
}

export function getProjectChildId(params) {
  params.expand = 'childFlow'
  return request({
    url: '/project-child/view',
    method: 'get',
    params: params
  })
}

export function updateProjectChild(data) {
  return request({
    url: '/project-child/update',
    method: 'post',
    data: data
  })
}

export function createProjectChild(data) {
  return request({
    url: '/project-child/create',
    method: 'post',
    data: data
  })
}

export function taskProjectChild(params) {
  params.expand = 'childFlow'
  return request({
    url: '/project-child/task',
    method: 'post',
    params: params
  })
}
