// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
// import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/iot/product-list',
    children: [
      // dashboard
      // {
      //   path: '/dashboard',
      //   name: 'dashboard',
      //   redirect: '/dashboard/workplace',
      //   component: RouteView,
      //   meta: { title: 'menu.dashboard', keepAlive: true, icon: bxAnaalyse, permission: ['sys'] },
      //   children: [
      //     {
      //       path: '/dashboard/workplace',
      //       name: 'Workplace',
      //       component: () => import('@/views/dashboard/Workplace'),
      //       meta: { title: 'menu.dashboard.workplace', keepAlive: true, permission: ['sys'] }
      //     }
      //   ]
      // },
      // iot
      {
        path: '/iot/product-list',
        name: 'ProductList',
        component: () => import('@/views/iot/product/ProductList'),
        meta: { title: '产品管理', keepAlive: true, icon: 'appstore', permission: [ 'product-mgr' ] }
      },
      {
        path: '/iot/device-list',
        name: 'DeviceList',
        component: () => import('@/views/iot/device/DeviceList'),
        meta: { title: '设备管理', keepAlive: true, icon: 'cluster', permission: [ 'device-mgr' ] }
      },
      {
        path: '/iot/scene-list',
        name: 'SceneList',
        component: () => import('@/views/iot/scene/SceneList'),
        meta: { title: '规则引擎', keepAlive: true, icon: 'branches', permission: [ 'rule-mgr' ] }
      },
      {
        path: '/iot/alarm-list',
        name: 'AlarmList',
        component: () => import('@/views/iot/alarm/AlarmList'),
        meta: { title: '设备告警', keepAlive: true, icon: 'alert', permission: [ 'alarm-mgr' ] }
      },
      {
        path: '/notice/config-list',
        name: 'ConfigList',
        component: () => import('@/views/notice/config/ConfigList.vue'),
        meta: { title: '通知配置', keepAlive: true, icon: 'notification', permission: [ 'notify-config' ] }
      },
      {
        path: '/doc',
        name: 'Doc',
        component: () => import('@/views/doc/Doc.vue'),
        meta: { title: '文档', keepAlive: true, icon: 'notification' }
      },
      // {
      //   path: '/iot',
      //   name: 'iotPage',
      //   component: RouteView,
      //   redirect: '/iot/product-list',
      //   meta: { title: '设备管理', icon: 'setting' },
      //   children: [
      //     // {
      //     //   path: '/iot/location-list',
      //     //   name: 'LocationList',
      //     //   component: () => import('@/views/iot/device/LocationList'),
      //     //   meta: { title: '位置', keepAlive: true, permission: [ 'location-mgr' ] }
      //     // },
      //   ]
      // },
      // sys
      {
        path: '/sys',
        name: 'sysPage',
        component: RouteView,
        meta: { title: '系统管理', icon: 'setting' },
        children: [
          {
            path: '/sys/role-list',
            name: 'RoleList',
            component: () => import('@/views/sys/RoleList'),
            meta: { title: '角色列表', keepAlive: true, permission: [ 'role-mgr' ] }
          },
          {
            path: '/sys/user-list',
            name: 'UserList',
            component: () => import('@/views/sys/UserList'),
            meta: { title: '用户列表', keepAlive: true, permission: [ 'user-mgr' ] }
          },
          {
            path: '/sys/opanapi-list',
            name: 'OpenApiList',
            component: () => import('@/views/sys/OpenApiList'),
            meta: { title: 'OpenApi', keepAlive: true, permission: [ 'open-api-mgr' ] }
          },
          {
            path: '/sys/system-config',
            name: 'SystemConfig',
            component: () => import('@/views/sys/config/SysConfig'),
            meta: { title: '系统配置', keepAlive: true, permission: [ 'sys-config' ] }
          }
        ]
      },
      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: { title: 'menu.account', icon: 'user', keepAlive: true },
        hidden: true,
        children: [
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: 'menu.account.settings', hideHeader: true },
            redirect: '/account/settings/basic',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/basic',
                name: 'BasicSettings',
                component: () => import('@/views/account/settings/BasicSetting'),
                meta: { title: 'account.settings.menuMap.basic', hidden: true }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: {
                  title: 'account.settings.menuMap.security',
                  hidden: true,
                  keepAlive: true
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import('@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import('@/views/exception/404')
  }
]
