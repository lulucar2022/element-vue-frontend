import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import "font-awesome/css/font-awesome.min.css";
import Router from "vue-router";
import qs from "qs";
import {
  getCurDate,
  setSessionStorage,
  getSessionStorage,
  removeSessionStorage,
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
} from "./common.js";
import store from "@/store/store";

Vue.config.productionTip = false;
// axios 基础url
axios.defaults.baseURL = "http://127.0.0.1:8888/element";
// 全局使用 axios
Vue.prototype.$axios = axios;
// 全局使用 qs
Vue.prototype.$qs = qs;
// 全局使用
Vue.prototype.$getCurDate = getCurDate;
Vue.prototype.$setSessionStorage = setSessionStorage;
Vue.prototype.$getSessionStorage = getSessionStorage;
Vue.prototype.$removeSessionStorage = removeSessionStorage;
Vue.prototype.$setLocalStorage = setLocalStorage;
Vue.prototype.$getLocalStorage = getLocalStorage;
Vue.prototype.$removeLocalStorage = removeLocalStorage;
// 全局设置，解决路由重复问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 判断是否需要登录
  let user = sessionStorage.getItem("user");
  if (
    !(
      to.path == "/" ||
      to.path == "/index" ||
      to.path == "/login" ||
      to.path == "/register" ||
      to.path == "/businessList" ||
      to.path == "/businessInfo"
    )
  ) {
    if (user == null) {
      router.push("/login");
      location.reload();
    }
  }
  next();
});

// 路由后置钩子
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
