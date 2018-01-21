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
            <div class="navbar-start" @click="showNav = !showNav">
              <router-link class="navbar-item" v-if="loggedIn" to="/Nyhetsfeed">Nyhet</router-link>
              <router-link class="navbar-item" v-if="loggedIn" to="/TodoList">Gjøremål</router-link>
              <router-link class="navbar-item" v-if="loggedIn" to="/Shoppinglists">Handlelister</router-link>
              <router-link class="navbar-item" v-if="loggedIn" to="/ShowExpences">Utgifter</router-link>
              <router-link class="navbar-item" v-if="loggedIn" to="/Innmelding">Innmelding</router-link>
              <router-link class="navbar-item" v-if="loggedIn" to="/TestMail">TestMail</router-link>
              <router-link class="navbar-item" v-if="loggedIn" :to="{name: 'GjeldInn', params: {current_user: current_user}}">Gjeld Inn</router-link>
              <router-link class="navbar-item" v-if="loggedIn" :to="{name: 'GjeldUt', params: {current_user: current_user}}">Gjeld Ut</router-link>
            </div>
            <div class="navbar-end" @click="showNav = !showNav">
              <a href="" class="navbar-item" v-if="loggedIn" @click.prevent="logOut">Logg Ut</a>
            </div>
          </div>
    </nav>
    <!-- END NAV -->

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
        showNav: false,
        loggedIn: false, //TODO: MAKE SECURE
        current_user: {
          bruker_id: 1,
          epost: "sj@apple.com",
          fornavn: "Steve ",
          etternavn: "Jobs",
          tlf: "12345678",
          adresse: "California",
          hashed_passord: "",
          kollektiv: [] //{id: 0, grupper: [0, 1]}

        },
        current_group:{
          navn: "Testkollektiv 1",
          beskrivelse: "test",
          undergruppe_id: 1,
          kollektiv_id: 1,
          default_gruppe: 1
        },
        addingCollective: false,
        addingGroup: false
      };
  }
}
</script>

<style>
</style>
