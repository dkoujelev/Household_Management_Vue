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
      data() {
        return {
          columns: [
            {
              label: 'Gruppe',
              field: 'Tittel',
              filterable: false
            },
            {
              label: 'Tittel',
              field: 'navn',
              filterable: false
            },
            {
              label: 'Dato',
              field: 'opprettet',
              filterable: false,
              type: 'date',
              inputFormat: 'YYYYMMDD',
              outputFormat: 'MMM Do YY',
            },
            {
              label: 'Arkivere',
              field: 'Arkiv',
              filterable: false
            },
          ],
          rows: [{navn: 'test', opprettet: new Date() }]
        }
      },
// [{}] <- betyr at array inneholder et objekt

      created() {
          let userTodoList =
            {
              id: 1,
              navn: "",
              opprettet: new Date(),
              undergruppe_id: "",
              ferdig: null
            };
          console.dir(userTodoList);
          axios.get('rest/gjoremalslisterBruker/:bruker_id', userTodoList).then(response => {
            alert('Alle lister til bruker hentet');
            console.log("1");
            router.sort(userTodoList);
          }).catch(err => {
            console.log(JSON.stringify(err));
          });
        }
    }
</script>

<style scoped>

</style>
