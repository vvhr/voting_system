import request from '../utils/request'

export function createProject(data) {
  return request({
    url: '/project/create',
    method: 'post',
    data: data
  })
}
export function updateProject(data) {
  return request({
    url: '/project/update',
    method: 'post',
    data: data
  })
}

export function updateProjectFh(data) {
  return request({
    url: '/project/update-fh',
    method: 'post',
    data: data
  })
}

export function updateProjectYt(data) {
  return request({
    url: '/project/update-yt',
    method: 'post',
    data: data
  })
}
export function getProjects(params = {}) {
  params.expand = 'leading_user_name,customer_name,flowType,department,report,projectFh,projectYt,flowHistory,projectYtHistory,dealUser1,dealUser2,dealUser3,receival,invoice'
  return request({
    url: '/project/index',
    method: 'get',
    params: params
  })
}

export function getProjectsAtTheTime(params = {}) {
  params.expand = 'leading_user_name,customer_name,flowType,projectFh,flowHistory,projectYt'
  return request({
    url: '/project/index',
    method: 'get',
    params: params
  })
}

export function getProjectsRecover(params = {}) {
  params.expand = 'leading_user_name,customer_name,flowType,projectFh'
  return request({
    url: '/project/recover',
    method: 'get',
    params: params
  })
}

export function getTotal(params = {}) {
  return request({
    url: '/project/total',
    method: 'get',
    params: params
  })
}

export function getContract() {
  return request({
    url: '/project/contract',
    method: 'get'
  })
}

export function getProject(params) {
  params.expand = 'flowType, projectFh, projectYt'
  return request({
    url: '/project/view',
    method: 'get',
    params: params
  })
}

export function getTask(params) {
  params.expand = 'flowType'
  return request({
    url: '/project/task',
    method: 'get',
    params: params
  })
}

export function getContractTypes() {
  return [
    {
      label: '自主',
      value: 1
    },
    {
      label: '挂靠',
      value: 2
    },
    {
      label: '分包',
      value: 3
    }
  ]
}

export function parseContractType(value) {
  const contractTypes = getContractTypes()
  for (const index in contractTypes) {
    if (contractTypes[index].value === value) {
      return contractTypes[index].label
    }
  }
  return value
}

export function getOriginTypes() {
  return [
    {
      label: '合同签订',
      value: 1
    },
    {
      label: '委托书',
      value: 2
    },
    {
      label: '中标通知',
      value: 3
    },
    {
      label: '口头订单',
      value: 4
    }
  ]
}

export function parseOriginType(value) {
  const contractTypes = getOriginTypes()
  for (const index in contractTypes) {
    if (contractTypes[index].value === value) {
      return contractTypes[index].label
    }
  }
  return value
}
