/**
 * 常用分公司过滤器
 */
export function parseBranch(value) {
  if (value === 1) {
    return '华建集团'
  }
  if (value === 2) {
    return '华建电力'
  }
  if (value === 3) {
    return '富华电力'
  }
  if (value === 4) {
    return '物联电力'
  }
  if (value === 5) {
    return '源通电力'
  }
  if (value === 6) {
    return '华建云南'
  }
  return value
}
