<template>
  <div>
    <nav class="navbar is-success is-active is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link class="navbar-item" to="/home">
          <img src="./img/logo_medium.png" alt="image not found" width="175"/>
        </router-link>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <router-link class="navbar-item" v-show="loggedIn" to="/Task">Gjøremål</router-link>
          <router-link class="navbar-item" v-show="!loggedIn" to="/Login">Login</router-link>
          <router-link class="navbar-item" v-show="!loggedIn" to="/Register">Registrer deg</router-link>
          <router-link class="navbar-item" v-show="loggedIn" to="/Nyhetsfeed">Nyhet</router-link>
          <router-link class="navbar-item" v-show="loggedIn" to="/Shoppinglists">Handlelister</router-link>
          <router-link class="navbar-item" v-show="loggedIn" to="/ShowExpences">Utgifter</router-link>
          <a class="navbar-item" v-show="loggedIn" @click.prevent="logOut">Logg ut</a>
        </div>
        <div class="navbar-end" v-show="loggedIn" >
          <SelectGroup :current_user="current_user" @selected-group="selectedGroup"></SelectGroup>
          <a href="" class="navbar-item" @click.prevent="addingGroup=true">
            <i class="fa fa-plus"></i>
          </a>
          <div class="modal" v-bind:class="{'is-active' : addingGroup}" @blur="console.log('blurring'); addingGroup=false" transition="zoom">
            <div class="content has-text-centered">
              <AddCollective :current_user="current_user" @cancel="addingGroup=false"></AddCollective>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <br/><br/>
    <p v-show="loggedIn">Innlogget bruker: {{current_user.epost}}</p>
    <p v-show="loggedIn">Aktiv gruppe: {{current_group.navn}}</p>
    <router-view/>
  </div>
</template>

<script>

  import SelectGroup from '@/components/SelectGroup';
  import AddCollective from '@/components/AddCollective';
  import router from '@/router/index.js';

export default {
  name: 'dashboard',
  components: {SelectGroup, AddCollective},
  methods:{
      selectedGroup(group){
          this.current_group = group;
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
        addingGroup: false
      };
  }
}
</script>

<style>
</style>
