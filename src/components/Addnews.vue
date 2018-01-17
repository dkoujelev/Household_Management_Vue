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
              <p class="level-item"><a class="button is-primary" v-on:click="checkInput">Post nyhet</a></p>
            </div>

            <!-- right side -->
            <div class="level-right">
              <div class="level-item">
                <p class="level-item"><a class="button is-danger">Avbryt</a></p>
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

  export default {
    name: 'Addnews',
    props: ['current_user', 'current_group'],
    data() {
      return {
        melding: {
          overskrift: '',
          tekst: '',
          skrevet_av_bruker: this.current_user.bruker_id,
          sendt_til_kollektiv: this.current_group.undergruppe_id
        },
        errorMessages: {
          overskrift: '',
          tekst: ''
        }
      };
    },
    methods: {
      addNews() {
        axios.post('http://localhost:9000/rest/melding', this.melding).then(response => {
          this.$emit('added-news', this.melding);
          this.melding.tekst = "";
          this.melding.overskrift = "";
          alert("denne meldingen er sendt");
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
