<template>
  <div>
    <p class="tasks">Completed Tasks: {{this.todos.filter(todo => {return todo.done === true}).length}}</p>
    <p class="tasks">Pending Tasks: {{this.todos.filter(todo => {return todo.done === false}).length}}</p>
    <Todo v-on:delete-todo="deleteTodo" v-on:undo-todo="undoTodo" v-on: v-on:complete-todo="completeTodo"  v-for="todo in todos" v-bind:todo="todo"></Todo>

    <create-todo v-on:create-todo="createTodo"></create-todo>


  <!--  <Todo  v-on:delete-todo="deleteTodo" v-for="todo in todos" v-bind:todo="todo"></Todo>
    <Todo  v-on:complete-todo="completeTodo" v-for="todo in todos" v-bind:todo="todo"></Todo>
    <todo-list v-bind:todos="todos"></todo-list>
      <Todo v-on:delete-todo="deleteTodo()" v-on:complete-todo="completeTodo" v-for="todo in todos" :key="deleteTodo"></Todo>-->
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
        }, ]
      }
      },

    components: {
      Todo, CreateTodo //html tag
    },
    methods: {
      deleteTodo(todo) {
        swal({
            title: 'Er du sikker?',
            text: 'Todo vil bli slettet!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'ja, jeg bekrefter sletting!',
            closeOnConfirm: false,
          },

          /*
          () => {
            const todoIndex = this.todos.indexOf(todo);
            this.todos.splice(todoIndex, 1);
           // this.todos.push.$delete.done = true;
            swal('Slettet!', 'Ditt gjøremål er slettet.', 'success');
          });
        */

          function(){
            swal("Deleted!", "Your imaginary file has been deleted.", "success");
          });
      },
      completeTodo(todo) {
        const todoIndex = this.todos.indexOf(todo);
        this.todos[todoIndex].done = true;
        swal('Success!', 'Gjøremål gjort!', 'success');
      },
      undoTodo(todo){
        const todoIndex = this.todos.indexOf(todo);
        this.todos[todoIndex].done = false;
        swal('Angret!', 'dadda', 'succsess');
      },
      // JSON.stringify(objektnavn)
      // Motsatt: JSON.parse(streng)
      createTodo(newTodo) {
        this.todos.push(newTodo);
        swal('Success!', 'Gjøremål opprettet!', 'success');
      }
    },
  };
</script>

<style scoped>
  p.tasks {
    text-align: center;
  }
</style>
