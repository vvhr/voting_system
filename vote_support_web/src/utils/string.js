export function _join(params, split = '&') {
  let _ = ''
  for (const k in params) {
    _ = _ + k + '=' + params[k] + split
  }
  _ = _.substr(0, _.length - 1)
  return _
}
