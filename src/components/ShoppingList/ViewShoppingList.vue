<template>
  <div class="tile is-ancestor">

    <div class="tile is-parent is-vertical">
      <div class="tile is-child ">
        <table class="table is-bordered is-striped  is-hoverable is-fullwidth">
          <thead>
            <th>Vare</th>
            <th>Antall</th>
            <template v-if="!readOnly">
              <th>Handlet</th>
              <th>Slett</th>
            </template>
          </thead>
          <tr v-for="row in rows">
            <td>{{row.vare}}</td>
            <td>{{row.antall}}</td>
            <template v-if="!readOnly">
              <td>
                <label class="checkboxContainer">
                  <input type="checkbox">
                  <span class="checkmark"></span>
                </label>
              </td>
              <td>
                <button v-if="!readOnly" class="button is-danger" @click="deleteItem(row)">
                  <i class="fa fa-trash-o" aria-hidden="true"></i>
                </button>
              </td>
            </template>
          </tr>
        </table>

        <div v-if="addItem && !readOnly">
          <div class="field-body">
            <button class="button is-danger" @click="hide">
              <i class="fa fa-trash-o" aria-hidden="true"></i>
            </button>
            <input class="input" name="" v-model="newItem.name" type="text" placeholder="Text input" value="">
            <button class="button is-danger" id="decrementButton" @click="decrement()">
              <i class="fa fa-minus" id="minus" aria-hidden="true"></i>
            </button>

            <button class="button is-light">{{newItem.count}}</button>
            <button class="button is-info" @click="increment()" id="incrementButton">
              <i class="fa fa-plus" id="plus" aria-hidden="true" ></i>
            </button>
          </div>
          <br>
          <button  class="button is-link" @click="updateList">
            Legg til vare
          </button>
        </div>
        <button class="button is-link" v-if="!addItem && !readOnly" @click="addItem = true">Legg til vare</button>
        <br>

      </div>

      <div v-if="!readOnly" class="tile is-child ">
        <div class="block">
          <ConfirmModal :modalVisible.sync="showConfirm" :rowData.sync="list" :message="text" @cancel="showConfirm = false" @confirm="deleteList"/>
          <nav class="level">
            <!-- left side -->
            <div class="is-pulled-left">
              <button class="button" style="background-color: orange" @click="completeList">Utfør handleliste</button>
            </div>

            <!-- right side -->
            <div class="is-pulled-right">
              <div class="level-item">
                <button class="button is-danger" @click="showConfirm = true">Slett handleliste</button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import router from '@/router'
  import ConfirmModal from '@/components/ConfirmModal'

  export default {
    name: 'Shoppinglists',
    props: {
      id: {},
      readOnly:{
        default: false,
        type: Boolean
      }
  },
    components:{ConfirmModal},

    data(){
      return {
        listId: this.id,
        rows: [],
        addItem: false,
        newItem: {
          name: '',
          count: 1
        },

        showConfirm: false,
        text: 'Er du sikker på at du vil slette handlelisten?',
        list: {}
      };
    },
    watch: {
      id(){
        this.listId = this.id;
        this.fillRows();
      }
    },
    methods: {
      closeShoppingList(){
        this.$emit('closingShoppingList');
        this.hide();
      },
      hide(){
        this.addItem = false;
        this.newItem.name = '';
        this.newItem.count = 1;
      },
      increment(){
        this.newItem.count++;
      },
      decrement(){
        if(this.newItem.count > 1) this.newItem.count--;
      },
      deleteItem(row){
        axios.delete('http://localhost:9000/rest/vare/' + row.item_id).then(response => {
          this.$emit('ItemRemoved');
          let rows = this.rows;
          for(let i = 0; i < rows.length; i++){
            if(rows[i] === row){
              this.rows.splice(i, 1);
              break;
            }
          }
        });
      },
      updateList(){
        let obj = {
          handleliste_id: this.id,
          navn: this.newItem.name,
          antall: this.newItem.count
        };
        axios.post('http://localhost:9000/rest/vare', obj).then(response => {
          this.$emit('ItemAdded', obj);
          this.rows.push({vare: this.newItem.name, antall: this.newItem.count});
          this.hide();
        });
      },
      completeList(){
        this.closeShoppingList();
        let obj = {
          handling_utfort: new Date().getTime()
        };
        axios.put('http://localhost:9000/rest/handleliste/' + this.listId, obj).then(response => {
          this.$emit('listCompleted', obj);
          this.hide();
        });
      },
      deleteList(){
        axios.delete('http://localhost:9000/rest/handleliste/' + this.listId).then(response => {
          this.showConfirm = false;
          this.$emit('deleteShoppingList');
          this.hide();
        });
      },
      fillRows(){
        this.rows = [];
        axios.get('http://localhost:9000/rest/handleliste/' + this.listId).then(response => {
          console.log(response.data);
          let resRows = response.data.varer;
          for(let i = 0; i < resRows.length; i++){
            let obj = {item_id: resRows[i].vare_id, vare: resRows[i].navn, antall: resRows[i].antall};
            this.rows.push(obj);
          }
        }).catch(err => {
          console.log(err);
        });
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;
  }
  .checkboxContainer {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Create a custom checkbox */
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;
  }

  /* On mouse-over, add a grey background color */
  .checkboxContainer:hover input ~ .checkmark {
    background-color: #ccc;
  }

  /* When the checkbox is checked, add a blue background */
  .checkboxContainer input:checked ~ .checkmark {
    background-color: #2196F3;
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .checkboxContainer input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .checkboxContainer .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  /* Hide the browser's default checkbox */
  .checkboxContainer input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  thead th:nth-child(1){
    width: 70%;
  }
  thead th:nth-child(2){
    width: 15%;
  }
  thead th:nth-child(3){
    width: 15%;
  }
  thead th:nth-child(4){
    width: 15%;
  }



</style>
