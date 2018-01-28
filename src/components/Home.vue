<template>
  <div class="container">
    <div class="tile is-ancestor">
      <div class="tile is-vertical is-8">
          <div class="tile is-parent is-vertical">
            <article class="tile is-child">

                <Newsfeed :value="3"></Newsfeed>
                <!-- Content -->
            </article>
          </div>
      </div>

      <div class="tile is-parent is-vertical">
        <article class="tile is-child  is-success is-fixed">
          <Shoppinglists :value="3"></Shoppinglists>
        </article>
        <article class="tile is-child is-success is-fixed">
          <Todo :value=5></Todo>
        </article>
      </div>
    </div>
  </div>

</template>

<script>
    import Shoppinglists from '@/components/Shoppinglists'
    import Newsfeed from '@/components/Nyhetsfeed'
    import Todo from '@/components/TODO/TodoListOverview2'
    import router from '../router/index'
    import {store} from '../store'

    export default {
      name: 'Home',
      components: { Todo, Shoppinglists, Newsfeed },

      data(){
        return {
          showMe: false,
          titleTest: 'This is a title',
          text: 'Confirm action?'
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
