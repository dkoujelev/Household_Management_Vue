<template>
  <div>
  <div class="column">
  <div class="columns is-one-quarter">
    <div class="column is-half">
  <div class="table is-striped">
    <section class="panel">
      <p class="panel-heading">
        Gjøremålliste for: {{$store.state.current_group.navn}}
      </p>
      <div class="panel-block">
        <table class="table">
          <thead>
          <tr>
            <th>Tittel</th>
            <th>Gruppenavn</th>
            <th>Status</th>
            <th>Dato</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="row in rows">
            <td @click="selectGroup(group)"> {{row.tittel}} </td>
            <td>Kommer</td>
            <td>Kommer</td>
            <td>{{row.dato}}</td>
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
  </div>
  </div>

  <div id="root" class="container">
    <modal v-if="showModal" @close="showModal = false">
      <p> tet</p>
    </modal>
    <button class="modal-close"> Lukk </button>
    <button @click="showModal = true">Show modal</button>

    <button class="modal-close" ></button>
  </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import {store} from '@/store'
  import router from '@/router/index'
  import Modal from "./Modal";


    export default {
      components: Modal,
      name: "todo-list-overview2",
      data() {
        return {
          rows: [],
         //g: {},
        };
      },
      mounted() {
        this.fillRows();
        //this.visGruppe();
      },



// [{}] <- betyr at array inneholder et objekt

      methods: {
        fillRows() {
          axios.get('http://localhost:9000/rest/gjoremalslisterUndergruppe/1').then(response => {
            //alert('Alle lister til bruker hentet');
            let resRows = response.data;
            console.log(resRows);
            for (let i = 0; i < resRows.length; i++) {
              let obj = {tittel: resRows[i].navn, gruppe: resRows[i].navn, dato: resRows[0].opprettet};
              this.rows.push(obj);
            }
          }).catch(err => {
            console.log(JSON.stringify(err));
          });
        },
      }
    }

</script>

<style scoped>

div.panel-block{

}


</style>
