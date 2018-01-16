<template>
  <div>
    <p class="tasks">Completed Tasks: {{this.todos.filter(todo => {return todo.done === true}).length}}</p>
    <p class="tasks">Pending Tasks: {{this.todos.filter(todo => {return todo.done === false}).length}}</p>
    <Todo v-on:delete-todo="deleteTodo" v-on:complete-todo="completeTodo" v-for="todo in todos" :key="todo.id" :todo.sync="todo"></Todo>
  </div>
</template>

<script type = "text/javascript" >
  import sweetalert from 'sweetalert';
  import Todo from './Todo';
  export default {
    data() {
      return{

        todos: [{
          title: 'Todo A',
          project: 'Project A',
          done: false,
        }, {
          title: 'Todo B',
          project: 'Project B',
          done: true,
        }, {
          title: 'Todo C',
          project: 'Project C',
          done: false,
        }, {
          title: 'Todo D',
          project: 'Project D',
          done: false,
        }]
      }

      },

    components: {
      Todo //html tag
    },
    methods: {
      deleteTodo() {
        sweetalert({
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
            sweetalert('Slettet!', 'Ditt gjøremål har nå blitt slettet.', 'success');
          });
      },
      completeTodo(todo) {
        const todoIndex = this.todos.indexOf(todo);
        this.todos[todoIndex].done = true;
        sweetalert('Success!', 'Gjøremål gjort!', 'success');
      },
    },
  };
</script>

<style scoped>
  p.tasks {
    text-align: center;
  }
</style>
