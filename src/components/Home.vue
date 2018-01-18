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

    export default {
      name: 'Home',
      components: {Newsfeedhome,Taskhome,Shoppinglistshome,},
      created(){
        if(!this.$parent.loggedIn){
          router.push('Login');
        }
      }
    }
</script>

<style scoped>

</style>
