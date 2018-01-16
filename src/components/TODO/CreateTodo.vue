<template>
  <div class='ui basic content center aligned segment'>
    <button class='ui basic button icon' v-on:click="openForm" v-show="!isCreating">
      <i class='plus icon'></i>
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
          <div class='ui two button attached buttons'>
            <button class='ui basic blue button' v-on:click="sendForm()">
              Opprett
            </button>
            <button class='ui basic red button' v-on:click="closeForm">
              Avbryt
            </button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import datepicker from '/Datepicker.vue';

  export default {
    data() {
      return {
        components: {
          datepicker
        },
        titleText: '',
        projectText: '',
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
        if (this.titleText.length > 0 && this.projectText.length > 0 && this.beskrivelse > 0) {
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
