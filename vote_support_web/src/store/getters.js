// 全局状态获取器
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userId: state => state.user.userId,
  roles: state => state.user.roles,
  branches: state => state.user.branches,
  myAccessG: state => state.user.myAccessG.access,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters
