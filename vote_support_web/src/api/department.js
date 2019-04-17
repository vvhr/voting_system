import request from '@/utils/request'

export function creatDepartment(params) {
  return request({
    url: '/department/create',
    method: 'post',
    data: {
      branch_id: params.branch_id,
      name: params.name
    }
  })
}

export function getDepartments(params = {}) {
  params.expand = 'branch_name, charge_user_name'
  return request({
    url: '/department/index',
    method: 'get',
    params: params
  })
}

export function updateDepartment(params) {
  return request({
    url: '/department/update',
    method: 'post',
    data: params
  })
}

// 获取项目报表的的几个部门
export function listDepartment(params) {
  return request({
    url: '/department/list',
    method: 'get',
    params: params
  })
}
