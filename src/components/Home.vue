<template>
  <div class="container">
    <div class="tile is-ancestor">

          <div class="tile is-parent is-8">
            <article class="tile is-child">

                <Newsfeed :value="5"></Newsfeed>
                <!-- Content -->
            </article>
          </div>


      <div class="tile is-parent is-vertical">
        <div class="tile is-child ">
          <Shoppinglists :value="7"></Shoppinglists>
        </div>
        <div class="tile is-child ">
          <Todo :value=5></Todo>
        </div>
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
