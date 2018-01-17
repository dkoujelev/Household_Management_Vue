<template>
  <div class="box">
    <div class="title">Brukere som skylder deg penger</div>
    <div class="level" v-for="user in users">
      <a @click="selectUser(user)">{{user.fornavn + " " + user.etternavn + " ( " + user.sum + " kr )"}}  <label></label><input type="checkbox" v-model="user.checked"></a>
    </div>
    <button>Fjern valgt gjeld</button>

  </div>
</template>
<script>

  import axios from 'axios';
  import router from '@/router/index'

  export default {
    props: ['current_user'],
    created(){
      axios.get('http://localhost:9000/rest/gjeldBrukerKreverInn/' + this.current_user.bruker_id).then(response => {
        this.users = response.data;
      }).catch(err => {
        console.log(err);
      });
    },
    data(){
        return {
            users: []
        };
    },
    methods:{
        selectUser(user){
          router.push({name: 'GjeldInnSpesifisert', params: {current_user: this.current_user, user_owes: user}});
        }
    }
  };
</script>
<style>

</style>
