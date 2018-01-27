<template>
  <div class="is-ancestor">
    <div class="is-parent">
      <div class="tile is-child box is-6" style="background-color: lightskyblue">
        <h3>Lag din handleliste</h3>
      </div>
      <div class="tile is-child box is-6" style="background-color: lightskyblue">
        <label class="label">Navn på handleliste</label>
        <p class="help is-danger">{{this.errorMessages.overskrift}}</p>
        <div class="control">
          <input class="input" type="text" placeholder="Navn på handleliste" v-model="name">
          <label class="help" for="dp">Frist</label>
          <flatPickr id="dp" v-model="date" :config="{enableTime: false}"></flatPickr>
        </div>
        <br>
        <div>
          <label class="label">Skriv inn varer</label>
          <p class="help is-danger">{{errorMessages.navn}}</p>
        </div>
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
            <button class="button is-success" @click="addRow">Legg til ny vare</button>
          </div>
        </div>
        <br>
        <div class="block">
          <nav class="level">
            <!-- left side -->
            <div class="level-left">
              <button class="button is-link" @click="checkInput">Godkjenn</button>
            </div>

            <!-- right side -->
            <div class="level-right">
              <div class="level-item">
                <p class="level-item">
                  <button class="button is-danger" @click="closeNewShoppingList">Avbryt</button>
                </p>

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
  import {store} from '@/store'
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';

  export default {
    components: { flatPickr },

    data() {
      return {
        name: "",
        rows: [
          {navn: "", antall: 1},
        ],
        date: new Date(),
        errorMessages: {
          overskrift: '',
          navn: ''
        }
      }
    },
    methods: {
      hide(){
        this.name = '';
        this.rows = [ {navn: "", antall: 1} ];
        this.date = new Date();
        this.errorMessages.overskrift = '';
        this.errorMessages.navn = '';
      },
      closeNewShoppingList(){
        this.hide();
        this.$emit('closingAddShoppingList');
      },
      addRow() {
        this.rows.push({navn: "", antall: 1});
      },
      removeRow: function (row) {
        for(let i = 0; i < this.rows.length; i++){
          if(this.rows[i] === row){
            this.rows.splice(i, 1);
            break;
          }
        }
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
          varer: this.rows,
          frist: this.date
        };

        axios.post('http://localhost:9000/rest/handleliste', shoppinglist).then( response => {
          this.hide();
          this.$emit('addedShoppingList');
        }).catch(err => {
          console.log(JSON.stringify(err));
        });

      },
      checkInput() {
        let noErrors = true;
        this.errorMessages.overskrift = '';
        this.errorMessages.name = '';

        if (this.name === "") {
          this.errorMessages.overskrift = 'Meldingen må ha en overskift';
          noErrors = false;
        }

        for(let i = 0; i < this.rows.length; i++){
          if(this.rows[i].navn === ''){
            noErrors = false;
            this.errorMessages.navn = 'Alle varer må ha navn';
            break;
          }
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
