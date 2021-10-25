import Vue from 'vue'
import Router from 'vue-router'
// 登录
const login = () => import('../view/login');
//欢迎登录/home
const home =() => import('../view/home');
const welcome = () => import('../view/welcome');
//用户管理
const user =  () => import('../view/user'); 
//权限管理
const roles =  () => import('../view/power/roles');
const rights = () => import('../view/power/rights');

// 商品管理
const Categories = () => import("../view/goods/Categories.vue")
const Params = () => import("../view/goods/Params.vue")
const List = () => import( "../view/goods/List.vue")
const AddGoods = () => import("../view/goods/AddGoods.vue")
//404
const NotFd = ()=>import('../view/NotFound/NotFound');
Vue.use(Router)
const routes = [
  {
    path: '/',
    name: '/',
    redirect: '/login'
  },
  {   
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    meta: {
      requireAuth: true
    },
    component: home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome },
      { path: '/roles', component: roles},
      { path: '/users', component: user},
      { path: '/rights', component: rights},
      { path: '/goods', component: List},
      { path: '/add',component:AddGoods},
      { path: '/params', component: Params},
      { path: '/categories', component: Categories},
    ]
  },
  {
    path: '*',
    component:NotFd
  }
]
const router = new Router({
  mode: 'history',
  routes
})
export default router

router.beforeEach((to, from, next) => {
      sessionStorage.getItem('token')!=''?next():next('/login')
})
