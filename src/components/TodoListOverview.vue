<template>
  <div>
<div class="column is-half-desktop is-full-mobile">
  <section class="panel">
    <p class="panel-heading">
      Gjøremålliste
    </p>
    <div class="panel-block">
      <table class="table">
        <thead>
        <tr>
          <th>Gruppenavn</th>
          <th>f</th>
          <th>Status</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="row in rows">
          <td @click="selectGroup(group)">{{row.gruppenavn}} </td>
          <td>Bass Guitar</td>
          <td class="is-icon">
            <a href="#">
              <i class="fa fa-twitter"></i>
            </a>
          </td>
          <td class="is-icon">
            <a href="#">
              <i class="fa fa-instagram"></i>
            </a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </section>
</div>
  </div>
</template>

  <!-- <template>

  <div class="box">

  <div>
    <table>
      <thead>
      <th>Gruppenavn</th>
      <th></th>
      <th>Status</th>
      <th></th>
      </thead>
      <tr v-for="row in rows">
        <a @click="selectGroup(group)">{{row.gruppenavn}}  <label></label></a>
        <td>kommer</td>
        <td>Status</td>
      </tr>
    </table>
  </div>
</template> -->


<script>
  //import TodoList from '@/components/TODO/TodoList'
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

          selectGroup(group){
            router.push('GjeldInnSpesifisert/' + user.bruker_id);
          },

          fillRows() {
            axios.get('http://localhost:9000/rest/undergrupperForBruker/9').then(response => {
              //alert('Alle lister til bruker hentet');
              let resRows = response.data;
              console.log(resRows);
              for (let i = 0; i < resRows.length; i++) {
                let obj = {gruppenavn: resRows[i].navn , gruppe: resRows[i].navn, date: resRows[0].opprettet};
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
