<template>
    <vue-good-table
      title="Regnskap"
      :columns="columns"
      :rows="rows"
      :paginate="true"
      per-page=5
      next-text="Neste"
      prev-text="Forrige"
      rows-per-page-text="Antall rader"
      of-text="av"

    />
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'SeeAccounting',

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
            label: 'Når',
            field: 'nar',
            html: false,
            filterable: false
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
    },
    methods: {
      formateDate(raw){
        return raw.substring(8, 10) + " " + raw.substring(5, 7) + " " + raw.substring(0,4)
          + " kl: " + raw.substring(11, 16);
      },
      fillRows(){
        axios.get('http://localhost:9000/rest/melding/sendt/bruker/1').then(response => {
          let resRows = response.data;
          for(let i = 0; i < resRows.length; i++){
            let date = this.formateDate(resRows[i].sendt);
            let obj = {tittel: resRows[i].overskrift, nar: date, sum: resRows[i].sendt_til_kollektiv};
            this.rows.push(obj);
          }
        }).catch(err => {
          console.log(err);
        });
      }
    }
  }
</script>
