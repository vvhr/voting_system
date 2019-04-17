/** 本接口用于综合报销 */
import request from '@/utils/request'

// 获取报销科目
export function getSbjType(params = {}) {
  return request({
    url: '/cost-sbj-type/index',
    params: params,
    method: 'get'
  })
}

// 获取报销类型
export function getType() {
  return request({
    url: '/cost-type/index',
    method: 'get'
  })
}

// 获取综合报销
export function getGeneral(params = {}) {
  params.expand = 'cost_user_name,input_user_name,type_name,sbj_name,cost_branch_name,department_name,subject,really_subject'
  return request({
    url: '/cost-general/index',
    method: 'get',
    params: params
  })
}

// 添加综合报销
export function createGeneral(params) {
  return request({
    url: '/cost-general/create',
    method: 'post',
    data: params
  })
}

// 获取分组
export function getGroups(params = {}) {
  params.expand = 'branch_name,costs'
  return request({
    url: '/cost-group/index',
    method: 'get',
    params: params
  })
}

// 创建分组
export function createGroup(params) {
  return request({
    url: '/cost-group/create',
    method: 'post',
    data: params
  })
}

// 修改分组
export function updateGroup(params) {
  return request({
    url: '/cost-group/update',
    method: 'post',
    data: params
  })
}

// 批量添加综合报销
export function createGeneralExcel(params) {
  return request({
    url: '/cost-general/excel',
    method: 'post',
    data: params
  })
}

// 批量检查错误
export function checkGeneralExcel(params) {
  return request({
    url: '/cost-general/check',
    method: 'post',
    data: params
  })
}

