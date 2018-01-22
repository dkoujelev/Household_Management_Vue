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
        <td>{{row.tittel}}</td>
        <td>{{row.sum}}</td>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <td>Total</td>
        <td>{{totalsum}}</td>
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
  import {store} from '../store';

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
        ]
      };
    },
    asyncComputed: {
      rows(){
          console.log("COMPUTING ROWS");
        //Returner en tom liste hvis vi mottar null fra serveren.
        return axios.get('http://localhost:9000/rest/kostnaderForUndergruppe/' + store.state.current_group.undergruppe_id)
          .then(response  => (response.data === null ? [] : response.data));
      },
      totalsum(){
        if(this.rows === null || this.rows.length === 0)
          return 0;
        else
          return this.rows.map(row => row.sum).reduce((prev, next) => prev + next);
      }
    }
  }
</script>
