import Vue from 'vue'
import Router from 'vue-router'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/vote')
    }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'HomeIndex',
        component: () => import('@/views/vote'),
        meta: { title: '首页', icon: 'home' }
      }
    ]
  },
  {
    path: '/myHome',
    component: Layout,
    children: [
      {
        path: 'mine',
        name: 'mine',
        component: () => import('@/views/mine'),
        meta: { title: '我的主题', icon: 'myTask' }
      },
      {
        path: '/one',
        name: 'one',
        hidden: true,
        component: () => import('../views/one'),
        meta: { title: '在线投票页', icon: 'myTask' }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    meta: { title: '系统设置', icon: 'setting' },
    children: [
      {
        path: 'password',
        name: 'SettingPassword',
        component: () => import('@/views/setting/password'),
        meta: { title: '更改密码', icon: 'password' }
      }
    ]
  },
  { path: '*', name: '404', redirect: '/404', hidden: true }
]
