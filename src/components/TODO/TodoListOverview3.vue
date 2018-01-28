<template>
  <div class="is-ancestor" >
    <div class="is-parent">
      <div class="is-child">
      <h3 class="title"> Liste for: {{$store.state.current_group.navn}}</h3>
        <addTodo :id.sync="list_id" @todoAdded="updatePage" v-if="!readOnly" />
        <br>
        <div class="content1">
          <table class="table">
            <thead>
            <tr>
              <th>Tittel(navn)</th>
              <th>Frist</th>
              <th>Ferdig</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="row in rows">
              <td>{{row.navn}}</td> <!--  -->
              <td>{{row.frist}}</td>
              <td v-if="!readOnly">
                <button class="button is-info" v-if="row.ferdig === null" @click="completeTodo(row)">Fullfør</button>
                <label class="button is-success" v-else><i class="fa fa-check" aria-hidden="true"></i></label>
              </td>
              <td v-else>
                <label class="button is-danger" v-if="row.ferdig === null"><i class="fa fa-times" aria-hidden="true"></i></label>
                <label class="button is-success" v-else><i class="fa fa-check" aria-hidden="true"></i></label>
              </td>
              <td v-if="!readOnly">
                <button class="button is-danger" @click="deleteItem(row)">
                  <i class="fa fa-trash-o" aria-hidden="true"></i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
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
      props: {
        my_id: {},
        readOnly: {
          default: false,
          type: Boolean
        }
      },
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
        my_id(){
          this.list_id = this.my_id;
          this.updatePage();
        }
      },
      methods: {
        formateDate(raw){
          return raw.substring(8, 10) + "." + raw.substring(5, 7) + "." + raw.substring(2,4);
        },
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
                  let obj = {id: resRows[i].gjoremal_id, navn: resRows[i].navn, beskrivelse: resRows[i].beskrivelse, start: resRows[i].start, frist: this.formateDate(resRows[i].frist), ferdig: resRows[i].ferdig};
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

  div.content1 {
    height: 200px;

  }
</style>
