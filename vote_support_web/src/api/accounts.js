import request from '@/utils/request'

// 读取成本核算
export function getAccountsBasic(params = {}) {
  return request({
    url: '/accounts-basic/index',
    method: 'get',
    params: params
  })
}

// 生成成本核算表
export function createAccountsBasic(params) {
  return request({
    url: '/accounts-basic/create',
    method: 'post',
    data: params
  })
}

// 读取成本核算表的时间记录表
export function getAccountsNote() {
  return request({
    url: '/accounts-note/index',
    method: 'get'
  })
}

export function updateAccountsNote(params) {
  return request({
    url: '/accounts-note/update',
    method: 'post',
    data: params
  })
}

export function createAccountsDepartment(params) {
  return request({
    url: '/accounts-department/create',
    method: 'post',
    data: params
  })
}

export function getAccountsDepartment(params = {}) {
  return request({
    url: '/accounts-department/index',
    method: 'get',
    params: params
  })
}

export function createAccountsSubject(params) {
  return request({
    url: '/accounts-subject/create',
    method: 'post',
    data: params
  })
}

export function getAccountsSubject(params = {}) {
  return request({
    url: '/accounts-subject/index',
    method: 'get',
    params: params
  })
}
