<template>
  <div>
    <br/>
    <div class="tiles">
      <div class="tile is-ancestor">
        <div class="tile is-parent is-vertical">
          <Newsfeedhome></Newsfeedhome>
          <div>
            <Shoppinglistshome></Shoppinglistshome>
          </div>
        </div>
        <div class="tile is-child is-vertical is-4">
          <Todo></Todo>
        </div>

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
      components: {Newsfeedhome,Taskhome,Shoppinglistshome,Todo},
      created(){
        if(!this.$parent.loggedIn){
          router.push('Login');
        } else if(this.$parent.current_user.kollektiv.length === 0){
          router.push('NewUser');
        }
      }
    }
</script>

<style scoped>

</style>
