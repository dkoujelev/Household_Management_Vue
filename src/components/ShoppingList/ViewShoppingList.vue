<template>
  <div>

    <vue-good-table
      title="Handlelister"
      :columns="columns"
      :rows="rows"
    ></vue-good-table>
    <br />
    <button class="button is-danger">Slett liste</button>

  </div>
</template>

<script>
  import axios from 'axios';
  import Vue from 'vue'
  import VueGoodTable from 'vue-good-table';
  Vue.use(VueGoodTable);


  export default {
    name: 'Shoppinglists',

    data(){
      return {
        columns: [
          {
            label: 'Vare',
            field: 'vare',
            filterable: false
          },
          {
            label: 'Antall',
            field: 'antall',
            filterable: false
          },
        ],
        rows: []
      };
    },
    mounted(){
      this.fillRows();
    },
    methods: {

      fillRows(){
        console.log(this.$root.$data.handleliste_id);
        axios.get('http://localhost:9000/rest/handleliste/' + this.$root.$data.handleliste_id).then(response => {
          console.log(response.data);
          let resRows = response.data.varer;
          for(let i = 0; i < resRows.length; i++){
            let obj = {vare: resRows[i].navn, antall: resRows[i].antall};
            this.rows.push(obj);
          }
        }).catch(err => {
          console.log(err);
        });
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }

</style>
