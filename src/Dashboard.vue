<template>

  <div>
    <!-- START NAV -->
    <nav class="navbar is-link is-fixed-top">
        <div class="navbar-brand">

            <router-link class="navbar-item" to="/home">
              <img src="./img/logo_small.png" alt="image not found" width="45"/>
            </router-link>

          <div class="navbar-burger burger" @click="showBurger = !showBurger" v-bind:class="{'is-active' : showBurger}" data-target="navMenu" v-if="showNav">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
          <div id="navMenu1" class="navbar-menu" v-bind:class="{'is-active': showBurger}">
            <div class="navbar-start" @click="showBurger = false">
              <router-link class="navbar-item" v-if="showNav" to="/Nyhetsfeed">Nyhet<span class="icon"><i class="fa fa-newspaper-o"></i></span></router-link>
              <router-link class="navbar-item" v-if="showNav" to="/TodoList">Gjøremål<span class="icon"><i class="fa fa-tasks"></i></span></router-link>
              <router-link class="navbar-item" v-if="showNav" to="/Shoppinglists">Handlelister<span class="icon"><i class="fa fa-shopping-cart"></i></span></router-link>
              <router-link class="navbar-item" v-if="showNav" to="/ShowExpences">Utgifter</router-link>
              <router-link class="navbar-item" v-if="showNav" to="/Innmelding">Innmelding</router-link>
              <router-link class="navbar-item" v-if="showNav" to="/TestMail">TestMail</router-link>
              <router-link class="navbar-item" v-if="showNav" to="/GjeldInn">Gjeld Inn</router-link>
              <router-link class="navbar-item" v-if="showNav" to="/GjeldUt">Gjeld Ut</router-link>
              <router-link class="navbar-item" v-if="showNav" to="/UserInfo">Min Side<span class="icon"><i class="fa fa-user"></i></span></router-link>
            </div>

            <div class="navbar-end" @click="showBurger = false">
              <SelectGroup v-if="loggedIn" :current_user="current_user" @selected-group="selectedGroup" ref="SelectGroup"></SelectGroup>
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
        showBurger: false,
        addingCollective: false,
        addingGroup: false
      };
  },
  computed:{
    showNav(){
      //console.log(store.state.loggedIn + " " + store.state.isMember);
      return store.state.loggedIn && store.state.isMember;
    },
    loggedIn(){
      return store.state.loggedIn;
    }
  }
}
</script>

<style>
  body {
    background-color: lightcyan;
    height: 100vh;
  }
</style>
