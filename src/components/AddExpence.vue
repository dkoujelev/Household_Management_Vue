<template>
  <div class="block">
    <h1 class="title is-3">Legg til utgift</h1>
    <div class="field">
      <input class="input" type="text" v-model="expence.tittel" placeholder="Beskrivelse">
    </div>
    <div class="field">
      <input class="input" type="number" v-model="expence.sum" placeholder="Sum - total utgift for gruppe">
    </div>

    <div class="field">
      <a class="button is-danger" @click="$router.back()">Avbryt</a>
      <a href="#" class="button is-primary" @click.prevent="addExpence">Legg til utgift for gruppe </a>

    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import {store} from '../store';
  import router from '../router';

  export default{
    name: 'AddExpence',
    data(){
        return{
            expence: {},
        };
    },
    methods: {
        addExpence(){
            this.expence.bruker_id = store.state.current_user.bruker_id;
            this.expence.undergruppe_id = store.state.current_group.undergruppe_id;
            this.expence.opprettet = new Date();
            console.log(JSON.stringify(this.expence));
          axios.post('http://localhost:9000/rest/kostnad',this.expence).then(response => {
            let newExpence = {};
            newExpence.tittel = this.expence.tittel;
            newExpence.sum = this.expence.sum;
            newExpence.kvittering = this.expence.kvittering;

            router.back();

            this.$emit('added-expence', newExpence);
          }).catch(err => {
            console.log(JSON.stringify(err));
          });
        }
    }
  }
</script>
