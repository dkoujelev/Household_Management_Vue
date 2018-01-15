<template>
  <div>
    <nav class="navbar is-success is-active is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link class="navbar-item" to="/">
          <img src="./img/logo_medium.png" alt="image not found" width="175"/>
        </router-link>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <router-link class="navbar-item" v-show="isLoggedIn" to="/HelloWorld">Hello World!</router-link>
          <router-link class="navbar-item" v-show="isLoggedIn" to="/Task">Gjøremål</router-link>
          <router-link class="navbar-item" v-show="!isLoggedIn" to="/Login">Login</router-link>
          <router-link class="navbar-item" v-show="!isLoggedIn" to="/Register">Registrer deg</router-link>
          <router-link class="navbar-item" v-show="isLoggedIn" to="/Test">Test!</router-link>
          <a class="navbar-item" href="#" @click="logout" v-show="isLoggedIn">Logg ut</a>
        </div>
        <div class="navbar-end" v-show="isLoggedIn">
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
    <p>Innlogget bruker: {{current_email}}</p>
    <p>Aktiv gruppe: {{current_group.navn}}</p>
    <router-view @loggedin_user="loggedin_user"/>
  </div>
</template>

<script>

  import SelectGroup from '@/components/SelectGroup';
  import AddCollective from '@/components/AddCollective';
  import router from '@/router/index';

export default {
  name: 'dashboard',
  components: {SelectGroup, AddCollective},
  methods:{
      selectedGroup(group){
          this.current_group = group;
      },
      loggedin_user(user){
          this.current_user = user;
      },
    logout(){
          this.current_user = null;
          router.push('/login');
    }
  },
  data(){
      return {
          current_user: null,
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
