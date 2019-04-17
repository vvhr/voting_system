/** 银行管理接口*/
import request from '@/utils/request'

// 获取银行
export function getBanks(params = {}) {
  return request({
    url: '/bank/index',
    method: 'get',
    params: params
  })
}

// 添加银行
export function createBank(params) {
  return request({
    url: '/bank/create',
    method: 'post',
    data: params
  })
}

// 修改银行
export function updateBank(params = {}) {
  return request({
    url: '/bank/update',
    method: 'post',
    data: params
  })
}
