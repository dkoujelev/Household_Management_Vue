<template>
  <div class="is-ancestor">
    <div class="is-parent">
      <div class="tile is-child box is-6">
        <h3>Handlelister</h3>
      </div>
      <div class="tile is-child box is-6">
        <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
          <thead>
          <th>Handleliste</th>
          <th>Frist</th>
          <th></th>
          </thead>
          <tr v-for="row in rows">
            <td>{{row.navn}}</td>
            <td>{{row.frist}}</td>
            <td><button class="button is-warning" @click="selectList(row.handleliste_id)">Se handleliste</button></td>
          </tr>
        </table>
        <br>
        <router-link class="button is-link" to="/ShoppingList">Lag handleliste</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import router from '@/router'
  import {store} from '@/store'

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
      selectList(id){
        router.push("/ViewShoppingList/" + id);
      },
      formateDate(raw){
        return raw.substring(8, 10) + " " + raw.substring(5, 7) + " " + raw.substring(0,4)
          + " kl: " + raw.substring(11, 16);
      },
      fillRows(){
        axios.get('http://localhost:9000/rest/handlelisteForUndergruppe/' + store.state.current_group.undergruppe_id).then(response => {
          let resRows = response.data;
          for(let i = 0; i < resRows.length; i++){
            let date = this.formateDate(resRows[i].frist);
            let obj = {handleliste_id: resRows[i].handleliste_id, navn: resRows[i].navn, frist: date};
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
