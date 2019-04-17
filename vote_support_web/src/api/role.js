import request from '@/utils/request'

// 获取所有分公司节点
export function getRoles() {
  return request({
    url: '/role/index',
    method: 'get'
  })
}
