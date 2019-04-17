import request from '@/utils/request'

// 查询我的ID
export function getMyId() {
  return request({
    url: '/access-list/view',
    method: 'get'
  })
}

// 读取员工权限表
export function getAccessStuff(params = {}) {
  params.expand = 'branch_name,access_group_name,user'
  return request({
    url: '/access-stuff/index',
    method: 'get',
    params: params
  })
}

// 读取权限表
export function getAccessList(params = {}) {
  // params.expand = 'branch_name,access_group_name'
  return request({
    url: '/access-list/index',
    method: 'get',
    params: params
  })
}

// 读取员工权限
export function getMyAccess(params = {}) {
  params.expand = 'access'
  return request({
    url: '/access-stuff/view',
    method: 'get',
    params: params
  })
}

// 修改员工权限组
export function updateStuffGroup(params) {
  return request({
    url: '/access-stuff/update',
    method: 'post',
    data: params
  })
}

// 读取权限组
export function getAccessGroup(params = {}) {
  // params.expand = 'access'
  return request({
    url: '/access-group/index',
    method: 'get',
    params: params
  })
}

// 创建权限组
export function createAccessGroup(params) {
  return request({
    url: '/access-group/create',
    method: 'post',
    data: params
  })
}

// 修改权限组
export function updateAccessGroup(params) {
  return request({
    url: '/access-group/update',
    method: 'post',
    data: params
  })
}
