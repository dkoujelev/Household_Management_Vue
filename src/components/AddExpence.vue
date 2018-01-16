<template>
  <div class="block">
    <h1 class="title is-3">Legg til utgift</h1>
    <div class="field">
      <input class="input" type="text" placeholder="Navn på utgift">
    </div>
    <div class="field">
      <input class="input" type="number" placeholder="Sum">
    </div>

    <div class="field">
      <label class="label">Kommentar</label>
      <div class="control">
        <textarea class="textarea" placeholder="Textarea"></textarea>
      </div>
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
    props: ['?'],
    data(){
        return{
            expences: [],
            expence: {},
        };
    },
    created(){

    },
    methods: {
        addExpence(){

        }
    }
  }
</script>
