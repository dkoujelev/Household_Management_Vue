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
              <div class="panel-block">
                <table class="table">
                  <thead>
                  <tr>
                    <th>Tittel(navn)</th>
                    <th>Beskrivelse</th>
                    <th>Frist</th>
                    <th>Ferdig</th>
                    <!--<th>Status</th> -->

                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="row in rows">
                    <td> <a @click=""> {{row.navn}} </a> </td> <!--  -->
                    <td>{{row.beskrivelse}}</td>
                    <td>{{row.frist}}</td>
                    <td>
                      <label class="checkbox">
                        <input type="checkbox" v-if="completeTodo">
                      </label>
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

    export default {
      name: "todo-list-overview3",
      props: ['bjarne'],

      data() {
        return {
          rows: [],
          modalVisible: false,
        };
      },
      mounted() {
        this.fillRows();
      },

      watcher: {
        id(){
          this.id = this.bjarne;
        }
      },

      methods: {


        deleteTodo(row){
          let id = row.bruker_id; //eller undergruppe_id ? //+ id
          axios.delete('http://localhost:9000/rest/gjoremal/2' ).then(response => {
            this.rows = [];
            this.fillRows();
          });
        },

        /*
        completeList(){
          this.closeShoppingList();
          let obj = {
            start: new Date().getTime(),
            ferdig: new Date().getTime(),
            frist: new Date().getTime()
          };
          axios.put('http://localhost:9000/rest/handleliste' + this.listId, obj).then(response => {
            this.$emit('listCompleted', obj);
            this.hide();
          });
        },
       */
        completeTodo(){
          this.confirmTodo();
          let obj = {
            ferdig: new Date().getTime() //this.listId,
          };
          axios.put('localhost:9000/rest/gjoremal/' + this.listId + obj).then(response => {
            this.$emit('saveChanges', obj);
            this.rows.push({ferdig })
          });
        },

/*
        checked(){
          seen = false;
          axios.put('' + this.listId).then(response => {
            this.$emit('saveChanges');
            //this.hide();
           let seen = {ferdig: resRows[i].ferdig};
            seen = true;

          });
        },
*/


        deleteList(){
          axios.delete('http://localhost:9000/rest/' + this.listId).then(response => {
            this.$emit('deleteShoppingList');
            this.hide();
          });
        },



        editTodo(row){
          let id = row.bruker_id; //eller undergruppe_id ?
          axios.put('http://localhost:9000/rest/gjoremal/1').then(response => {
            this.$emit('listEditet', obj);
            this.rows = [];
            this.fillRows();
          });
        },

        fillRows() { // this.id = bjarne props.. hard koder med 1 istedet for this.id så får en ut lister
              axios.get('http://localhost:9000/rest/gjoremaler/1').then(response => {
                //alert('Alle lister til bruker hentet');
                let resRows = response.data;
                console.log(resRows);
                for (let i = 0; i < resRows.length; i++) {
                  let obj = {navn: resRows[i].navn, beskrivelse: resRows[i].beskrivelse,  start: resRows[i].start, frist: resRows[0].frist};
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
