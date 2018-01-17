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

    export default {
      name: 'Home',
      components: {Newsfeedhome,Taskhome,Shoppinglistshome,}

    }
</script>

<style scoped>

</style>
