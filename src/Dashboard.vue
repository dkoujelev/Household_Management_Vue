<template>
  <div>
    <nav class="navbar is-success is-active is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link class="navbar-item" to="/home" v-if="loggedIn">
          Hjem
          <!--<img src="./img/logo_medium.png" alt="image not found" width="175"/>-->
        </router-link>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <router-link class="navbar-item" v-if="loggedIn" to="/TodoList">Gjøremål</router-link>
          <router-link class="navbar-item" v-if="!loggedIn" to="/Login">Login</router-link>
          <router-link class="navbar-item" v-if="!loggedIn" to="/Register">Registrer deg</router-link>
          <router-link class="navbar-item" v-if="loggedIn" to="/Nyhetsfeed">Nyhet</router-link>
          <router-link class="navbar-item" v-if="loggedIn" to="/Shoppinglists">Handlelister</router-link>
          <router-link class="navbar-item" v-if="loggedIn" to="/Utgifter">Utgifter</router-link>
          <router-link class="navbar-item" v-if="loggedIn" to="/ShowExpences">Utgifter</router-link>
        </div>
        <div class="navbar-end" v-if="loggedIn" >
          <SelectGroup :current_user="current_user" @selected-group="selectedGroup" ref="SelectGroup"></SelectGroup>

          <a href="" class="navbar-item" @click.prevent="addingCollective=true">
            <i class="fa fa-plus"></i>
          </a>
          <div class="modal" v-bind:class="{'is-active' : addingCollective}" transition="zoom">
            <div class="content has-text-centered">
              <AddCollective :current_user="current_user" @cancel="addingCollective=false" @added-collective="addedCollective"></AddCollective>
            </div>
          </div>

          <a href="" class="navbar-item" @click.prevent="addingGroup=true">
            <i class="fa fa-plus"></i>
          </a>
          <div class="modal" v-bind:class="{'is-active' : addingGroup}" transition="zoom">
            <div class="content has-text-centered">
              <addGroup :current_group="current_group" :current_user="current_user" @cancel="addingGroup=false" @added-group="addedGroup"></addGroup>
            </div>
          </div>

        </div>
      </div>
    </nav>
    <br/><br/><br/>

    <div class="container">
      <p v-if="loggedIn">Innlogget bruker: {{current_user.epost}}</p>
      <p v-if="loggedIn">Aktiv gruppe: {{current_group.navn}}</p>
      <router-view/>
    </div>
  </div>
</template>

<script>

  import SelectGroup from '@/components/SelectGroup';
  import AddCollective from '@/components/AddCollective';
  import AddGroup from '@/components/AddGroup';
  import router from '@/router/index.js';

export default {
  name: 'dashboard',
  components: {SelectGroup, AddCollective, AddGroup},
  methods:{
      selectedGroup(group){
          this.current_group = group;
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
        this.loggedIn=false;
        router.push('Login');
    }
  },
  created(){
//      window.current_group= {navn: 'test', undergruppe_id: 1};
//      window.current_user = {
//      "bruker_id": 1,
//        "epost": "sj@apple.com",
//        "fornavn": "Steve ",
//        "etternavn": "Jobs",
//        "tlf": "12345678",
//        "adresse": "California",
//        "hashed_passord": "",
//        "salt": ""
//    };
  },
  data(){
      return {
        loggedIn: false, //TODO: MAKE SECURE
        current_user: {
          "bruker_id": 1,
          "epost": "sj@apple.com",
          "fornavn": "Steve ",
          "etternavn": "Jobs",
          "tlf": "12345678",
          "adresse": "California",
          "hashed_passord": ""
        },
        current_group:{
          "navn": "Testkollektiv 1",
          "beskrivelse": "test",
          "undergruppe_id": 1,
          "kollektiv_id": 1,
          "default_gruppe": 1
        },
        addingCollective: false,
        addingGroup: false
      };
  }
}
</script>

<style>
</style>
