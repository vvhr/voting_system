import request from '@/utils/request'

// 获取我的任务
export function projectYtTask(params) {
  params.expand = 'project'
  return request({
    url: '/project-yt/task',
    method: 'get',
    params: params
  })
}

export function projectYtUpdate(data) {
  return request({
    url: '/project-yt/update',
    method: 'post',
    data: data
  })
}
export function projectYtView(params) {
  return request({
    url: '/project-yt/view',
    method: 'get',
    params: params
  })
}
