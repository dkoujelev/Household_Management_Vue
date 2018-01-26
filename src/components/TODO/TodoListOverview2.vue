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
          <p>HAHA</p>
          <h1>7</h1>
          <ViewTodoList :bjarne.sync="id"/>
          <button class="button is-success" @click="completeTodo">Save changes</button>
          <button class="button" @click="closeModal"> Cancel</button>
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
          id: 1,
          rows: [],
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
      mounted(){
        this.fillRows();
      },

// [{}] <- betyr at array inneholder et objekt

      methods: {

        hide(){
          this.addItem = false;
          this.newItem.name = '';
          this.newItem.count = 1;
        },

        openTodo(row) {
          this.id = row.id;
          this.showModal = true;
          //console.log("click");

        },

        closeModal(){
          this.showModal = false;
        },

        deleteList(){ //+ this.listId
          axios.delete('http://localhost:9000/rest/gjoremalslisterUndergruppe/1' ).then(response => {
            this.$emit('deleteTodoList');
            this.hide();
          });
        },

        fillRows() {
            //+ store.state.current_user.bruker_id
            axios.get('http://localhost:9000/rest/gjoremalslisterUndergruppe/1' ).then(response => {
              //alert('Alle lister til bruker hentet');
              let resRows = response.data;
              console.log(resRows);
              for (let i = 0; i < resRows.length; i++) {
                let obj = {id: resRows[i].liste_id, tittel: resRows[i].navn, gruppe: resRows[i].navn, dato: resRows[0].opprettet};
                this.rows.push(obj);
              }
            }).catch(err => {
              console.log(JSON.stringify(err));
            });
          }
      }
    }
</script>

<style scoped>

div.panel-block{

}


</style>
