<template>

  <div class="app">

    <AddGroup :current_user="this.$parent.current_user" :current_collective="{kollektiv_id: 1, navn: 'Testkollektiv 1'}" @added-group="addedGroup"></AddGroup>
  </div>


</template>

<script>

  import AddGroup from './AddGroup';

  export default {
    name: 'Test',
    components: {AddGroup},
    data () {
      return {
      };
    },
    methods:{
      addedGroup(e){
            alert(JSON.stringify(e));
        }
    }
  }
</script>

<style>
</style>
