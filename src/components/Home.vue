<template>
  <div class="tile is-vertical">
    <div class="tile is-ancestor">
      <div class=" tile is-parent is-8">
        <div class="tile is-child box" style="background-color: white">
          <aTodo></aTodo>
          <Newsfeed :value="5"></Newsfeed>
        </div>
      </div>
      <div class="tile is-parent is-vertical">
        <div class="tile is-child box" style="background-color: lightskyblue">
          <Shoppinglists :value="5"></Shoppinglists>
        </div>
        <div class="tile is-child box" style="background-color: lightskyblue">
          <Shoppinglists :value="5"></Shoppinglists>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
    import Todo from './TODO/TodoList';
    import Shoppinglists from '@/components/Shoppinglists'
    import Newsfeed from '@/components/Nyhetsfeed'
    import router from '../router/index'
    import {store} from '../store'

    import aTodo from "@/components/TODO/aTodo"

    export default {
      name: 'Home',
      components: { Todo, Shoppinglists, Newsfeed, aTodo },

      data(){
        return {
          showMe: false,
          titleTest: 'This is a title'
        }
      },
      methods:{
        openShoppingList(){
          this.showMe = true;
        },
        closeShoppingList(){
          this.showMe = false;
        }
      }
    }
</script>

<style scoped>

</style>
