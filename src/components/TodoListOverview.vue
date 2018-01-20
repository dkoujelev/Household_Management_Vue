<template>
  <div>
    <vue-good-table
      title="TodoListOverview"
      :columns="columns"
      :rows="rows"
      :paginate="true"
      per-page=5
      next-text="Neste"
      prev-text="Forrige"
      rows-per-page-text="Antall rader"
      of-text="av"

    />
  <!--  <router-link class="button" to="/Addnews">Lag nyhet</router-link> -->
  </div>
</template>

<script>
  import axios from 'axios';
  import Vue from 'vue'
  import VueGoodTable from 'vue-good-table';
  Vue.use(VueGoodTable);

    export default {
      name: 'TodoListOverview',
      data(){
        return {
          columns: [
            {
              label: 'Grupppe',
              field: 'Tittel',
              filterable: false
            },
            {
              label: 'Tittel',
              field: 'nyhet',
              filterable: false
            },
            {
              label: 'Dato',
              field: 'nar',
              filterable: false
            }
          ],
          rows: []
        };

        getGroup(){

          let group =
            {
              //rest/undergrupperForBruker/:bruker_id
              
            }

        }

      },
    }
</script>

<style scoped>

</style>
