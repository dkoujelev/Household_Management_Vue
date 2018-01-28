<template>
  <div :class="{'container' : !isHome}">
    <div :class="{'is-centered' : !isHome,'columns' : !isHome}">
      <div :class="{'column is-8' : !isHome}">
          <div class="is-ancestor box" style="background-color: hsl(217, 71%, 53%)">
            <Modal :modalVisible.sync="showModal" @modalClosing="closeModal">
              <h2 slot="title">Gjøremål </h2>
              <div slot="content">
                <ViewTodoList :my_id.sync="todoId" :readOnly="isHome"/>
              </div>
            </Modal>

            <Modal :modalVisible.sync="showAddNewTodoList" @modalClosing="closeModal">
              <h2 slot="title">Opprett en liste </h2>
              <div slot="content">
                <addTodoList @todoListAdded="closeWithUpdate" @avbryt="closeModal"/>
              </div>
            </Modal>
            <div class="is-parent">
              <div class="is-child">
                <p class="title" style="color:white" v-if="!isHome">Gjøremålslister for: {{$store.state.current_group.navn}}</p>
                <p class="title" style="color:white" v-else>Gjøremålslister</p>
                <div class="container1">
                  <table class="table">
                    <thead>
                    <tr>
                      <th>Tittel</th>
                      <th>Status</th>
                      <th>Dato</th>
                      <th v-if="!isHome"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <ConfirmModal :modalVisible.sync="showConfirmModal" :rowData.sync="list" :message="confirmText" @cancel="showConfirmModal = false" @confirm="deleteList"/>
                    <tr v-for="row in rows">
                      <td> <a @click="openTodo(row)"> {{row.tittel}} </a> </td> <!--  -->
                      <td>Kommer</td>
                      <td>{{row.dato}}</td>
                      <td>
                        <button class="button is-danger" @click="confirmDelete(row)" v-if="!isHome">
                          <i class="fa fa-trash-o" aria-hidden="true"></i>
                        </button>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <button class="button" style="background-color: orange" @click="showAddNewTodoList = true" id="opprett" v-if="!isHome">Opprett gjøremål</button>
                </div>
              </div>
            </div>
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
      props: [ 'value' ],

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
      computed: {
        len: function () {
          return (isNaN(Number.parseInt(this.value)) ? -1 : this.value);
        },
        isHome: function () {
          return ((isNaN(Number.parseInt(this.value)) ? -1 : this.value) !== -1);
        }
      },
      asyncComputed:{
        rows: {
          get(){
            let rows = [];

            let cap = this.len;
            let rest = 'http://localhost:9000/rest/gjoremalslisterUndergruppe/' + store.state.current_group.undergruppe_id;
            if(cap > 0) rest = "http://localhost:9000/rest/gjoremalslisterBruker/" + store.state.current_user.bruker_id;

            return axios.get(rest).then(response => {
              let resRows = response.data;
              console.log(resRows);
              for (let i = 0; i < resRows.length; i++) {
                let obj = {id: resRows[i].id, tittel: resRows[i].navn, gruppe: resRows[i].navn, dato: this.formateDate(resRows[0].opprettet)};
                rows.push(obj);

                if(cap > 0){
                  cap -= 1;
                }
                if(cap === 0){
                  break;
                }
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
          this.todoId = row.id;
          this.showModal = true;
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
div.content1 {
  height: 450px;
  overflow: auto;
}


</style>
