import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    redirect: '/admin/ai/overview',
    meta: {
      icon: 'lucide:layout-dashboard',
      order: 1,
      title: '仪表盘',
      authority: ['dashboard:view'],
    },
    children: [
      {
        name: 'AiOverview',
        path: '/admin/ai/overview',
        component: () => import('#/views/loveos/dashboard/ai-overview.vue'),
        meta: {
          title: 'AI 总览',
          affixTab: true,
          icon: 'lucide:bot',
          authority: ['ai:overview:view'],
        },
      },
    ],
  },
  {
    name: 'UsersAndRelations',
    path: '/users',
    meta: {
      icon: 'lucide:users',
      order: 2,
      title: '用户与关系监控',
      authority: ['users:list:view'],
    },
    children: [
      {
        name: 'UserList',
        path: '/admin/users',
        component: () => import('#/views/loveos/users/user-list.vue'),
        meta: {
          title: '用户列表',
          icon: 'lucide:user-circle',
          authority: ['users:list:view'],
        },
      },
      {
        name: 'UserOverview',
        path: '/admin/users/:id/overview',
        component: () => import('#/views/loveos/users/user-overview.vue'),
        meta: {
          title: '用户详情',
          hideInMenu: true,
          authority: ['users:list:view'],
        },
      },
      {
        name: 'CoupleList',
        path: '/admin/couples',
        component: () => import('#/views/loveos/couples/couple-list.vue'),
        meta: {
          title: '情侣列表',
          icon: 'lucide:heart',
          authority: ['couples:list:view'],
        },
      },
      {
        name: 'MbtiStats',
        path: '/admin/mbti/stats',
        component: () => import('#/views/loveos/mbti/mbti-stats.vue'),
        meta: {
          title: 'MBTI 指标汇总',
          icon: 'lucide:activity',
          authority: ['dashboard:view'],
        },
      },
    ],
  },
  {
    name: 'AiMonitoring',
    path: '/ai',
    meta: {
      icon: 'lucide:cpu',
      order: 3,
      title: 'AI 监控与分析',
      authority: ['ai:runs:view'],
    },
    children: [
      {
        name: 'AiRuns',
        path: '/admin/ai/runs',
        component: () => import('#/views/loveos/ai/runs.vue'),
        meta: {
          title: 'AI Run 列表',
          icon: 'lucide:list-checks',
          authority: ['ai:runs:view'],
        },
      },
      {
        name: 'AiRunDetail',
        path: '/admin/ai/runs/:id',
        component: () => import('#/views/loveos/ai/run-detail.vue'),
        meta: {
          title: 'Run 详情',
          hideInMenu: true,
          authority: ['ai:runs:view'],
        },
      },
      {
        name: 'AiUsageScene',
        path: '/admin/ai/usage/scene',
        component: () => import('#/views/loveos/ai/usage-scene.vue'),
        meta: {
          title: '按场景统计',
          icon: 'lucide:pie-chart',
          authority: ['ai:overview:view'],
        },
      },
      {
        name: 'AiUsageUser',
        path: '/admin/ai/usage/user',
        component: () => import('#/views/loveos/ai/usage-user.vue'),
        meta: {
          title: '用户排行',
          icon: 'lucide:bar-chart-3',
          authority: ['ai:overview:view'],
        },
      },
      {
        name: 'AiCostReport',
        path: '/admin/ai/cost/report',
        component: () => import('#/views/loveos/ai/cost-report.vue'),
        meta: {
          title: '成本报表',
          icon: 'lucide:coins',
          authority: ['ai:cost:view'],
        },
      },
      {
        name: 'AiAnomalyReport',
        path: '/admin/ai/anomaly/report',
        component: () => import('#/views/loveos/ai/anomaly-report.vue'),
        meta: {
          title: '异常/治理报告',
          icon: 'lucide:shield-alert',
          authority: ['ai:anomaly:view'],
        },
      },
    ],
  },
  {
    name: 'AiConfig',
    path: '/ai/config',
    meta: {
      icon: 'lucide:settings',
      order: 4,
      title: 'AI 配置',
      authority: ['ai:cost:view'],
    },
    children: [
      {
        name: 'ModelPrices',
        path: '/ai/model-prices',
        component: () =>
          import('#/views/loveos/ai-config/model-prices.vue'),
        meta: {
          title: '模型价格 CRUD',
          icon: 'lucide:wallet',
          authority: ['ai:cost:view'],
        },
      },
      {
        name: 'FeatureModels',
        path: '/ai/feature-models',
        component: () =>
          import('#/views/loveos/ai-config/feature-models.vue'),
        meta: {
          title: '场景 → 模型路由配置',
          icon: 'lucide:route',
          authority: ['ai:cost:view'],
        },
      },
    ],
  },
  {
    name: 'Subscriptions',
    path: '/subscriptions',
    meta: {
      icon: 'lucide:badge-dollar-sign',
      order: 5,
      title: '订阅与套餐',
      authority: ['subscription:plan:edit'],
    },
    children: [
      {
        name: 'SubscriptionPlans',
        path: '/subscriptions/plans',
        component: () =>
          import('#/views/loveos/subscriptions/subscription-plans.vue'),
        meta: {
          title: '订阅套餐',
          icon: 'lucide:package',
          authority: ['subscription:plan:edit'],
        },
      },
      {
        name: 'UserSubscriptions',
        path: '/subscriptions/users/:userId',
        component: () =>
          import('#/views/loveos/subscriptions/user-subscriptions.vue'),
        meta: {
          title: '用户订阅',
          hideInMenu: true,
          authority: ['subscription:plan:edit'],
        },
      },
    ],
  },
  {
    name: 'RelationshipTopics',
    path: '/relationship',
    meta: {
      icon: 'lucide:messages-square',
      order: 6,
      title: '关系话术配置',
      authority: ['relationship:topic:edit'],
    },
    children: [
      {
        name: 'Topics',
        path: '/relationship/topics',
        component: () => import('#/views/loveos/relationship/topics.vue'),
        meta: {
          title: '话术主题',
          icon: 'lucide:message-square-more',
          authority: ['relationship:topic:edit'],
        },
      },
      {
        name: 'TopicQuestions',
        path: '/relationship/topics/:code/questions',
        component: () =>
          import('#/views/loveos/relationship/topic-questions.vue'),
        meta: {
          title: '提问配置',
          hideInMenu: true,
          authority: ['relationship:topic:edit'],
        },
      },
    ],
  },
  {
    name: 'Audit',
    path: '/audit',
    meta: {
      icon: 'lucide:history',
      order: 7,
      title: '系统审计',
      authority: ['audit:events:view'],
    },
    children: [
      {
        name: 'AuditEvents',
        path: '/audit/events',
        component: () => import('#/views/loveos/audit/audit-events.vue'),
        meta: {
          title: '审计事件',
          icon: 'lucide:clipboard-list',
          authority: ['audit:events:view'],
        },
      },
    ],
  },
];

export default routes;
