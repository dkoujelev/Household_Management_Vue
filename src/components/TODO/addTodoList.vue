<template>
  <div class="box">
    <h2>Opprett en gjøremålsliste</h2>
    <label class="help is-danger">{{errorMessage}}</label>
    <label for="gjoremalsliste">Tittel</label>
    <input id="gjoremalsliste" type="text" placeholder="Gjøremål" v-model="navn"/>
    <label class="help" for="dp">Frist</label>
    <flatPickr id="dp" v-model="ferdig" :config="{enableTime: false}"></flatPickr>
    <button type="button" class="button" v-on:click="validateData">Ferdig</button>
    <button type="button" class="button" v-on:click="avbryt">Avbryt</button>
  </div>
</template>

<script>
  import {store} from '@/store'
  import axios from 'axios'
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  import Modal from '@/components/Modal';
  export default {
    name: "TodoList",
    components: {
      flatPickr, Modal
    },
    data() {
      return {
        navn: '',
        ferdig: new Date(),
        errorMessage: ''
      }
    },
    methods: {

      avbryt(){
        this.$emit("avbryt");
        this.clear();
      },
      clear(){
        this.navn = '';
        this.ferdig = new Date();
        this.errorMessage = '';
      },
      sendListe(){
        let gjoremalsliste =
          {
            navn: this.navn,
            opprettet: new Date(),
            ferdig: new Date(this.ferdig),
            undergruppe_id: store.state.current_group.undergruppe_id
          };
        axios.post('http://localhost:9000/rest/gjoremalsliste/' + store.state.current_group.undergruppe_id, gjoremalsliste).then( response => {
          this.$emit('todoListAdded');
          this.clear();
        }).catch(err => {
          console.log(JSON.stringify(err));
        });
      },
      validateData(){
        this.errorMessage = '';
        if(this.navn === ''){
          this.errorMessage = 'Gjøremålsliste må ha et navn/tittel';
        } else{
          this.sendListe();
        }
      }
        /*
      postList() {
        axios.post('http://localhost:9000/rest/gjoremalsliste', this.gjoremalsliste).then( response => {
          this.$emit('todoListAdded');
          this.clear();
        }).catch(err => {
          console.log(err);
        });
      }
      */
    }
  }
</script>

<style scoped>

</style>
