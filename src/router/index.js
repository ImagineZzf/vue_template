import Vue from 'vue'
import Router from 'vue-router'
import list from './list'
import { loadView, nextHandlar } from '@utils'
import Auth from '@middlewares/auth'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'home',
    component: loadView('home/Index'),
    meta: {
      middleware: Auth
    }
  },
  ...list,
  {
    path: '/login',
    name: 'login',
    component: loadView('login/Index')
  },
  {
    path: '/404',
    name: '404',
    meta: { title: '404' },
    component: loadView('error/404')
  },
  {
    path: '*',
    redirect: '/404'
  }
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})

router.beforeEach((to, from, next) => nextHandlar(to, from, next, router))

export default router
