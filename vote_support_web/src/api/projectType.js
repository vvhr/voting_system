import request from '@/utils/request'

// 获取所有分公司节点
export function getProjectType(params) {
  return request({
    url: '/project-type/index',
    method: 'get',
    params: params
  })
}
