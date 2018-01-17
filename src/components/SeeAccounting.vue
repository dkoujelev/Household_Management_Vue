<template>
  <div class="app">
    <div class="block">
      <h1 class="title is-3">Regnskap</h1>
      <table class="table is-striped is-bordered is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>Navn på liste</th>
            <th>Når</th>
            <th>Sum</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Helg</th>
            <th>21.01.2018</th>
            <th>495.00</th>
          </tr>
          <tr>
            <th>Mat hverdag</th>
            <th>27.01.2018</th>
            <th>495.00</th>
          </tr>
          <tr>
            <th>Renhold</th>
            <th>31.01.2018</th>
            <th>495.00</th>
          </tr>
        </tbody>
        <tfoot>
        <tr>
          <th>Total</th>
          <th></th>
          <th>1485.00</th>
        </tr>
        </tfoot>
      </table>
          <router-link class="button" to="/AddExpence">Legg til utgift</router-link>
      <br>
      <br>
      </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
            field: 'når',
            type: 'date',
            filterable: true
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
      fillRows(){
        axios.get('http://localhost:9000/rest/melding/sendt/bruker/1').then(response => {
          let resRows = response.data;
          for(let i = 0; i < resRows.length; i++){
            let obj = {tittel: resRows[i].overskrift, når: resRows[i].date, sum: resRows[i].tekst};
            this.rows.push(obj);
          }
        }).catch(err => {
          console.log(err);
        });
      }
    }
  }
</script>
