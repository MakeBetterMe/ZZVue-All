import Vue from 'vue'
import ZZVueRouter from '../vendors/ZZVueRouter'
import Home from '../views/Home.vue'

Vue.use(ZZVueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new ZZVueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
