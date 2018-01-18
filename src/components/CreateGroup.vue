<template>
  <div class="app">

    <GjeldInn></GjeldInn>
  </div>
</template>

<script>

  import GjeldInn from './Gjeld/GjeldInn';

  export default {
      props: ['current_user'],
    name: 'Test',
    components: {GjeldInn},
    methods:{
      addedGroup(e){
            alert(JSON.stringify(e));
        }
    }
  }
</script>

<style>
</style>
