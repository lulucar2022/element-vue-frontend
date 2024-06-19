import Vue from "vue";
import VueRouter from "vue-router";
import IndexView from "../views/IndexView.vue";
import BusinessList from "../views/BusinessList.vue";
import BusinessInfo from "../views/BusinessInfo.vue";

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
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
