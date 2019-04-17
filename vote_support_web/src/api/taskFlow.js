import request from '@/utils/request'

export function createTaskFlow(params) {
  return request({
    url: '/task-flow/create',
    method: 'post',
    data: params
  })
}
