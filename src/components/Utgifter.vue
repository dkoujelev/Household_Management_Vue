<template>
  <div>
    <vue-good-table
      title="Utgifter"
      :columns="columns"
      :rows="rows"
      :paginate="true"
      per-page=5
      next-text="Neste"
      prev-text="Forrige"
      rows-per-page-text="Antall rader"
      of-text="av"
      />
  </div>
</template>

<script>
  import axios from 'axios';
  import Vue from 'vue'
  import VueGoodTable from 'vue-good-table';

  Vue.use(VueGoodTable);

  export default {
    name: 'utgifter',
    data(){
      return {
        columns: [
          {
            label: 'Kostnad',
            field: 'kostnad',
            filterable: true
          },
          {
            label: 'Sum',
            field: 'sum',
            type: 'number',
            html: false,
            filterable: false
          }
        ],
        rows: []
      };
    },
    mounted(){
      this.fillRows();
    },
    methods: {
      fillRows(){
        axios.get('http://localhost:9000/rest/melding/sendt/bruker/1').then(response => {
          let resRows = response.data;
          for(let i = 0; i < resRows.length; i++){
            let obj = {kostnad: resRows[i].overskrift, sum: resRows[i].tekst};
            this.rows.push(obj);
          }
        }).catch(err => {
          console.log(err);
        });
      }
    }
  }
</script>

<style scoped>

</style>
