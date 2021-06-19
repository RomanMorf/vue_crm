import Vue from "vue";
import VueRouter from "vue-router";
import firebase from 'firebase/app'

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: {layout: 'empty'},
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    meta: {layout: 'empty'},
    component: () => import('@/views/Register.vue')
  },
  {
    path: "/",
    name: "Home",
    meta: {layout: 'main', auth: true},
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/categories',
    name: 'categories',
    meta: {layout: 'main', auth: true},
    component: () => import('@/views/Categories.vue')
  },
  {
    path: '/record',
    name: 'record',
    meta: {layout: 'main', auth: true},
    component: () => import('@/views/Record.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    meta: {layout: 'main', auth: true},
    component: () => import('@/views/Profile.vue')
  },
  {
    path: '/planning',
    name: 'planning',
    meta: {layout: 'main', auth: true},
    component: () => import('@/views/Planning.vue')
  },
  {
    path: '/history',
    name: 'history',
    meta: {layout: 'main', auth: true},
    component: () => import('@/views/History.vue')
  },
  {
    path: '/detail/:id',
    name: 'detail',
    meta: {layout: 'main', auth: true},
    component: () => import('@/views/Detail.vue')
  },
  {
    path: '/edit/:id',
    name: 'edit',
    meta: {layout: 'main', auth: true},
    component: () => import('@/views/Edit.vue')
  },
  {
    path: '*',
    name: 'not-found',
    meta: {layout: 'main'},
    component: () => import('@/views/NotFound.vue')
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  to.meta.auth && !currentUser 
    ? next('/login') 
    : next()
})

export default router;
