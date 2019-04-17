import { Message } from 'element-ui'

// 请求组件返回消息处理，并弹出消息框公用处理方法
export function replyRes(res) {
  // console.log(res)
  let msg = ''
  if (res.data.bCode === 101) {
    res.data.bMsg !== '' ? msg = res.data.bMsg : msg = '操作成功'
    Message({ message: msg, type: 'success' })
    return true
  } else if (res.data.bCode === 102) {
    res.data.bMsg !== '' ? msg = res.data.bMsg : msg = '操作失败'
    console.log(res.data.bMsg)
    Message({ message: msg, type: 'error' })
    console.log(res)
  } else {
    Message({ message: '返回状态码非101 102', type: 'error' })
  }
  return false
}
