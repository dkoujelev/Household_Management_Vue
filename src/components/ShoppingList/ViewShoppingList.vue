<template>
  <div class="is-ancestor">
    <div class="is-parent">
      <div class="tile is-child box is-6">
        <h3>Handleliste</h3>
      </div>
      <div class="tile is-child box is-6" style="background-color: lightskyblue">
        <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
          <thead>
          <th>Vare</th>
          <th>Antall</th>
          <th></th>
          <th></th>
          </thead>
          <tr v-for="row in rows">
            <td>{{row.vare}}</td>
            <td>{{row.antall}}</td>
            <td>
              <label class="checkboxContainer">
                <input type="checkbox">
                <span class="checkmark"></span>
              </label>
            </td>
            <td>
              <button class="button is-danger" @click="hide">
                <i class="fa fa-trash-o" aria-hidden="true"></i>
              </button>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="is-parent">
      <div class="tile is-child is-6 box" style="background-color: lightskyblue">
        <div v-if="addItem">

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
          <button class="button is-success" @click="updateList">
            Legg til vare
          </button>
        </div>



        <div class="field-body">
          <button class="button is-success" v-if="!addItem" @click="addItem = true">Legg til vare</button>
          <br>
          <button class="button is-danger" @click="deleteList">Slett handleliste</button>
        </div>
      </div>
    </div>
  </div>


</template>

<script>
  import axios from 'axios';

  export default {
    name: 'Shoppinglists',

    data(){
      return {
        rows: [],
        addItem: false,
        newItem: {
          name: '',
          count: 1
        }
      };
    },
    mounted(){
      this.fillRows();
    },
    methods: {
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
      updateList(){
        let obj = {
          handleliste_id: Number.parseInt(this.$route.params.shoppinglist_id),
          navn: this.newItem.name,
          antall: this.newItem.count
        };

        axios.post('http://localhost:9000/rest/vare', obj).then(response => {
          this.$emit('ItemAdded', obj);
          this.rows.push({vare: this.newItem.name, antall: this.newItem.count});
          this.hide();
        });
      },
      deleteList(){

      },
      fillRows(){
        axios.get('http://localhost:9000/rest/handleliste/' + this.$route.params.shoppinglist_id).then(response => {
          console.log(response.data);
          let resRows = response.data.varer;
          for(let i = 0; i < resRows.length; i++){
            let obj = {vare: resRows[i].navn, antall: resRows[i].antall};
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



</style>
