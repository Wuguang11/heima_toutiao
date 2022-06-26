import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout'),
    redirect: '/home',
    children: [
      { path: 'home', component: () => import('@/views/Home') },
      { path: 'myvideos', component: () => import('@/views/Video') },
      { path: 'question', component: () => import('@/views/Quest') },
      { path: 'my', component: () => import('@/views/My') }
    ]
  },
  { path: '/login', component: () => import('@/views/Login') }
]

const router = new VueRouter({
  routes
})

export default router
