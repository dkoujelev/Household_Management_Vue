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
            <td> <a @click="modalVisible = true"> {{row.tittel}}</a> </td>
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



    <Modal :title="tittel" :modalVisible="modalVisible" v-if="modalVisible"><p>asdas</p></Modal>
    <button @click="test">Open</button>

  </div>
</template>

<script>
  import axios from 'axios';
  import {store} from '@/store';
  import Modal from '@/components/Modal';


    export default {
      components: { Modal },
     // Components: Modal,
      name: "todo-list-overview2",
      data() {
        return {
          rows: [],
          modalVisible: false,
          tittel: 'Dette er en tittel'
        };
      },
      mounted() {
        this.fillRows();
        //this.visGruppe();
      },





// [{}] <- betyr at array inneholder et objekt

      methods: {
        test(){
          console.log("click");
          this.modalVisible = true;
        },
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
