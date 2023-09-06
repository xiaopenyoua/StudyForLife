const routes = [
  {
    path: '/',
    name: 'index',
    title: '首页',
    component: () => import('@/views/首页.vue') //.vue不能省略
  },
  {
    path: '/item-1',
    name: 'item-1',
    title: '拼音标注',
    component: () => import('@/views/拼音标注.vue')
  },
  {
    path: '/item-2',
    name: 'item-2',
    title: '标签页间通信-发送',
    component: () => import('@/views/标签页间通信-1.vue')
  },
  {
    path: '/item-3',
    name: 'item-3',
    title: '标签页间通信-接收',
    component: () => import('@/views/标签页间通信-2.vue')
  }
]
export default routes
