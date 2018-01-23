<template>
  <div class="box">
    <div class="title">Penger som jeg skylder {{user_owes.fornavn + " " + user_owes.etternavn}} </div>
    <div class="level" v-for="debt in debts">
      <a> {{debt.belop}}kr -  litt mer info her <input type="checkbox"></a>
    </div>
    <button @click="$router.back()">Tilbake</button>


  </div>
</template>
<script>

  import axios from 'axios';
  import {store} from '../../store';

  export default {
    created(){
      axios.post('http://localhost:9000/rest/gjeldSpesifisert', {skylder: this.$route.params.bruker_skylder_id ,
        innkrever: store.state.current_user.bruker_id})
        .then(response => {
          this.debts = response.data;
          return axios.get('http://localhost:9000/rest/bruker/' + this.$route.params.bruker_skylder_id);
        }).then(response => this.user_owes = response.data)
        .catch(err => {
          console.log(err);
        });
    },
    data(){
      return {
        user_owes: {fornavn: '', etternavn: ''},
        debts: []
      };
    }
  };
</script>
<style>

</style>
