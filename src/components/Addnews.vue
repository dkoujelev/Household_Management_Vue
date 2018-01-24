<template>
  <div class="is-ancestor">
    <div class="is-parent is-vertical">
      <div class="is-child tile is-vertical">
        <article class="message is-info">
          <div class="message-header">
            <div class="row">
              <div class="col-25">
                <p class="help is-white">{{this.errorMessages.overskrift}}</p>
              </div>
              <div class="col-25">
                <input id="inputBox" type="text" class="input is-info" placeholder="Skriv tittel her" v-model="melding.overskrift">
              </div>
            </div>
          </div>
          <div class="message-body">
            <label class="label">Nyhet</label>
            <p class="help is-dark">{{this.errorMessages.tekst}}</p>
            <p class="control">
              <textarea class="textarea" placeholder="Skriv nyhet her" v-model="melding.tekst"></textarea>
            </p>
            <div class="block">
              <nav class="level">
                <!-- left side -->
                <div class="level-left">
                  <p class="level-item"><a class="button is-primary" v-on:click="checkInput" to="/Nyhetsfeed">Legg ut nyhet</a></p>
                </div>

                <!-- right side -->
                <div class="level-right">
                  <div class="level-item">
                    <p class="level-item">
                      <router-link class="button is-danger" to="/Nyhetsfeed" v-if="show">Avbryt</router-link>
                    </p>

                  </div>
                </div>
              </nav>
            </div>
          </div>
        </article>
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
    props: [ 'showCancel' ],
    computed: {
      show: function () {
        return (this.showCancel !== false);
      }
    },
    data() {
      return {
        melding: {
          overskrift: '',
          tekst: '',
          skrevet_av_bruker: store.state.current_user.bruker_id,
          sendt_til_kollektiv: store.state.current_group.kollektiv_id
        },
        errorMessages: {
          overskrift: '',
          tekst: ''
        }
      };
    },
    methods: {
      clear(){
        this.melding.overskrift = '';
        this.melding.tekst = '';
      },
      addNews() {
        this.melding.sendt = new Date();
        axios.post('http://localhost:9000/rest/melding', this.melding).then(response => {
          this.$emit('addedNews', this.melding);
          this.clear();
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

  input[type=text] {
    background-color:lightskyblue;
    color: black;
  }

  ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: grey;
    opacity: 1; /* Firefox */
  }

</style>
