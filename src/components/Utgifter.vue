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
            filterable: true,
            placeholder: "Søk i kostnader"
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
        rows: [],
        bruker: this.$parent.$data.current_user
      };
    },
    mounted(){
      this.fillRows();
    },
    methods: {
      fillRows(){
        axios.get('http://localhost:9000/rest/melding/sendt/bruker/' + this.bruker.bruker_id).then(response => {
          let resRows = response.data;
          for(let i = 0; i < resRows.length; i++){
            let obj = {kostnad: resRows[i].overskrift, sum: 100};
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
