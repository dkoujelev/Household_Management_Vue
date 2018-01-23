// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Dashboard from './Dashboard'
import router from './router'
import axios from 'axios'
import {store} from './store';
import AsyncComputed from 'vue-async-computed';

Vue.use(AsyncComputed);

Vue.config.productionTip = false;
window.Vue = Vue;

axios.defaults.withCredentials = true;

router.beforeEach((to,from,next) => {

  //console.log("router.beforeEach: intercepting route from " + from.path + " to " + to.path);

  if(to.path === '/Login' || to.path === '/Register'){
    //console.log("router.beforeEach: user is already on login/register page, no redirect");
    return next();
  }



  if(store.state.loggedIn){
    //console.log("router.beforeEach: already logged in, don't redirect");
    return next();
  }

  axios.get('http://localhost:9000/rest/loggedIn').then(response => {
    if(response.data !== null){
      //console.log("router.beforeEach: User is logged in, proceed with route");
      store.commit('current_user',response.data);
      store.commit('loggedIn',true);

      //console.log('updated');
      //console.log(store.state.current_user.bruker_id);
      axios.get('http://localhost:9000/rest/kollektivForBruker/' + store.state.current_user.bruker_id).then(response => {
        store.commit('isMember', response.data.length > 0);
        console.log('updated');
        if (store.state.isMember && store.state.loggedIn) router.push('NewUser');
        return next();
      });
    }
    else{
      //console.log("router.beforeEach: User isn't logged in! Sending user to Login");
      return next('Login');
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
