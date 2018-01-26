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
            <th>Status</th>
            <th>Dato</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="row in rows">
            <td> <a @click="openTodo(row)"> {{row.tittel}} </a> </td> <!--  -->
            <td>Kommer</td>
            <td>{{row.dato}}</td>
            <td>
              <button class="button is-danger" @click="deleteList">
                <i class="fa fa-trash-o" aria-hidden="true"></i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>

      <Modal :modalVisible.sync="showModal" @modalClosing="closeModal">
        <h2 slot="title">Gjøremål </h2>
        <div slot="content">
          <ViewTodoList :my_id.sync="id"/>
        </div>
      </Modal>
  </div>
  </div>
  </div>

  </div>
</template>

<script>
  import axios from 'axios';
  import {store} from '@/store';
  import Modal from '@/components/Modal';
  import ViewTodoList from '@/components/TODO/TodoListOverview3'

    export default {
      name: "todo-list-overview2",
      components: { Modal, ViewTodoList},

      data() {
        return{
          updated: false,
          id: 1,
          addItem: false,
          newItem: {
            name: '',
            count: 1,
          },
          completeTodo: false,
          showModal: false,
          tittel: 'Dette er en tittel'
        };
      },
      asyncComputed:{
        rows: {
          get(){
            let rows = [];
            return axios.get('http://localhost:9000/rest/gjoremalslisterUndergruppe/' + store.state.current_group.undergruppe_id).then(response => {
              let resRows = response.data;
              console.log(resRows);
              for (let i = 0; i < resRows.length; i++) {
                let obj = {id: resRows[i].id, tittel: resRows[i].navn, gruppe: resRows[i].navn, dato: resRows[0].opprettet};
                rows.push(obj);
              }
              return rows;
            }).catch(err => {
              console.log(JSON.stringify(err));
            });
          },
          watch(){
            this.updated;
          }
        }
      },
      methods: {
        openTodo(row) {
          this.id = row.id;
          this.showModal = true;
        },

        closeModal(){
          this.showModal = false;
        },

        deleteList(){
          axios.delete('http://localhost:9000/rest/gjoremalsliste/' + this.id).then(response => {
            this.$emit('deleteTodoList');
            this.update();
          });
        },
      }
    }
</script>

<style scoped>

div.panel-block{

}


</style>
