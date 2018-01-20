<template>
  <div>
    <Newsfeedhome></Newsfeedhome>
    <br/>
    <div class="columns">
      <!-- left side -->
      <div class="column">
        <Shoppinglistshome></Shoppinglistshome>
      </div>

      <!-- right side -->
      <div class="column">
        <Todo></Todo>
      </div>
    </div>

  </div>

</template>

<script>
    import Newsfeedhome from './home/Newsfeedhome'
    import Taskhome from './home/Taskhome'
    import Shoppinglistshome from './home/Shoppinglistshome'
    import Todo from './TODO/TodoList';
    import router from '../router/index'
    import {store} from '../store'

    export default {
      name: 'Home',
      components: {Newsfeedhome,Taskhome,Shoppinglistshome,Todo},
      created(){
        if(   store.state.current_user.kollektiv.length === 0){
          router.push('NewUser');
        }
      }
    }
</script>

<style scoped>

</style>
