<template>
<div class='ui centered card'>
  <div class="content" v-show="!isEditing">
    <div class='header'>
      {{ todo.title }}
    </div>
    <div class='meta'>
      {{ todo.project }}
    </div>
    <div class='meta'>
      {{ todo.beskrivelse }}
    </div>
    <div class='extra content'>
          <span class='right floated edit icon' @click="showForm">
          <i class='edit icon'></i>
        </span>
      <span class='right floated trash icon' @click="deleteTodo()">
          <i class='trash icon'></i>
        </span>
    </div>
  </div>
  <div class="content" v-show="isEditing">
    <div class='ui form'>
      <div class='field'>
        <label>Title</label>
        <input type='text' v-model="todo.title" >
      </div>
      <div class='field'>
        <label>Project</label>
        <input type='text' v-model="todo.project" >
      </div>
      <div class='field'>
        <label>Beskrivelse</label>
        <input type='text' v-model="todo.beskrivelse">
      </div>
      <button class='ui secondary basic button' id="closeButton" @click="hideForm">
        Oppdater
      </button>
    </div>
  </div>
  <div class='ui bottom attached green basic button' v-show="!isEditing && this.todo.done" disabled>
    Fullført
  </div>
  <div class='ui bottom attached red basic button' @click="completeTodo()" v-show="!isEditing && !this.todo.done">
    Ventende
  </div>
</div>
</template>

<script>
  import axios from 'axios';

  export default {
    props: ['todo'],
    data() {

      return {
/*
        todo: {
          gjoremal_id: 1,
          navn: "",
          start: new Date(),
          frist: null,
          ferdig: null,
          beskrivelse: "",
          bruker_id: 2,
          liste_id: 5
      },
        */
        isEditing: false,
      };
    },
    methods: {

      completeTodo() {
        this.$emit('complete-todo', this.todo);
      },


      undoTodo: {
        undoTodo(){
          this.$emit('undo-todo', this.todo);
        }
      },
/*
      completeTodo() {
        axios.post('http://localhost:9000/rest/gjoremal', this.todo, response => {
          this.$emit('complete-todo', this.todo); //gir beskjed til parrent komponent at "dette skjer"
        }).catch(err => {
          console.log(JSON.stringify(err));
        });
      },
*/


      deleteTodo() {
        axios.delete('http://localhost:9000/rest/gjoremal/:gjoremal_id', this.todo, response => {
          this.$emit('delete-todo', this.todo);
          //  this.$delete('delete-todo', this.todos)
        }).catch(err => {
          console.log(JSON.stringify(err));
        });
      },
      showForm() {
        this.isEditing = true;
      },
      hideForm() {
        this.isEditing = false;
      },
    },
  };

  console.dir(this.todo);

</script>

<style>

.content{
  padding-top: 10px;
  }
</style>
