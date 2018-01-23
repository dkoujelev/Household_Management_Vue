<template>
  <div>
    <div class="is-ancestor">
      <div class="is-parent">
        <div class="is-child box">
          <vue-good-table
            title="Utgifter"
            :columns="columns"
            :rows="rows"
            :paginate="true"
            :onClick="click"
            per-page=5
            next-text="Neste"
            prev-text="Forrige"
            rows-per-page-text="Antall rader"
            of-text="av"
          />
        </div>
      </div>
    </div>
    </table>
    <br>
    <br>
    <router-link class="button" to="/AddExpence">Legg til utgift</router-link>
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
            filterable: false,
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
