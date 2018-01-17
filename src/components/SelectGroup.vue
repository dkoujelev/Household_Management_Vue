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
      created(){
          axios.get('http://localhost:9000/rest/undergrupperForBruker/' + this.current_user.bruker_id).then(response => {
            this.groups = response.data;
          }).catch(err => {
          });
      },
    data(){
          return {
              groups: [],
          };
    }
  };
</script>
<style></style>
