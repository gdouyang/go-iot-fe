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
    redirect: '/iot',
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
            meta: { title: 'menu.account.settings', hideHeader: true, permission: ['sys'] },
            redirect: '/account/settings/basic',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/basic',
                name: 'BasicSettings',
                component: () => import('@/views/account/settings/BasicSetting'),
                meta: { title: 'account.settings.menuMap.basic', hidden: true, permission: ['sys'] }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: {
                  title: 'account.settings.menuMap.security',
                  hidden: true,
                  keepAlive: true,
                  permission: ['sys']
                }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: 'account.settings.menuMap.custom', hidden: true, keepAlive: true, permission: ['sys'] }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: 'account.settings.menuMap.binding', hidden: true, keepAlive: true, permission: ['sys'] }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: {
                  title: 'account.settings.menuMap.notification',
                  hidden: true,
                  keepAlive: true,
                  permission: ['sys']
                }
              }
            ]
          }
        ]
      },
      // 项目
      // {
      //   path: '/project',
      //   name: 'projectPage',
      //   component: RouteView,
      //   redirect: '/project/project-list',
      //   meta: { title: '项目管理', icon: 'setting', permission: [ 'sys' ] },
      //   children: [
      //     {
      //       path: '/project/group-list',
      //       name: 'GroupList',
      //       component: () => import('@/views/iot/project/DeviceGroupList'),
      //       meta: { title: '分组', keepAlive: true }
      //     },
      //   ]
      // },
      // iot
      {
        path: '/iot',
        name: 'iotPage',
        component: RouteView,
        redirect: '/project/group-list',
        meta: { title: '设备管理', icon: 'setting' },
        children: [
          {
            path: '/project/group-list',
            name: 'ProjectList',
            component: () => import('@/views/iot/project/ProjectList'),
            meta: { title: '分组', keepAlive: true, permission: [ 'group-mgr' ] }
          },
          {
            path: '/project/datapush-list',
            name: 'DataPushList',
            component: () => import('@/views/iot/project/ProjectDataPushList'),
            meta: { title: '推送', keepAlive: true, permission: [ 'datapush-mgr' ] }
          },
          {
            path: '/iot/product-list',
            name: 'ProductList',
            component: () => import('@/views/iot/product/ProductList'),
            meta: { title: '产品', keepAlive: true, permission: [ 'product-mgr' ] }
          },
          {
            path: '/iot/device-list',
            name: 'DeviceList',
            component: () => import('@/views/iot/device/DeviceList'),
            meta: { title: '设备', keepAlive: true, permission: [ 'device-mgr' ] }
          },
          {
            path: '/iot/location-list',
            name: 'LocationList',
            component: () => import('@/views/iot/device/LocationList'),
            meta: { title: '位置', keepAlive: true, permission: [ 'location-mgr' ] }
          },
          {
            path: '/iot/scene-list',
            name: 'SceneList',
            component: () => import('@/views/iot/scene/SceneList'),
            meta: { title: '场景联动', keepAlive: true, permission: [ 'rule-mgr' ] }
          },
          {
            path: '/iot/alarm-list',
            name: 'AlarmList',
            component: () => import('@/views/iot/alarm/AlarmList'),
            meta: { title: '设备告警', keepAlive: true, permission: [ 'alarm-mgr' ] }
          }
        ]
      },
      {
        path: '/network',
        name: 'networkPage',
        component: RouteView,
        meta: { title: '接入管理', icon: 'setting' },
        children: [
          {
            path: '/network/certificate-list',
            name: 'CertificateList',
            component: () => import('@/views/iot/network/CertificateList'),
            meta: { title: '证书', keepAlive: true, permission: [ 'group-mgr' ] }
          }
        ]
      },
      {
        path: '/notice',
        name: 'noticePage',
        component: RouteView,
        meta: { title: '通知管理', icon: 'setting', permission: [ 'notify' ] },
        children: [
          {
            path: '/notice/config-list',
            name: 'ConfigList',
            component: () => import('@/views/notice/config/ConfigList.vue'),
            meta: { title: '通知配置', keepAlive: true, permission: [ 'notify-config' ] }
          },
          {
            path: '/notice/template-list',
            name: 'TemplateAdd',
            component: () => import('@/views/notice/template/TemplateList.vue'),
            meta: { title: '通知模板', keepAlive: true, permission: [ 'notify-template' ] }
          }
        ]
      },
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
            path: '/sys/tenant-list',
            name: 'TenantList',
            component: () => import('@/views/sys/TenantList'),
            meta: { title: '租户列表', keepAlive: true, permission: [ 'tenant-mgr' ] }
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
