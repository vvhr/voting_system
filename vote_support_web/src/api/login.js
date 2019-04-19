import request from '../utils/request'
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
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
