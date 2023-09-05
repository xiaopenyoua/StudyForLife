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
  }
]
export default routes
