<template>
  <div>
    <p class="tasks">Completed Tasks: {{this.todos.filter(todo => {return todo.done === true}).length}}</p>
    <p class="tasks">Pending Tasks: {{this.todos.filter(todo => {return todo.done === false}).length}}</p>
    <Todo v-on:delete-todo="deleteTodo" v-on:complete-todo="completeTodo" v-for="todo in todos" :key="todo.id" :todo.sync="todo"></Todo>
    <create-todo v-on:create-todo="createTodo"></create-todo>
    <todo-list v-bind:todos="todos"></todo-list>

  </div>


</template>

<script>
  import swal from 'sweetalert';
  import Todo from './Todo';
  import CreateTodo from './CreateTodo';

  export default {
    data() {
      return{
        todos: [{
          title: 'Todo A',
          project: 'Project A',
          beskrivelse: '',
          done: false,
        }, {
          title: 'Todo B',
          project: 'Project B',
          beskrivelse: '',
          done: true,
        }, {
          title: 'Todo C',
          project: 'Project C',
          beskrivelse: '',
          done: false,
        }, {
          title: 'Todo D',
          project: 'Project D',
          beskrivelse: '',
          done: false,
        }]
      }
      },

    components: {
      Todo, CreateTodo //html tag
    },
    methods: {
      deleteTodo() {
        swal({
            title: 'Er du sikker?',
            text: 'Todo vil bli slettet!',
            type: 'Advarsel',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'ja, jeg bekrefter sletting!',
            closeOnConfirm: false,
          },
          () => {
            const todoIndex = this.todos.indexOf(todo);
            this.todos.splice(todoIndex, 1);
            swal('Slettet!', 'Ditt gjøremål har nå blitt slettet.', 'success');
          });
      },
      completeTodo(todo) {
        const todoIndex = this.todos.indexOf(todo);
        this.todos[todoIndex].done = true;
        swal('Success!', 'Gjøremål gjort!', 'success');
        console.log();
        alert('hei');
      },

      createTodo(newTodo) {
        this.todos.push(newTodo);
        swal('Success!', 'To-Do created!', 'success');
      }
    },
  };
</script>

<style scoped>
  p.tasks {
    text-align: center;
  }
</style>
