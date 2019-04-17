import request from '@/utils/request'

export function getReceivables(params = {}) {
  return request({
    url: '/receivable-user/index',
    method: 'get',
    params: params
  })
}

// 刷新所有应收账款记录的金额
export function updateAll(params = {}) {
  return request({
    url: '/receivable-user/update-all',
    method: 'post',
    data: params
  })
}

