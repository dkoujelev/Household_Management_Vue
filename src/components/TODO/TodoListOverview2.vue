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
          <ConfirmModal :modalVisible.sync="showConfirmModal" :rowData.sync="list" :message="confirmText" @cancel="showConfirmModal = false" @confirm="deleteList"/>
          <tr v-for="row in rows">
            <td> <a @click="openTodo(row)"> {{row.tittel}} </a> </td> <!--  -->
            <td>Kommer</td>
            <td>{{row.dato}}</td>
            <td>
              <button class="button is-danger" @click="confirmDelete(row)">
                <i class="fa fa-trash-o" aria-hidden="true"></i>
              </button>
            </td>
          </tr>
          <div>
            <button class="button is-success" @click="helpModalOpen" id="opprett">Opprett gjøremål</button>
          </div>
          </tbody>
        </table>
      </div>
    </section>
  </div>

      <Modal :modalVisible.sync="showModal" @modalClosing="closeModal">
        <h2 slot="title">Gjøremål </h2>
        <div slot="content">
          <ViewTodoList :my_id.sync="todoId"/>
        </div>
      </Modal>

      <Modal :modalVisible.sync="showAddNewTodoList" @modalClosing="closeModal" @modalOpen="helpModalOpen">
      <h2 slot="title">Gjøremål </h2>
      <div slot="content">
        <addTodoList/>
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
  import addTodoList from '@/components/TODO/addTodoList'
  import ConfirmModal from '@/components/ConfirmModal'

    export default {
      name: "todo-list-overview2",
      components: { Modal, ViewTodoList, addTodoList, ConfirmModal },

      data() {
        return{
          showAddNewTodoList: false,
          updated: false,
          addItem: false,
          todoId: 1,
          newItem: {
            name: '',
            count: 1,
          },
          completeTodo: false,
          showModal: false,
          tittel: 'Dette er en tittel',

          list: {},
          confirmText: 'Er du sikker på at du vil slette denne gjøremålslisten?',
          showConfirmModal: false
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
                let obj = {id: resRows[i].id, tittel: resRows[i].navn, gruppe: resRows[i].navn, dato: this.formateDate(resRows[0].opprettet)};
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
        confirmDelete(row){
          this.list = row;
          this.showConfirmModal = true;
        },
        formateDate(raw){
          return raw.substring(8, 10) + "." + raw.substring(5, 7) + "." + raw.substring(2,4);
        },
        openTodo(row) {
          this.id = row.todoId;
          this.showModal = true;
        },

        closeModal(){
          this.showModal = false;
          this.showAddNewTodoList = false;
        },

        helpModalOpen(){
          this.showAddNewTodoList = true;
        },


        modalOpen(){
          this.showModal = true;
        },


        deleteList(row){
          axios.delete('http://localhost:9000/rest/gjoremalsliste/' + row.id).then(response => {
            this.$emit('deleteTodoList');
            this.updated = !this.updated;
            this.showConfirmModal = false;
          });
        },
      }
    }
</script>

<style scoped>

div.panel-block{

}


</style>
