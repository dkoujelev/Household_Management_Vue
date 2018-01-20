// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Dashboard from './Dashboard'
import router from './router'
import axios from 'axios'
import {store} from './store';

Vue.config.productionTip = false;
window.Vue = Vue;

axios.defaults.withCredentials = true;

/* eslint-disable no-new */
new Vue({
  el: '#dashboard',
  router,
  template: '<Dashboard/>',
  components: { Dashboard },
  store
});
