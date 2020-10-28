import { asyncRoutes, routes } from '@/router'

// 遍历asyncRoutes动态路由
function forSearchArr (route, roles) {
  const result = []
  for (const item of route) {
    const itemNew = { ...item }
    if (roles.includes(itemNew.name)) {
      if (itemNew.children) {
        itemNew.children = forSearchArr(itemNew.children, roles)
      }
      result.push(itemNew)
    }
  }
  return result
}

const permission = {
  state: {
    routes: [
      {
        path: '/',
        name: 'Home',
        redirect: '/dashboard',
        children: [
          {
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@/views/dashboard/index'),
            meta: { title: '首页', icon: 'el-icon-s-data' }
          }
        ]
      }
    ],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES (state, payload) {
      state.routes = [...routes, ...payload]
      state.addRoutes = payload
    }
  },
  action: {
    getAsyncRoutes ({ commit, rootGetters }, roles) {
      return new Promise(resolve => {
        let routes = []
        if (rootGetters.username === 'admin') {
          routes = asyncRoutes || ''
        } else {
          routes = forSearchArr(asyncRoutes, roles)
        }
        commit('SET_ROUTES', routes)
        resolve(routes)
      })
    }
  }

}
export default permission
