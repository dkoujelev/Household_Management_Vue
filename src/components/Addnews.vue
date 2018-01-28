<template>
  <div class="is-ancestor">
    <div class="is-parent is-vertical">
      <div class="is-child tile is-vertical">
        <label class="label">Tittel:</label>
            <div class="row">
              <div class="col-25">
                <p class="help is-danger">{{errorMessages.overskrift}}</p>
              </div>
              <div class="col-25">
                <input id="inputBox" type="text" class="input" placeholder="Skriv tittel her" v-model="melding.overskrift">
              </div>
            </div>
        <br>
            <label class="label">Beskrivelse:</label>
            <p class="help is-danger">{{errorMessages.tekst}}</p>
            <p class="control">
              <textarea class="textarea" placeholder="Skriv nyhet her" v-model="melding.tekst"></textarea>
            </p>

            <div class="block">
              <nav class="level">
                <div class="is-pulled-left">
                  <div class="level-item">
                    <p class="level-item"><button class="button" style="background-color: orange"  @click="checkInput">Legg ut nyhet</button></p>
                  </div>
                </div>

                <!-- right side -->
                <div class="level-right">
                  <div class="level-item is-pulled-right">
                    <p class="level-item">
                      <button class="button is-danger" @click="hide" v-if="show">Avbryt</button>
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
      hide(){
        this.clear();
        this.$emit('closeAddNews');
      },
      clear(){
        this.melding.overskrift = '';
        this.melding.tekst = '';
        this.errorMessages.overskrift = '';
        this.errorMessages.tekst = '';
      },
      addNews() {
        this.melding.sendt = new Date();
        axios.post('http://localhost:9000/rest/melding', this.melding).then(response => {
          this.$emit('addedNews', this.melding);
          this.clear();
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
    background-color:white;
    color: black;
  }

  ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: grey;
    opacity: 1; /* Firefox */
  }

</style>
