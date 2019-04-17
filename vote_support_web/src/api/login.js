import request from '@/utils/request'
import { getBranches } from './branch'
import { getMyAccess } from './access'
// api
export function login(username, password) {
  return request({
    url: '/login/get-token',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

// 将其它全局状态信息都附加到用户状态数据上
export function getInfo(token) {
  return request({
    url: '/login/get-info',
    method: 'get',
    params: { token }
  }).then(userInfo => {
    return getBranches().then(res => {
      userInfo.data.branches = res.data
      return userInfo
    })
  }).then(userInfo => {
    return getMyAccess().then(res => {
      userInfo.data.myAccessG = res.data
      return userInfo
    })
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
