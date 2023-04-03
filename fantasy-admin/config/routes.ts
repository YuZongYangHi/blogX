export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      }
    ],
  },
  {
    path: '/dashboard',
    name: '视图概览',
    icon: 'DashboardTwoTone',
    component: './dashboard',
  },
  {
    path: '/assets',
    name: '资产管理',
    icon: 'AppstoreTwoTone',
    routes: [
      {
        name: '创建文章',
        path: '/assets/article/create',
        icon: 'BookTwoTone',
        component: './article/create',
      },
      {
        name: '文章管理',
        path: '/assets/articles',
        icon: 'BookTwoTone',
        component: './article/list'
      },
      {
        name: '分类管理',
        path: '/assets/categories',
        icon: 'TagTwoTone',
        component: './article/category'
      },
      {
        name: '标签管理',
        path: '/assets/tags',
        icon: 'TagsTwoTone',
        component: './article/tag'
      },
    ],
  },
  {
    path: '/users',
    name: '用户管理',
    icon: 'ContactsTwoTone',
    routes: [
      {
        name: '消息中心',
        path: '/users/messages',
        component: './user/notice/'
      },
      {
        name: '个人设置',
        path: '/users/settings',
        component: './user/settings'
      },
    ],
  },
  {
    path: '/audit',
    name: '审计管理',
    icon: 'SecurityScanTwoTone',
    routes: [
      {
        name: '用户列表',
        path: '/audit/users',
        component: './audit/userList'
      },
      {
        name: '登录日志',
        path: '/audit/login',
        component: './audit/userLogin'
      },
      {
        name: '操作日志',
        path: '/audit/operate',
        component: './audit/operation'
      },
      {
        name: '访问日志',
        path: 'audit//access',
        component: './audit/access'
      },
      {
        name: '黑名单',
        path: 'audit//blacklist',
        component: './audit/blacklist'
      }
    ],
  },

  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    component: './404',
  },
];
