<template>
  <div>
    <Newsfeedhome></Newsfeedhome>
    <div></div>
    <Taskhome></Taskhome>
    <div></div>
    <Shoppinglistshome></Shoppinglistshome>
  </div>

</template>

<script>
    import Newsfeedhome from './home/Newsfeedhome'
    import Taskhome from './home/Taskhome'
    import Shoppinglistshome from './home/Shoppinglistshome'
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
