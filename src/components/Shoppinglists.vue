<template>
  <div>

    <vue-good-table
      title="Handlelister"
      :columns="columns"
      :rows="rows"
      :paginate="true"
      per-page=5
    next-text="Neste"
    prev-text="Forrige"
    rows-per-page-text="Antall rader"
    of-text="av"

    />
    <router-link class="button" to="/ShoppingList">Lag handleliste</router-link>

  </div>
</template>

<script>
  import Addnews from './Addnews';
  import axios from 'axios';
  import Vue from 'vue'
  import VueGoodTable from 'vue-good-table';
  Vue.use(VueGoodTable);
  import Shoppinglist from './ShoppingList/ShoppingList'

  export default {
    name: 'Shoppinglists',
    components: {Shoppinglist},

    data(){
      return {
        columns: [
          {
            label: 'Navn',
            field: 'navn',
            filterable: false
          },
          {
            label: 'Frist',
            field: 'frist ',
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
      /*formateDate(raw){
        return raw.substring(8, 10) + " " + raw.substring(5, 7) + " " + raw.substring(0,4)
          + " kl: " + raw.substring(11, 16);
      },*/
      fillRows(){
        axios.get('http://localhost:9000/rest/handlelisteForUndergruppe/1').then(response => {
          let resRows = response.data;
          for(let i = 0; i < resRows.length; i++){
            //let date = this.formateDate(resRows[i].frist);
            let obj = {navn: resRows[i].navn, Frist: resRows[i].frist};
            console.log(resRows[i].frist);
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
