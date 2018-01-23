<template>
  <div>
    <table>
      <thead>
      <th>Handleliste</th>
      <th>Frist</th>
      <th></th>
      </thead>
      <tr v-for="row in rows">
        <td>{{row.vare}}</td>
        <td>{{row.antall}}</td>
        <td><input type="checkbox" class="checkbox"/></td>
        <td><button class="button">Fjern vare</button></td>
      </tr>
    </table>
    <br />
    <button class="button">Legg til vare</button>
    <button class="button is-danger">Slett liste</button>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'Shoppinglists',

    data(){
      return {
        rows: []
      };
    },
    mounted(){
      this.fillRows();
    },
    methods: {

      fillRows(){
        axios.get('http://localhost:9000/rest/handleliste/' + this.$route.params.shoppinglist_id).then(response => {
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
