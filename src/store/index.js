import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state:{
    current_user:{},
    current_group:{},
    loggedIn: false
  },
  mutations: {
    current_user(state, new_user){ state.current_user = new_user; },
    current_group(state, new_group){ state.current_group = new_group; },
    loggedIn(state, logged_in){ state.loggedIn = logged_in; }
  }
});


