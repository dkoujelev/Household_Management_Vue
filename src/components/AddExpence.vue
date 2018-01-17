<template>
  <div class="block">
    <h1 class="title is-3">Legg til utgift</h1>
    <div class="field">
      <input class="input" type="text" v-model="expence.tittel" placeholder="Tittel">
    </div>
    <div class="field">
      <input class="input" type="number" v-model="expence.sum" placeholder="Sum">
    </div>

    <div class="field">
      <a href="#" class="button">Last opp kvittering</a>
      <a href="#" class="button is-primary" @click.prevent="addExpence">Legg til utgift</a>
      <br>
      <br>
      <router-link class="button is-danger" @click.prevent="$emit('cancel')" to="/SeeAccounting">Avbryt</router-link>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default{
    name: 'AddExpence',
    data(){
        return{
            expence: {},
        };
    },
    methods: {
        addExpence(){



            this.expence.bruker_id = window.current_user.bruker_id;
            this.expence.undergruppe_id = window.current_group.undergruppe_id;
            this.expence.opprettet = new Date();
            console.log(JSON.stringify(this.expence));
          axios.post('http://localhost:9000/rest/kostnad',this.expence).then(response => {
            let newExpence = {};
            newExpence.tittel = this.expence.tittel;
            newExpence.sum = this.expence.sum;
            newExpence.kvittering = this.expence.kvittering;
            this.$emit('added-expence', newExpence);
          }).catch(err => {
            console.log(JSON.stringify(err));
          });
        }
    }
  }
</script>
