<template>
  <AddCostRegister :current_group="current_group"></AddCostRegister>
</template>

<script>

  import AddCostRegister from './AddCostRegister';

  export default {
    name: 'Test',
    components: {AddCostRegister},
    data () {
      return {
          current_group: {
              undergruppe_id: 1,
              navn: "test"
          }
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
