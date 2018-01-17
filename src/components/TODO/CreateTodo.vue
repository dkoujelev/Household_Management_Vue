<template>
  <div class='ui basic content center aligned segment'>
    <button class='button in-sucsess' @click="openForm" v-show="!isCreating">
      <i class="fa fa-plus-circle" aria-hidden="true"></i>
    </button>
    <div class='ui centered card' v-show="isCreating">
      <div class='content'>
        <div class='ui form'>
          <div class='field'>
            <label>Title</label>
            <input v-model="titleText" type='text'>
          </div>
          <div class='field'>
            <label>Project</label>
            <input v-model="projectText" type='text'>
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
        projectText: "",
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
        if (this.titleText.length > 0 && this.projectText.length && this.beskrivelseText.length > 0) {
          const title = this.titleText;
          const project = this.projectText;
          const beskrivelse = this.beskrivelse;
          this.$emit('create-todo', {
            title,
            project,
            beskrivelse,
            done: false,
          });
          this.titleText = '';
          this.projectText = '';
          this.beskrivelse = '';
          this.isCreating = false;
        }
      },
    },
  };
</script>
