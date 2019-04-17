import request from '@/utils/request'

export function createTask(params) {
  return request({
    url: '/task/create',
    method: 'post',
    data: params
  })
}

export function updateTask(params) {
  return request({
    url: '/task/update',
    method: 'post',
    data: params
  })
}

export function changeTaskStatus(params) {
  return request({
    url: '/task/change-task-status',
    method: 'post',
    data: params
  })
}

// 获取所有分公司节点
export function getRootNode() {
  return request({
    url: '/task/root-node',
    method: 'get'
  })
}

// 按分公司获取部门节点
export function getLevel2Node(branch_id) {
  return request({
    url: '/task/level2-node?branch_id=' + branch_id,
    method: 'get'
  })
}

// 按部门获取员工节点
export function getLevel3Node(department_id) {
  return request({
    url: '/task/level3-node?department_id=' + department_id,
    method: 'get'
  })
}
// 按员工获取任务节点
export function getLevel4Node(user_id) {
  return request({
    url: '/task/level4-node?user_id=' + user_id,
    method: 'get'
  })
}

// 按任务获取任务流水节点
export function getLevel5Node(task_id) {
  return request({
    url: '/task/level5-node?task_id=' + task_id,
    method: 'get'
  })
}

export function getTasks(params = {}) {
  return request({
    url: '/task/index',
    method: 'get',
    params: params
  })
}

export function getTask(id) {
  return request({
    url: '/task/view',
    method: 'get',
    params: { id: id }
  })
}

export function deleteTask(id) {
  return request({
    url: '/task/delete',
    method: 'get',
    params: { id: id }
  })
}
