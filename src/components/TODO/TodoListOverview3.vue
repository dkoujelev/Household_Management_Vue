<template>
  <div>
    <div class="column">
      <div class="columns is-one-quarter">
        <div class="column is-half">
          <div class="table is-striped">
            <section class="panel">
              <p class="panel-heading">
                Liste for: {{$store.state.current_group.navn}}
              </p>
              <addTodo :id.sync="list_id" @todoAdded="updatePage"></addTodo>
              <div class="panel-block">

                <table class="table">
                  <thead>
                  <tr>
                    <th>Tittel(navn)</th>
                    <th>Frist</th>
                    <th>Ferdig</th>
                    <!--<th>Status</th> -->

                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="row in rows">
                    <td> <a @click=""> {{row.navn}} </a> </td> <!--  -->
                    <td>{{row.frist}}</td>
                    <td>
                      <button class="button is-info" v-if="row.ferdig === null" @click="completeTodo(row)">Fullfør</button>
                      <label class="button is-success" v-else><i class="fa fa-check" aria-hidden="true"></i></label>
                    <td>
                      <button class="button is-danger" @click="deleteItem(row)">
                        <i class="fa fa-trash-o" aria-hidden="true"></i>
                      </button>

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
  </div>

</template>

<script>
  import axios from 'axios';
  import {store} from '@/store';
  import addTodo from '@/components/TODO/addTodo'

    export default {
      name: "todo-list-overview3",
      props: ['bjarne'],
      components: { addTodo },

      data() {
        return {
          rows: [],
          modalVisible: false,
          list_id: 1
        };
      },
      mounted() {
        this.fillRows();
      },
      watch: {
        bjarne(){
          this.list_id = this.bjarne;
          this.updatePage();
        }
      },
      methods: {
        updatePage(){
          this.rows = [];
          this.fillRows();
        },
        deleteItem(row){ // + row.item_id
          axios.delete('http://localhost:9000/rest/gjoremal/' + row.id).then(response => {
            this.$emit('ItemRemoved');
            let rows = this.rows;
            for(let i = 0; i < rows.length; i++){
              if(rows[i] === row){
                this.rows.splice(i, 1);
                this.updatePage();
                break;
              }
            }
          });
        },
        completeTodo(row){
          let obj = {
            ferdig: new Date(),
            gjoremal_id: row.id
          };
          axios.put('http://localhost:9000/rest/gjoremal/', obj).then(response => {
            this.$emit('todoCompleted', obj);
            this.updatePage();
          });
        },
        fillRows() {
              axios.get('http://localhost:9000/rest/gjoremaler/' + this.list_id).then(response => {
                let resRows = response.data;
                for (let i = 0; i < resRows.length; i++) {
                  let obj = {id: resRows[i].gjoremal_id, navn: resRows[i].navn, beskrivelse: resRows[i].beskrivelse, start: resRows[i].start, frist: resRows[i].frist, ferdig: resRows[i].ferdig};
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

</style>
