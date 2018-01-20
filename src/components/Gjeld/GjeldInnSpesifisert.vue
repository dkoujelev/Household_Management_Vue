<template>
  <div class="box">
    <div class="title">Penger som {{user_owes.fornavn + " " + user_owes.etternavn}} skylder deg</div>
    <div class="level" v-for="debt in debts">
      <a>{{debt.belop}}kr -  litt mer info her <input type="checkbox"></a>
    </div>
    <button>Fjern valgt gjeld</button>

  </div>
</template>
<script>

  import axios from 'axios';
  import {store} from '../../store';

  export default {
    props: ['user_owes'],
    created(){
      axios.post('http://localhost:9000/rest/gjeldSpesifisert', {skylder: this.user_owes.bruker_id , innkrever: store.state.current_user.bruker_id}).then(response => {
        this.debts = response.data;
      }).catch(err => {
        console.log(err);
      });
    },
    data(){
      return {
        debts: []
      };
    }
  };
</script>
<style>

</style>
