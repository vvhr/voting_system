import request from '@/utils/request'

// 获取我的任务
export function projectYtHistoryIndex(params) {
  params.expand = 'project'
  return request({
    url: '/project-yt-history/index',
    method: 'get',
    params: params
  })
}

export function projectYtHistoryCreate(data) {
  return request({
    url: '/project-yt-history/create',
    method: 'post',
    data: data
  })
}
