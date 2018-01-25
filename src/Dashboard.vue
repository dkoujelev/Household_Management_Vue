<template>

  <div>
    <!-- START NAV -->
    <nav class="navbar is-link is-fixed-top">
        <div class="navbar-brand">
            <router-link class="navbar-item" to="/home">
              <img src="./img/logo_small.png" alt="image not found" width="45"/>
            </router-link>
          <div class="navbar-item">
            <SelectGroup v-if="showNav" ref="SelectGroup"> </SelectGroup>
          </div>
          <div class="navbar-burger burger" @click="showBurger = !showBurger" v-bind:class="{'is-active' : showBurger}" data-target="navMenu" v-if="showNav">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
          <div id="navMenu1" class="navbar-menu" v-bind:class="{'is-active': showBurger}">
            <div class="navbar-start" @click="showBurger = false">
              <router-link class="navbar-item" v-if="showNav" to="/Nyhetsfeed"><span class="icon"><i class="fa fa-envelope-open fa-lg"></i></span> &nbsp Nyheter &nbsp </router-link>
              <router-link class="navbar-item" v-if="showNav" to="/TodoList"><span class="icon"><i class="fa fa-bell fa-lg"></i></span> &nbsp Gjøremål &nbsp </router-link>
              <router-link class="navbar-item" v-if="showNav" to="/Shoppinglists"><span class="icon"><i class="fa fa-shopping-cart fa-lg"></i></span> &nbsp Handlelister &nbsp </router-link>
              <!-- <router-link class="navbar-item" v-if="showNav" to="/ShowExpences">Utgifter</router-link>
              <router-link class="navbar-item" v-if="showNav" to="/Innmelding">Innmelding</router-link>
              <router-link class="navbar-item" v-if="showNav" to="/TestMail">TestMail</router-link> -->
              <router-link class="navbar-item" v-if="showNav" to="/ShowAccounting"> <span class="icon"><i class="fa fa-calculator fa-lg" > </i>   </span> &nbsp Regnskap &nbsp </router-link>
              <router-link class="navbar-item" v-if="showNav" to="/UserInfo"><span class="icon"><i class="fa fa-user fa-lg"></i></span> &nbsp Min Side </router-link>


            </div>
            <div class="navbar-end" @click="showBurger = false">
              <a href="" class="navbar-item" v-if="loggedIn" @click.prevent="logOut"> <span class="icon"><i class="fa fa-power-off fa-lg"></i></span>  &nbsp Logg Ut</a>
            </div>
          </div>
    </nav>
    <!-- END NAV -->

    <br/><br/><br/>

    <div class="container">
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
