<template>
  <div class="navbar-item has-dropdown is-hoverable">
    <a class="navbar-link">
      Mine grupper
    </a>
    <div class="navbar-dropdown">
      <a v-for="group in groups" class="navbar-item" @click="$emit('selected-group',group)">
        {{group.default_gruppe ? group.kollektiv_navn : ('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      * ' + group.navn)}}
      </a>
    </div>
  </div>
</template>
<script>

  import axios from 'axios';
  import {store} from '../store';

  export default {
    props: ['current_user'],
      created(){
        this.loadGroups();
      },
    data(){
          return {
              groups: [],
          };
    },
    watch:{
      current_user: function(newVal, oldVal){
          this.loadGroups();
      }
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
