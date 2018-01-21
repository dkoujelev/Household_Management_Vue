<template>
  <div class="box">
    <div class="title">Brukere du skylder penger</div>
    <div class="level" v-for="user in users">
      <a>{{user.fornavn + " " + user.etternavn + " ( " + user.sum + " kr )"}}</a>
    </div>

  </div>
</template>
<script>

  import axios from 'axios';
  import {store} from '../../store'

  export default {
    created(){
      axios.get('http://localhost:9000/rest/gjeldBrukerErSkyldig/' + store.state.current_user.bruker_id).then(response => {
        this.users = response.data;
      }).catch(err => {
        console.log(err);
      });
    },
    data(){
      return {
        users: []
      };
    }
  };
</script>
<style>

</style>
