<template>
  <div id="bg">
    <nav class="navbar is-success is-active is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link class="navbar-item" to="/">
          <img src="./img/logo_medium.png" alt="image not found" width="175"/>
        </router-link>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <router-link class="navbar-item" to="/">Hjem</router-link>
          <router-link class="navbar-item" to="/HelloWorld">Hello World!</router-link>
          <router-link class="navbar-item" to="/Task">Gjøremål</router-link>
          <router-link class="navbar-item" to="/Login">Login</router-link>
          <router-link class="navbar-item" to="/Register">Registrer deg</router-link>
          <router-link class="navbar-item" to="/Test">Test!</router-link>
          <router-link class="navbar-item" to="/Nyhetsfeed">Nyhet</router-link>
          <router-link class="navbar-item" to="/Shoppinglists">Handlelister</router-link>
          <router-link class="navbar-item" to="/AddCostRegister">Legg til kostnad</router-link>
        </div>
        <div class="navbar-end">
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
    <p>Innlogget bruker: {{current_user.epost}}</p>
    <p>Aktiv gruppe: {{current_group.navn}}</p>
    <router-view/>
  </div>
</template>

<script>

  import SelectGroup from '@/components/SelectGroup';
  import AddCollective from '@/components/AddCollective';

export default {
  name: 'dashboard',
  components: {SelectGroup, AddCollective},
  methods:{
      selectedGroup(group){
          this.current_group = group;
      }
  },
  data(){
      return {
          current_user:{
            "bruker_id": 1,
            "epost": "sj@apple.com",
            "fornavn": "Steve ",
            "etternavn": "Jobs",
            "tlf": "12345678",
            "adresse": "California",
            "hashed_passord": "",
            "salt": ""
          },
        current_group : {navn: ''},
        addingGroup: false
      };
  },
  computed: {
      isLoggedIn(){
          return (this.current_user != null);
      },
    current_email(){
          if(this.current_user != null)
            return this.current_user.epost
          else return '';
    }
  }
}
</script>

<style>
</style>
