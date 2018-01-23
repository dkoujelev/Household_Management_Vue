<template>
  <div>
    <div class="field">
      <label class="label">Tittel</label>
      <p class="help is-danger">{{this.errorMessages.overskrift}}</p>
      <input type="text" class="input" placeholder="Skriv tittel her" v-model="melding.overskrift">
    </div>
    <div class="block">
      <div class="field">
        <label class="label">Nyhet</label>
        <p class="help is-danger">{{this.errorMessages.tekst}}</p>
          <p class="control">
            <textarea class="textarea" placeholder="Skriv nyhet her" v-model="melding.tekst"></textarea>
          </p>
        <div class="block">
          <nav class="level">
            <!-- left side -->
            <div class="level-left">
              <p class="level-item"><a class="button is-primary" v-on:click="checkInput" to="/Nyhetsfeed">Post nyhet</a></p>
            </div>

            <!-- right side -->
            <div class="level-right">
              <div class="level-item">
                <p class="level-item">
                  <router-link class="button is-danger" to="/Nyhetsfeed">Avbryt</router-link>
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
  import router from '../router/index'
  import {store} from '../store'

  export default {
    name: 'Addnews',
    data() {
      return {
        melding: {
          overskrift: '',
          tekst: '',
          skrevet_av_bruker: store.state.current_user.bruker_id,
          sendt_til_kollektiv: store.state.current_group.undergruppe_id
        },
        errorMessages: {
          overskrift: '',
          tekst: ''
        }
      };
    },
    methods: {
      addNews() {
        this.melding.sendt = new Date();
        axios.post('http://localhost:9000/rest/melding', this.melding).then(response => {
          this.$emit('added-news', this.melding);
          this.melding.tekst = "";
          this.melding.overskrift = "";
          alert("denne meldingen er sendt");
          router.push('nyhetsfeed');
        }).catch(err => {
          console.log(err);
        });
      },
      checkInput() {
        let noErrors = true;
        this.errorMessages.overskrift = '';
        this.errorMessages.tekst = '';

        if (this.melding.overskrift === "") {
          this.errorMessages.overskrift = 'Meldingen må ha en overskift';
          noErrors = false;
        }
        if (this.melding.tekst === "") {
          this.errorMessages.tekst = 'Meldingen må ha innhold';
          noErrors = false;
        }
        if (noErrors) this.addNews();
      }
    }
  }
</script>

<style scoped>

</style>
