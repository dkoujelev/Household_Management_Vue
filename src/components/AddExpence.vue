<template>
  <div class="is-ancestor">
    <div class="is-parent">
      <div class="is-child">
        <div class="field-body">
          <p class="subtitle">Beskrivelse:&nbsp</p>
          <input class="input" type="text" style="width: 80%" v-model="expence.tittel" placeholder="Beskrivelse">
        </div>
        <br>
        <div class="field-body">
          <p class="subtitle">Total sum:&nbsp</p>
          <input class="input" type="number" style="width:80%"  v-model="expence.sum" placeholder="Summen blir delt likt til alle på gruppa">
        </div>
        <br>
        <div class="block">
          <div class="level">
            <div class="is-pulled-left">
              <a href="#" class="button is-primary" @click.prevent="addExpence">Legg til utgift for gruppe </a>
            </div>
            <div class="is-pulled-right">
              <a class="button is-danger" @click="$emit('closing')">Avbryt</a>
            </div>
          </div>
        </div>
      </div>
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
      clearInput(){
        this.expence = {};
      },
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
          this.clearInput();
          this.$emit('closing');
        }).catch(err => {
          console.log(JSON.stringify(err));
        });
      }
    }
  }
</script>
