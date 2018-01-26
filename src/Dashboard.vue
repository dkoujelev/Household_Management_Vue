<template>

  <div>
    <!-- START NAV -->
    <nav class="navbar is-link is-fixed-top">
        <div class="navbar-brand">
            <router-link class="navbar-item" to="/home">
              <img src="./img/logo_small.png" alt="image not found" width="45"/>
            </router-link>
          <div class="navbar-item">
            <SelectGroup v-if="showNav" ref="SelectGroup" style="width: 160px"> </SelectGroup>
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
              <router-link class="navbar-item" v-if="showNav" to="/MyTestPanel"> TestPanel </router-link>

            </div>
            <div class="navbar-end" @click="showBurger = false">
              <a href="" class="navbar-item" v-if="loggedIn" @click.prevent="logOut"> <span class="icon"><i class="fa fa-power-off fa-lg"></i></span>  &nbsp Logg Ut</a>
            </div>
          </div>
    </nav>
    <!-- END NAV -->
    <div class="myContainer" style="max-height: 100%">
      <br/><br/><br/>

      <div class="content">
        <router-view/>
      </div>


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
  /**.myContainer {
    background-color: #ffc14d;
    /** height: 100vh;


  }*/
  .content {

  }

  body {
    /** background-color: white; */
    background-image: url("./components/urban.jpg");
    /** background-repeat: repeat-x; /** repeting image */
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;

    /**Blured filter */
    /** -webkit-filter: blur(5px); */
    /** -moz-filter: blur(5px); */
    /** -o-filter: blur(5px); */
    /** -ms-filter: blur(5px); */
    /** filter: blur(5px); */

  }

   Alternative way:
  html {

  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}






</style>
