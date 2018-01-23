<template>
  <div class="tile is-ancestor" id="ancestor">
    <div class="tile is-vertical is-8">
      <div class="tile">
        <div class="tile is-parent is-vertical">
          <article class="tile is-child notification">
            <div class="container is-fluid">
              <div class="field">
                <label class="label">Navn å handleliste</label>
                <p class="help is-danger">{{this.errorMessages.overskrift}}</p>
                <div class="control">
                  <input class="input" type="text" placeholder="Text input" v-model="name">
                </div>
              </div>

              <label class="label">Skriv inn varer</label>

              <div class="field" v-for="row in rows">
                <div class="field-body">
                  <button class="button is-danger" @click="removeRow(row)">
                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                  </button>
                  <input class="input" name="" v-model="row.navn" type="text" placeholder="Text input" value="">
                  <button class="button is-danger" id="decrementButton" @click="decrement(row)">
                    <i class="fa fa-minus" id="minus" aria-hidden="true"></i>
                  </button>
                  <div>
                    <button class="button is-light">{{row.antall}}</button>
                  </div>
                  <button class="button is-info" @click="increment(row)" id="incrementButton">
                  <i class="fa fa-plus" id="plus" aria-hidden="true" ></i>
                  </button>
                </div>
              </div>

              <div class="field is-grouped">
                <div class="control">
                  <button class="button is-success" @click="addRow">Ny vare</button>
                </div>
              </div>
            </div>
            <div class="field">
            </div>
            <div class="control">
              <button class="button is-link" @click="checkInput">Godkjenn</button>
              <button class="button is-danger"  @click="deleteList">Slett handleliste</button>
              <router-link class="button" to="/Shoppinglists">Avbrytt</router-link>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>




<script>
  import axios from 'axios';
  import router from '@/router'
  import {store} from '@/store'

  export default {


    data() {
      return {
        name: "",
        rows: [
          {navn: "", antall: 1},
        ],
        errorMessages: {
          overskrift: '',
          tekst: ''
        }
      }
    },
    methods: {
      deleteList(){
        router.push('shoppinglists');
      },
      addRow() {
        this.rows.push({navn: "", antall: 1});
      },
      removeRow: function (row) {
        this.rows.splice(row, 1);
      },
      increment(row){
        row.antall++;
      },
      decrement(row){
        if(row.antall > 1) row.antall--;
      },
      sendData(){
        let shoppinglist =
        {
          navn: this.name,
          opprettet: new Date(),
          beskrivelse: "",
          undergruppe_id: store.state.current_group.undergruppe_id,
          varer: this.rows
        };

        axios.post('http://localhost:9000/rest/handleliste', shoppinglist).then( response => {
          alert('handleliste lagt inn!');
          this.$emit('added-shoppinglist', shoppinglist);
          router.push('Shoppinglists');
        }).catch(err => {
          console.log(JSON.stringify(err));
        });

      },
      checkInput() {
        let noErrors = true;
        this.errorMessages.name = '';
        if (this.name === "") {
          this.errorMessages.overskrift = 'Meldingen må ha en overskift';
          noErrors = false;
        }
        if (noErrors) this.sendData();
      }
    }
  }


</script>




<style scoped>
#minus{
  color: black;
}

#plus{
  color: black;
  }



</style>
