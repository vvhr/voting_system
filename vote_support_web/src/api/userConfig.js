/** 本接口用于用户配置表 */
import request from '@/utils/request'

// 获取报销科目
export function getUserConfig() {
  return request({
    url: '/user-config/index',
    method: 'get'
  })
}

// 获取报销科目
export function updateUserConfig(params = {}) {
  return request({
    url: '/user-config/update',
    data: params,
    method: 'post'
  })
}
