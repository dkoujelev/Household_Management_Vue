<template>
  <div>
    <vue-good-table
      title="Gjøremål liste"
      :columns="columns"
      :rows="rows"
      :onClick="fillRows"
      :paginate="true"
      per-page=5
      next-text="Neste"
      prev-text="Forrige"
      rows-per-page-text="Antall rader"
      of-text="av"

    />
  <!--  <router-link class="button" to="/Addnews">Lag nyhet</router-link> -->
    <!-- row, index -->
  </div>
</template>

<script>
  import TodoList from '@/components/TODO/TodoList'
  import axios from 'axios';
  import Vue from 'vue'
  import VueGoodTable from 'vue-good-table';
  Vue.use(VueGoodTable);

    export default {
      name: 'TodoListOverview',
      data() {
        return {
          columns: [
            {
              label: 'Gruppe',
              field: 'brukerListe',
              filterable: false
            },
            {
              label: 'Tittel',
              field: 'tittel',
              filterable: false
            },
            {
              label: 'Dato',
              field: 'date',
              filterable: false,
              type: 'date',
              inputFormat: 'YYYYMMDD',
              outputFormat: 'MMM Do YY',
            },
            {
              label: 'Status',
              field: 'status',
              filterable: false
            },
          ],
          rows: []
        }
      },
      mounted(){
      this.fillRows()
  },

// [{}] <- betyr at array inneholder et objekt

     // methods: {
      created() {
         // fillRows(){
          axios.get('http://localhost:9000/rest/gjoremalslisterBruker/1').then(response => {
            //alert('Alle lister til bruker hentet');
            let resRows = response.data;
            console.log(resRows);
            for(let i = 0; i < resRows.length; i++) {
              let obj = {brukerListe: resRows[i].undergruppe, tittel: resRows[i].navn,  date: resRows[0].opprettet};
              this.rows.push(obj);
            }
          }).catch(err => {
            console.log(JSON.stringify(err));
          });
        },
    //  }

      methods: {

        fillRows(){
          axios.get('http://localhost:9000/rest/gjoremalslisterUndergruppe/1').then(response => {
            //alert('Alle lister til bruker hentet');
            let resRows = response.data;
            for(let i = 0; i < resRows.length; i++){
              let obj = {undergruppeListe: resRows[i].undergruppe_id, navnTodo: resRows[i].navn, opprettet: resRows[i].opprettet};
              this.rows.push(obj);
            }
          }).catch(err => {
            console.log(JSON.stringify(err));
          });
          }
        }

      }

</script>

<style scoped>

</style>
