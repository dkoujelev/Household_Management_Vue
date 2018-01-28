// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Dashboard from './Dashboard'
import router from './router'
import axios from 'axios'
import {store} from './store';
import AsyncComputed from 'vue-async-computed';
import VuejsDialog from 'vuejs-dialog';

Vue.use(AsyncComputed);
Vue.use(VuejsDialog, {okText: 'OK', cancelText: 'Avbryt', reverse: false});

Vue.config.productionTip = false;
window.Vue = Vue;

axios.defaults.withCredentials = true;

router.beforeEach((to,from,next) => {

  //console.log("router.beforeEach: intercepting route from " + from.path + " to " + to.path);

  if(to.path === '/Login' || to.path === '/Register' || to.path === '/ForgottenPassword'){
    //console.log("router.beforeEach: user is already on login/register page, no redirect");
    return next();
  }

  if(store.state.loggedIn){
    //console.log("router.beforeEach: already logged in, don't redirect");
    console.log('not updating');

    //Actually, this seems like a good place to update...
    axios.get('http://localhost:9000/rest/notifikasjon/' + store.state.current_user.bruker_id + '/ulest').then(response => {
      if(response.data){
        console.log('Found ' + response.data.length + ' notifications, updating notificationCount...');
        store.commit('notificationCount', response.data.length);
      };
    });

    //if(!store.state.isMember && (to.path !== 'NewUser' || to.path !== '/NewUser') ) router.push('/NewUser');
    if(!store.state.isMember){
      if(to.path !== '/NewUser' && to.path !== '/Innmelding') router.push('/NewUser')
    }
    return next();
  }

  axios.get('http://localhost:9000/rest/loggedIn').then(response => {
    if(response.data !== null){
      //console.log("router.beforeEach: User is logged in, proceed with route");
      store.commit('current_user', response.data);
      store.commit('loggedIn', true);

      console.log('updated login');
      //console.log(store.state.current_user.bruker_id);
      axios.get('http://localhost:9000/rest/undergrupperForBruker/' + response.data.bruker_id).then(response => {
        store.commit('isMember', response.data.length > 0);
        console.log(response.data[0]);
        console.log('updated groups');
        store.commit('current_group', response.data[0]);
        if (!store.state.isMember && store.state.loggedIn) router.push('NewUser');
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
