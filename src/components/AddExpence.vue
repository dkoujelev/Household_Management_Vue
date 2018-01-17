<template>
  <div class="block">
    <h1 class="title is-3">Legg til utgift (NB! Denne brukes nå både for regnskap og utgifter)</h1>
    <div class="field">
      <input class="input" type="text" placeholder="Tittel">
    </div>
    <div class="field">
      <input class="input" type="number" placeholder="Sum">
    </div>

    <div class="field">
      <a href="#" class="button">Last opp kvittering</a>
      <a href="#" class="button is-primary">Legg til utgift</a>
      <br>
      <br>
      <router-link class="button is-danger" to="/SeeAccounting">Avbryt</router-link>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default{
    name: 'AddExpence',
    data(){
        return{
            expences: [],
            expence: {},
        };
    },
    created(){
      axios.get('http://localhost:9000/rest/kollektiv').then(response => {
        this.expence = response.data;
      }).catch(err => {
        console.log(err);
      });
    },
    methods: {
        addExpence(){
          axios.post('http://localhost:9000/rest/kollektiv/' + this.current_user.bruker_id,this.expence).then(response => {
            let newExpence = {};
            newExpence.tittel = this.expence.tittel;
            newExpence.sum = this.expence.sum;
            newExpence.kvittering = this.expence.kvittering;
            this.$emit('added-expence', newExpence);
          }).catch(err => {
            console.log(err);
          });
        }
    }
  }
</script>
