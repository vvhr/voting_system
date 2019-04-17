import request from '@/utils/request'

// 获取所有分公司节点
export function getBranches() {
  return request({
    url: '/branch/index',
    method: 'get'
  })
}
