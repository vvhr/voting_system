/** 本接口用于物资采购 */
import request from '@/utils/request'

// 获取报销科目
export function getSbjType() {
  return request({
    url: '/cost-sbj-type/index',
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

// 获取基础报销
export function getGoods(params = {}) {
  params.expand = 'cost_user_name,input_user_name,type_name,subject,really_subject,branch_name,department_name,project'
  return request({
    url: '/cost-goods/index',
    method: 'get',
    params: params
  })
}

// 添加基础报销
export function createGoods(params) {
  return request({
    url: '/cost-goods/create',
    method: 'post',
    data: params
  })
}

// 批量添加基础报销
export function createGoodsExcel(params) {
  return request({
    url: '/cost-goods/excel',
    method: 'post',
    data: params
  })
}

// 批量添加基础报销
export function checkGoodsExcel(params) {
  return request({
    url: '/cost-goods/check',
    method: 'post',
    data: params
  })
}
