import store from '../store'

export function actionCheck(checkname) {
  return accessHave(checkname) !== false
}

/** 判断权限字段是否存在 */
export function accessHave(name) {
  const access = store.getters.myAccessG
  if (isEmpty(access) === false) {
    const str = (access).toString()
    return str.indexOf(name) > -1
  } else return false
}

export function isEmpty(obj) {
  return typeof obj === 'undefined' || obj == null || obj === ''
}

export default {
  actionCheck
}

