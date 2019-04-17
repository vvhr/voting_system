import axios from 'axios'

const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})
// request拦截器
service.interceptors.request.use(
  e => {
    e.params = e.params || {}
    e.headers = e.headers || {}
    // set 默认值
    return e
  },
  error => ({ status: 0, msg: error.message })
)
// response拦截器
service.interceptors.response.use(
  response => {
    const resp = response.data
    if (response.status === 101) {
      return resp
    }
    return resp
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)
export default service
