<template>
  <div class="box">
    <h1 class="title is-3">Oversikt over utgifter</h1>
    <table class="table is-striped is-bordered is-fullwidth is-hoverable">
      <thead>
      <tr>
        <th>Tittel</th>
        <th>Sum</th>
        <th>Kvittering</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th>Helg</th>
        <th>495.00</th>
        <th><button class="button">Se kvittering</button></th>
      </tr>
      <tr>
        <th>Mat hverdag</th>
        <th>495.00</th>
        <th><button class="button">Se kvittering</button></th>
      </tr>
      <tr>
        <th>Renhold</th>
        <th>495.00</th>
        <th><button class="button">Se kvittering</button></th>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <th>Total</th>
        <th>1485.00</th>
      </tr>
      </tfoot>
    </table>
    <br>
    <br>
    <router-link class="button" to="/AddExpence">Legg til utgift</router-link>
  </div>
</template>

<script>
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
          },
          {
            label: 'Kvittering',
            field: 'kvittering',
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
            let obj = {tittel: resRows[i].overskrift, sum: resRows[i].tekst};
            this.rows.push(obj);
          }
        }).catch(err => {
          console.log(err);
        });
      }
    }
  }
</script>
