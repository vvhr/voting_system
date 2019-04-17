import request from '@/utils/request'

export function projectFhHistoryIndex(params) {
  return request({
    url: '/project-fh-history/index',
    method: 'get',
    params: params
  })
}

export function projectFhHistoryCreate(data) {
  return request({
    url: '/project-fh-history/create',
    method: 'post',
    data: data
  })
}
