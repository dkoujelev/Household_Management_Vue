<template>
  <AddCollective :current_user="user" @added-collective="opprettetKollektiv"></AddCollective>
</template>

<script>

  import AddCollective from './AddCollective';

  export default {
    name: 'Test',
    components: {AddCollective},
    data () {
      return {
        user: {bruker_id: 1, epost:'asd@asd.com'}
      }
    },
    methods:{
        opprettetKollektiv(e){
            alert(JSON.stringify(e));
        }
    }
  }
</script>

<style>
</style>
