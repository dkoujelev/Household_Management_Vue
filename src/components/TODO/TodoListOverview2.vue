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
              <button class="button is-danger" v-confirm="{cancel: function(){}, ok: deleteList, message:'Vil du slette handlelisten?'}">
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

      <Modal :modalVisible.sync="showAddNewTodoList" @modalClosing="showModal = false" @modalOpen="helpModalOpen">
      <h2 slot="title">Gjøremål </h2>
      <div slot="content">
        <addTodoList @todoListAdded="closeWithUpdate" @avbryt="closeModal" @failPost="wrongClosing"/>
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

    export default {
      name: "todo-list-overview2",
      components: { Modal, ViewTodoList, addTodoList},

      data() {
        return{
          showAddNewTodoList: false,
          updated: false,
          todoId: 1,
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
        formateDate(raw){
          return raw.substring(8, 10) + "." + raw.substring(5, 7) + "." + raw.substring(2,4);
        },
        openTodo(row) {
          this.id = row.todoId;
          this.showModal = true;
        },

        wrongClosing(){
          this.closeModal()
        },

        closeWithUpdate(){
          this.showModal = false;
          this.showAddNewTodoList = false;
          this.updated = !this.updated;
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


        deleteList(){
          axios.delete('http://localhost:9000/rest/gjoremalsliste/' + this.todoId).then(response => {
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
