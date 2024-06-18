import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import "font-awesome/css/ont-awesome.min.css";
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

Vue.config.productionTip = false;
// axios 基础url
axios.defaults.baseURL = "127.0.0.1:8888/element";
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
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
