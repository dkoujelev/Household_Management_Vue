<template>
  <div>
    <nav class="navbar is-dark is-active is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link class="navbar-item" to="/home" v-if="loggedIn">
          Hjem
          <img src="./img/Minilogo.png" alt="image not found" width="45"/>
        </router-link>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">

          <router-link class="navbar-item" v-if="loggedIn" to="/TodoList">Gjøremål</router-link>
          <router-link class="navbar-item" v-if="!loggedIn" to="/Login">Login</router-link>
          <router-link class="navbar-item" v-if="!loggedIn" to="/Register">Registrer deg</router-link>
          <router-link class="navbar-item" v-if="loggedIn" to="/Nyhetsfeed">Nyhet</router-link>
          <router-link class="navbar-item" v-if="loggedIn" to="/Shoppinglists">Handlelister</router-link>
          <router-link class="navbar-item" v-if="loggedIn" to="/ShowExpences">Utgifter</router-link>
          <router-link class="navbar-item" v-if="loggedIn" to="/Innmelding">Innmelding</router-link>
          <router-link class="navbar-item" v-if="loggedIn" to="/TestMail">TestMail</router-link>
          <router-link class="navbar-item" v-if="loggedIn" to="/GjeldInn">Gjeld Inn</router-link>
          <router-link class="navbar-item" v-if="loggedIn" to="/GjeldUt">Gjeld Ut</router-link>
          <a href="" class="navbar-item" v-if="loggedIn" @click.prevent="logOut">Logg Ut</a>

        </div>
        <div class="navbar-end" v-if="loggedIn" >
          <SelectGroup @selected-group="selectedGroup" ref="SelectGroup"></SelectGroup>

          <a href="" class="navbar-item" @click.prevent="addingCollective=true">
            <i class="fa fa-plus"></i>
          </a>
          <div class="modal" v-bind:class="{'is-active' : addingCollective}" transition="zoom">
            <div class="content has-text-centered">
              <AddCollective @cancel="addingCollective=false" @added-collective="addedCollective"></AddCollective>
            </div>
          </div>

          <a href="" class="navbar-item" @click.prevent="addingGroup=true">
            <i class="fa fa-plus"></i>
          </a>
          <div class="modal" v-bind:class="{'is-active' : addingGroup}" transition="zoom">
            <div class="content has-text-centered">
              <addGroup @cancel="addingGroup=false" @added-group="addedGroup"></addGroup>
            </div>
          </div>

        </div>
      </div>
    </nav>
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
          store.state.current_group = group;
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
            store.state.current_user = response.data;
            store.state.loggedIn = true;
          }
      });
  },
  data(){
      return {
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
