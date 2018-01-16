<template>
  <div>
    <Newsfeedhome></Newsfeedhome>
    <Taskhome></Taskhome>
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
