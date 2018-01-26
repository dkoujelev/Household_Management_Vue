<template>
  <div class="box">
    <h2>Lag nytt gjøremål</h2>
    <label for="gjoremal">Tittel</label>
    <input id="gjoremal" type="text" v-model="gjoremal.navn" placeholder="Gjøremål" />
    <label class="help" for="dp">Frist</label>
    <flatPickr id="dp" v-model="gjoremal.frist" :config="{enableTime: false}"></flatPickr>
    <label for="slave">Hvem skal utføre gjøremålet?</label>
    <select id="slave" class="dropdown">
      <option value="1" class="dropdown-item">Test</option>
    </select>
    <button type="button" class="button" v-on:click="add()">Create</button>
  </div>
</template>

<script>
  import {store} from '@/store'
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';

    export default {
      name: "aTodo",
      props: [ 'id' ],
      computed: {
        len: function () {
          return Number.parseInt(this.id);
        }
      },
      components: {
        flatPickr
      },
      watch: {
        id(){
          this.gjoremal.liste_id = Number.parseInt(this.id);
        }
      },
      data() {
        return {
          gjoremal: {
            navn: '',
            start: new Date(),
            frist: new Date(),
            beskrivelse: '',
            bruker_id: store.state.current_user.bruker_id,
            liste_id: 1
          }
        }
      },
      methods: {
        clear(){
          this.gjoremal = {
            navn: '',
            start: new Date(),
            frist: new Date(),
            beskrivelse: '',
            bruker_id: store.state.current_user.bruker_id,
            liste_id: 1
          }
        },
        add() {
          axios.post('http://localhost:9000/rest/gjoremal', this.gjoremal).then( response => {

          }).catch(err => {
            console.log(err);
          });
        }
      }
    }
</script>

<style scoped>

</style>
