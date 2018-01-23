<template>
  <div class="navbar-item has-dropdown is-hoverable">
    <a class="navbar-link">
      Mine grupper
    </a>
    <div class="navbar-dropdown">
      <div v-for="group in groups" class="navbar-item" @click="$emit('selected-group',group)">
        <h3 v-if="group.default_gruppe">{{group.kollektiv_navn}}</h3>
        <p v-else>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{group.navn}} </p>
      </div>

      <p v-for="group in groups" class="navbar-item" @click="$emit('selected-group',group)">
        {{group.default_gruppe ? "group.kollektiv_navn" : ('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      * ' + group.navn)}}
      </p>
    </div>
  </div>
</template>
<script>

  import axios from 'axios';
  import {store} from '../store';

  export default {
      created(){
        this.loadGroups();
      },
    data(){
          return {
              groups: [],
          };
    },
    methods:{
      loadGroups(){
        console.log('loading groups for user ' + store.state.current_user.epost);
        axios.get('http://localhost:9000/rest/undergrupperForBruker/' + store.state.current_user.bruker_id).then(response => {
          this.groups = response.data;
        }).catch(err => {
        });
      }
    }
  };
</script>
<style></style>
