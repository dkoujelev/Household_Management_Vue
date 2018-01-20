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
            <label>Frist</label>
            <input v-model="date" type="date">
           <!-- <testDato></testDato> -->
            <!--<input v-model="date" type='text'> ,  -->
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
  import testDato from '@/components/Charts/testDato'
  import axios from 'axios';
  export default {
    data() {
      return {
        components: {
          testDato,
        },
        titleText: "",
        date: "",
        beskrivelseText: '',
        isCreating: false,
      };
    },
    methods: {
      openForm() {
        let edit = {
          navn: "",
          start: new Date(),
          beskrivelse: "",
          bruker_id: 4,
          liste_id: 6,
        };
        console.dir(edit);
        axios.put('http://localhost:9000/rest/gjoremal/', edit).then( response => {
          alert('Gjøremål redigert/endret!');
          this.$emit('edit-todo', edit);
          console.log("1");
          router.push('edit-todo');
        }).catch(err => {
          console.log(JSON.stringify(err));
        });

        if (this.titleText.length > 0  && this.beskrivelseText.length > 0) {
          const title = this.titleText;
          const date = this.date;
          const beskrivelse = this.beskrivelse;
          this.$emit('edit-todo', {
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


        this.isCreating = true;
      },


      closeForm() {
        this.isCreating = false;
      },

      sendForm() {
        let todoList =
          {
            navn: "",
            start: new Date(),
            beskrivelse: "",
            bruker_id: 1,
            liste_id: 2,
          };
        console.dir(todoList);
        axios.post('http://localhost:9000/rest/gjoremal/', todoList).then( response => {
          alert('Legge til gjøremål ordnet!');
          this.$emit('create-todo', todoList);
          console.log("1");
          router.push('todoList');
        }).catch(err => {
          console.log(JSON.stringify(err));
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
