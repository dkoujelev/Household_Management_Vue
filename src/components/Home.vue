<template>
  <div class="tile is-vertical">
    <div class="tile is-ancestor">
      <div class=" tile is-parent">
        <div class="tile is-child box" style="background-color: lightskyblue">
          <Newsfeedhome></Newsfeedhome>
        </div>
      </div>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <div class="tile is-child box is-half" style="background-color: lightskyblue">
          <Shoppinglistshome></Shoppinglistshome>
        </div>
      </div>
      <div class="tile is-parent">
        <div class="tile is-child box is-half" style="background-color: lightskyblue">
          <Shoppinglistshome></Shoppinglistshome>
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
    import {store} from '../store'

    export default {
      name: 'Home',
      components: {Newsfeedhome,Taskhome,Shoppinglistshome,Todo},
    }
</script>

<style scoped>

</style>
