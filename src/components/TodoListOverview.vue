<template>
  <div>
    <table>
      <thead>
      <th>Gruppenavn</th>
      <th>Nyhet</th>
      <th>Når</th>
      <th></th>
      </thead>
      <tr v-for="row in rows">
        <td>{{row.gruppenavn}}</td>
        <td>{{}}</td>
        <td>{{}}</td>
       <!-- <td v-if="row.knapper"><button class="button is-danger" @click="deleteNews(row)">Slett</button></td> -->
      </tr>
    </table>
   <!-- <router-link class="button" to="/Addnews">Lag nyhet</router-link> -->
  </div>
</template>

<script>


  import TodoList from '@/components/TODO/TodoList'
  import axios from 'axios';
  import {store} from '@/store'
  import Vue from 'vue'

    export default {
      name: 'TodoListOverview',
      data(){
        return {
          rows: []
        };
      },
      mounted(){
      this.fillRows()
  },

// [{}] <- betyr at array inneholder et objekt

      methods: {

          fillRows() {
            axios.get('rest/undergrupperForBruker/:bruker_id').then(response => {
              //alert('Alle lister til bruker hentet');
              let resRows = response.data;
              console.log(resRows);
              for (let i = 0; i < resRows.length; i++) {
                let obj = {gruppenavn: resRows[i].undergruppe, gruppe: resRows[i].navn, date: resRows[0].opprettet};
                this.rows.push(obj);
              }
            }).catch(err => {
              console.log(JSON.stringify(err));
            });
          }
      }


      /*
      methods: {

        fillRows(){
          axios.get('http://localhost:9000/rest/gjoremalslisterUndergruppe/1').then(response => {
            //alert('Alle lister til bruker hentet');
            let resRows = response.data;
            for(let i = 0; i < resRows.length; i++){
              let obj = {undergruppeListe: resRows[i].undergruppe_id, navnTodo: resRows[i].navn, dato: resRows[i].opprettet};
              this.rows.push(obj);
            }
          }).catch(err => {
            console.log(JSON.stringify(err));
          });
          }
        }
*/
      }

</script>

<style scoped>
  columns {
    color: black;

  }
</style>
