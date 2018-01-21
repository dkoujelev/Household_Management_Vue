<template>

  <div>
    <!-- START NAV -->
    <nav class="navbar is-dark is-fixed-top">
        <div class="navbar-brand">

            <router-link class="navbar-item" v-if="loggedIn" to="/home">
              <img src="./img/logo_small.png" alt="image not found" width="45"/>
            </router-link>
            <router-link class="navbar-item" v-if="!loggedIn" to="/home">
              <img src="./img/logo_small.png" alt="image not found" width="45"/>
            </router-link>

          <div class="navbar-burger burger" @click="showNav = !showNav" v-bind:class="{'is-active' : showNav}" data-target="navMenu" v-if="loggedIn">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
          <div id="navMenu1" class="navbar-menu" v-bind:class="{'is-active': showNav}">
            <div class="navbar-start" @click="showNav = false">
              <router-link class="navbar-item" v-if="loggedIn" to="/Nyhetsfeed">Nyhet</router-link>
              <router-link class="navbar-item" v-if="loggedIn" to="/TodoList">Gjøremål</router-link>
              <router-link class="navbar-item" v-if="loggedIn" to="/Shoppinglists">Handlelister</router-link>
              <router-link class="navbar-item" v-if="loggedIn" to="/ShowExpences">Utgifter</router-link>
              <router-link class="navbar-item" v-if="loggedIn" to="/Innmelding">Innmelding</router-link>
              <router-link class="navbar-item" v-if="loggedIn" to="/TestMail">TestMail</router-link>
              <router-link class="navbar-item" v-if="loggedIn" :to="{name: 'GjeldInn', params: {current_user: current_user}}">Gjeld Inn</router-link>
              <router-link class="navbar-item" v-if="loggedIn" :to="{name: 'GjeldUt', params: {current_user: current_user}}">Gjeld Ut</router-link>
            </div>

            <div class="navbar-end" @click="showNav = false">
              <a href="" class="navbar-item" v-if="loggedIn" @click.prevent="logOut">Logg Ut</a>
            </div>
          </div>
    </nav>
    <!-- END NAV -->

    <br/><br/><br/>

    <div class="container">
      <p v-if="loggedIn">Innlogget bruker: {{$store.state.current_user.epost}}</p>
      <p v-if="loggedIn">Aktiv gruppe: {{$store.state.current_group.navn}}</p>
      <router-view/>
    </div>

  </div>
</template>

<script>

  import SelectGroup from '@/components/SelectGroup';
  import AddCollective from '@/components/AddCollective';
  import AddGroup from '@/components/AddGroup';
  import router from '@/router/index.js';
  import axios from 'axios';
  import {store} from './store';

export default {
  name: 'dashboard',
  components: {SelectGroup, AddCollective, AddGroup},
  methods:{
      selectedGroup(group){
          store.commit('current_group',group);
      },
    addedGroup(group){
      this.$refs.SelectGroup.loadGroups();
      this.addingGroup = false;
    },
    addedCollective(collective){
      this.$refs.SelectGroup.loadGroups();
      this.addingCollective = false;
    },
    logOut(){
        store.state.loggedIn=false;
        axios.post('http://localhost:9000/rest/logout');
        router.push('Login');
    }
  },
  created(){
      axios.get('http://localhost:9000/rest/loggedIn').then(response => {
          if(response.data){
            store.commit('current_user',response.data);
            store.commit('loggedIn',true);
          }
      });
  },
  data(){
      return {
        showNav: false,
        addingCollective: false,
        addingGroup: false
      };
  },
  computed:{
      loggedIn(){
          return store.state.loggedIn;
      }
  }
}
</script>

<style>
</style>
