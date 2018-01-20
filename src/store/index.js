import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state:{
    current_user:{},
    current_group:{},
    loggedIn: false
  }
});


