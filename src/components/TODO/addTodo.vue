<template>
  <div class="box">
    <h2>Lag nytt gjøremål</h2>
    <label for="gjoremal">Tittel</label>
    <input id="gjoremal" type="text" v-model="gjoremal.navn" placeholder="Gjøremål" />

    <label class="help" for="dp">Frist</label>
    <flatPickr id="dp" v-model="gjoremal.frist" :config="{enableTime: false}"></flatPickr>

    <label for="slave">Hvem skal utføre gjøremålet?</label>
    <select id="slave" class="dropdown" v-model="gjoremal.bruker_id">
      <option disabled value="" class="dropdown-item">Velg bruker</option>
      <option :value="user.bruker_id" class="dropdown-item" v-for="user in users">{{user.fornavn}} {{user.etternavn}}</option>
    </select>

    <button type="button" class="button" v-on:click="add()">Create</button>
  </div>
</template>

<script>
  import {store} from '@/store'
  import axios from 'axios'
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';

    export default {
      name: "aTodo",
      props: [ 'id' ],
      components: {
        flatPickr
      },
      watch: {
        id(){
          this.liste_id = Number.parseInt(this.id);
        }
      },
      data() {
        return {
          users: [],
          gjoremal: {
            navn: '',
            start: new Date(),
            frist: new Date(),
            beskrivelse: '',
            bruker_id: '',
          },
          liste_id: 1
        }
      },
      created() {
        this.getUsers();
      },
      methods: {
        clear(){
          this.gjoremal = {
            navn: '',
            start: new Date(),
            frist: new Date(),
            beskrivelse: '',
            bruker_id: ''
          }
        },
        getUsers(){
          axios.get('http://localhost:9000/rest/medlemmerIUndergruppe/' + store.state.current_group.undergruppe_id).then(response => {
            for(let i = 0; i < response.data.length; i++){
              this.users.push(response.data[i]);
            }
          }).catch(err => {
            console.log(err);
          });
        },
        add() {
          this.gjoremal.liste_id = this.liste_id;
          axios.post('http://localhost:9000/rest/gjoremal', this.gjoremal).then( response => {
            this.$emit('todoAdded');
            this.clear();
          }).catch(err => {
            this.$emit('failPost');
            console.log(err);
          });
        }
      }
    }
</script>

<style scoped>

</style>
