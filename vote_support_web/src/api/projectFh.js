import request from '@/utils/request'

// 获取我的任务
export function projectFhTask(params) {
  params.expand = 'project'
  return request({
    url: '/project-fh/task',
    method: 'get',
    params: params
  })
}

export function projectFhUpdate(data) {
  return request({
    url: '/project-fh/update',
    method: 'post',
    data: data
  })
}

// 获取单条记录
export function projectFhView(params) {
  params.expand = 'project'
  return request({
    url: '/project-fh/view',
    method: 'get',
    params: params
  })
}
