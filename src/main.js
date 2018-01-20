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

router.beforeEach((to,from,next) => {

  if(to.path === '/Login' || to.path === '/Registrer'){
    console.log("router.beforeEach: user is already on login/register page, no redirect");
    next();
  }


  if(store.state.loggedIn){
    console.log("router.beforeEach: already logged in, don't redirect");
    next();
  }

  axios.get('http://localhost:9000/rest/loggedIn').then(response => {
    if(response.data !== null){
      console.log("router.beforeEach: User is logged in, proceed with route");
      store.state.current_user = response.data;
      store.state.loggedIn = true;
      next();
    }
    else{
      console.log("router.beforeEach: User isn't logged in! Sending user to Login");
      next('Login');
    }

  });

});

/* eslint-disable no-new */
new Vue({
  el: '#dashboard',
  router,
  template: '<Dashboard/>',
  components: { Dashboard },
  store
});
