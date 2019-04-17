import { login, logout, getInfo } from '../../api/login'
import { getToken, setToken, removeToken } from '../../utils/auth'
// 存储：核心行为
const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    userId: 1,
    branches: [],
    myAccessG: []
  },

  // 全局状态异变方法
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USER_ID: (state, userId) => {
      state.userId = userId
    },
    SET_BRANCHES: (state, branches) => {
      state.branches = branches
    },
    SET_ACCESS: (state, myAccessG) => {
      state.myAccessG = myAccessG
    }
  },
  // 全局状态异步异变方法
  actions: {
    // 登录动作 被登录页面所dispatch
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息动作，被permission入口所dispatch
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          // 强行添加，后期整改。0000000000000000
          data.roles = ['admin']
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', ['admin'])
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_USER_ID', data.id)
          commit('SET_BRANCHES', data.branches)
          commit('SET_ACCESS', data.myAccessG)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
