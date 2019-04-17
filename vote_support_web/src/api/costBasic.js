/** 本接口用于基础报销 */
import request from '../utils/request'

// 获取报销科目
export function getSbjType(params = {}) {
  return request({
    url: '/cost-sbj-type/index',
    params: params,
    method: 'get'
  })
}

// 获取报销科目
export function updateSbjType(params) {
  return request({
    url: '/cost-sbj-type/update',
    data: params,
    method: 'post'
  })
}

// 获取报销类型
export function getType() {
  return request({
    url: '/cost-type/index',
    method: 'get'
  })
}

// 新增科目明细
export function createSbjType(params) {
  return request({
    url: '/cost-sbj-type/create',
    method: 'post',
    data: params
  })
}
// 获取基础报销
export function getBasic(params = {}) {
  params.expand = 'cost_user_name,input_user_name,type_name,subject,really_subject,branch_name,department_name,project'
  return request({
    url: '/cost-basic/index',
    method: 'get',
    params: params
  })
}

// 添加基础报销
export function createBasic(params) {
  return request({
    url: '/cost-basic/create',
    method: 'post',
    data: params
  })
}

// 批量添加
export function createBasicExcel(params) {
  return request({
    url: '/cost-basic/excel',
    method: 'post',
    data: params
  })
}

// 检查数据
export function checkBasicExcel(params) {
  return request({
    url: '/cost-basic/check',
    method: 'post',
    data: params
  })
}

