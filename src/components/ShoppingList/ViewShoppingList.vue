<template>
  <div>
    <table>
      <thead>
      <th>Handleliste</th>
      <th>Frist</th>
      <th></th>
      </thead>
      <tr v-for="row in rows">
        <td>{{row.vare}}</td>
        <td>{{row.antall}}</td>
        <td><input type="checkbox" class="checkbox"/></td>
        <td><button class="button">Fjern vare</button></td>
      </tr>
    </table>

    <div v-if="addItem">
      <button class="button is-danger" @click="hide">
        <i class="fa fa-trash-o" aria-hidden="true"></i>
      </button>
      <input class="input" name="" v-model="newItem.name" type="text" placeholder="Text input" value="">
      <button class="button is-danger" id="decrementButton" @click="decrement()">
        <i class="fa fa-minus" id="minus" aria-hidden="true"></i>
      </button>
      <div>
        <button class="button is-light">{{newItem.count}}</button>
      </div>
      <button class="button is-info" @click="increment()" id="incrementButton">
        <i class="fa fa-plus" id="plus" aria-hidden="true" ></i>
      </button>
      <button class="button is-success" @click="updateList">
        Legg til vare
      </button>
    </div>

    <br/>
    <button class="button" v-if="!addItem" @click="addItem = true">Legg til vare</button>
    <br/>
    <button class="button is-danger" @click="deleteList">Slett handleliste</button>
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

</style>
