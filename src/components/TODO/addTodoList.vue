<template>
  <div class="box">
    <h2>Opprett en gjøremålsliste</h2>
    <label for="gjoremalsliste">Tittel</label>
    <input id="gjoremalsliste" type="text" v-model="gjoremalsliste.navn" placeholder="Gjøremål" />

    <label class="help" for="dp">Frist</label>
    <flatPickr id="dp" v-model="gjoremalsliste.opprettet" :config="{enableTime: false}"></flatPickr>



    <button type="button" class="button" v-on:click="sendListe">Ferdig</button>
  </div>
</template>

<script>
  import {store} from '@/store'
  import axios from 'axios'
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';

  export default {
    name: "TodoList",
    components: {
      flatPickr
    },
    data() {
      return {
        users: [],
        gjoremalsliste: {
          navn: '',
          opprettet: new Date(),
          ferdig: new Date(),
          undergruppe_id: store.state.current_group.undergruppe_id
        },
        liste_id: 1
      }
    },
    created() {
      this.getUsers();
    },
    methods: {
      /*
      clear(){
        this.gjoremalsliste = {
          navn: '',
          opprettet: new Date(),
          ferdig: new Date(),
          undergruppe_id: '',
        }
      },
      */
      getUsers(){
        axios.get('http://localhost:9000/rest/medlemmerIUndergruppe/' + store.state.current_group.undergruppe_id).then(response => {
          for(let i = 0; i < response.data.length; i++){
            this.users.push(response.data[i]);
          }
        }).catch(err => {
          console.log(err);
        });
      },


      sendListe(){
        let gjoremalsliste =
          {
            navn: this.gjoremalsliste.navn,
            opprettet: new Date(),
            ferdig: null,
            undergruppe_id: this.gjoremalsliste.undergruppe_id,
          };

        axios.post('http://localhost:9000/rest/gjoremalsliste/', gjoremalsliste).then( response => {
          this.$emit('todoListAdded');
        }).catch(err => {
          console.log(JSON.stringify(err));
        });
      },
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
