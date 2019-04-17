import request from '../utils/request'

export function getRegions(params) {
  return request({
    url: '/region/index',
    method: 'post',
    params: params
  })
}

export function convertRegions(regions, hasChildren = true) {
  const regionsTemp = []
  for (const index in regions) {
    const temp = {}
    temp.label = regions[index].name
    temp.value = regions[index].id
    if (hasChildren) {
      temp.children = []
    }
    regionsTemp.push(temp)
  }
  return regionsTemp
}

// 初始化最高级别行政区域
export function getInitRegions() {
  return getRegions({ level: 1 }).then(res => {
    return convertRegions(res.data, true)
  })
}

// 获取子行政区域
export function getChildrenRegions(id, hasChildren = true) {
  return getRegions({ parent_id: id }).then(res => {
    return convertRegions(res.data, hasChildren)
  })
}
// 获取行政区域所在数组的索引
export function getIndexOfRegionIdInRegions(regionId, regions) {
  for (const index in regions) {
    if (regions[index].value === regionId) {
      return index
    }
  }
  return 0
}

// 获取地址全名
export function getFullAddress(regionId) {
  return request({
    url: '/region/full-address',
    method: 'post',
    params: { regionId: regionId }
  })
}
