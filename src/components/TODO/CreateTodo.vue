<template>
  <div class='ui basic content center aligned segment'>
    <button class='button in-sucsess' @click="openForm" v-show="!isCreating">
      <i class="fa fa-plus-circle" aria-hidden="true"></i>
    </button>
    <div class='ui centered card' v-show="isCreating">
      <div class='content'>
        <div class='ui form'>
          <div class='field'>
            <label>Tittel</label>
            <input v-model="titleText" type='text'>
          </div>
          <div class='field'>
            <label>Dato</label>
            <input v-model="date" type='text'>
          </div>
          <label>Beskrivelse</label>
          <input v-model="beskrivelseText" type='text'>
        </div>
        <button class='ui basic blue button' @click="sendForm()">
          Opprett
        </button>
        <button class='ui basic red button' @click="closeForm">
          Avbryt
        </button>

        </div>
      </div>
    </div>
</template>

<script>
  import datepicker from 'vue-date-picker';

  export default {
    data() {
      return {
        components: {
          datepicker
        },
        titleText: "",
        date: "",
        beskrivelseText: '',
        isCreating: false,
      };
    },
    methods: {
      openForm() {
        this.isCreating = true;
      },
      closeForm() {
        this.isCreating = false;
      },
      sendForm() {

        axios.post('http://localhost:9000/rest/gjoremal/:id', {
          navn: "",
          start: new Date(),
        })
          .then(response => {
            console.log(response)
          })
          .catch(error => {
            console.log(error.response)
          });

        if (this.titleText.length > 0  && this.beskrivelseText.length > 0) {
          const title = this.titleText;
          const date = this.date;
          const beskrivelse = this.beskrivelse;
          this.$emit('create-todo', {
            title,
            date,
            beskrivelse,
            done: false,
          });
          this.titleText = '';
          this.date = '';
          this.beskrivelse = '';
          this.isCreating = false;
        }


        /*
        axios.post('http://localhost:9000/rest/gjoremal/:id', this.todo, response => {
          //this.$emit('send-todo', this.todo); //gir beskjed til parrent komponent at "dette skjer"
        }).catch(err => {
          console.log(JSON.stringify(err));
        });
*/
      },
    },
  };
</script>
