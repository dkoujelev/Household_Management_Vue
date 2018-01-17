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

  export default {
    props: ['current_user'],
      mounted(){
      },
    data(){
          return {
              groups: [],
          };
    },
    watch:{
      current_user: function(newVal, oldVal){
        console.log('loadin groups for user ' + this.current_user.epost);
        axios.get('http://localhost:9000/rest/undergrupperForBruker/' + this.current_user.bruker_id).then(response => {
            this.groups = response.data;
          }).catch(err => {
        });
      }
    }
  };
</script>
<style></style>
