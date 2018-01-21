<template>
  <div class="columns">
    <div class="column">
    <h1 class="title is-3">Oversikt over utgifter</h1>
    <table class="table is-striped is-bordered is-fullwidth is-hoverable">
      <thead>
      <tr>
        <th>Tittel</th>
        <th>Sum</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in rows">
        <th>{{row.tittel}}</th>
        <th>{{row.sum}}</th>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <th>Total</th>
        <th>{{totalsum}}</th>
      </tr>
      </tfoot>
    </table>
    <br>
    <br>
    <router-link class="button" to="/AddExpence">Legg til utgift</router-link>
  </div>
  </div>
</template>

<script>

  import axios from 'axios';

  export default {
    name: 'ShowExpences',

    data(){
      return {
        columns: [
          {
            label: 'Tittel',
            field: 'tittel',
            filterable: true,
            placeholder: "Søk"
          },
          {
            label: 'Sum',
            field: 'sum',
            type: 'number',
            html: false,
            sortable: true,
            filterable: false
          }
        ],
        rows: []
      };
    },
    mounted(){
      this.fillRows();
      console.log(window.test);
    },
    methods: {
      fillRows(){
        axios.get('http://localhost:9000/rest/kostnaderForUndergruppe/1').then(response => {
          this.rows = response.data;
        }).catch(err => {
          console.log(err);
        });
      }
    },
    computed:{
        totalsum(){
            let sum = 0;
            for(let row of this.rows){
                sum += row.sum;
            }
            return sum;
        }
    }
  }
</script>
