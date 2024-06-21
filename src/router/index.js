import Vue from "vue";
import VueRouter from "vue-router";
import IndexView from "../views/IndexView.vue";
import BusinessList from "../views/BusinessList.vue";
import BusinessInfo from "../views/BusinessInfo.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from '@/views/RegisterView'
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: IndexView,
  },
  {
    path: "/index",
    name: "index",
    component: IndexView,
  },
  {
    path: "/businessList",
    name: "businessList",
    component: BusinessList,
  },
  {
    path: "/businessInfo",
    name: "businessInfo",
    component: BusinessInfo,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: "/userAddress",
    name: "userAddress",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/UserAddress.vue"),
  },
  {
    path: '/orders',
    name: 'orders',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/OrderView.vue'),
  },
  {
    path: '/addUserAddress',
    name: 'addUserAddress',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/AddAddress.vue'),
  },
  {
    path: '/editUserAddress',
    name: 'editUserAddress',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/EditAddress.vue'),
  }

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
