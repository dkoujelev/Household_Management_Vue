<template>
      <div class="tile is-ancestor box" style="background-color: deeppink">
        <div class="tile is-parent  box" style="background-color: skyblue">
          <div class="child tile is-6 box" style="background-color: palevioletred">
            <Newsfeedhome></Newsfeedhome>
          </div>
          <div class="child tile is-6 box" style="background-color: grey">
            <Shoppinglistshome></Shoppinglistshome>
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
