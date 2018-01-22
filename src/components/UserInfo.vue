<template>
  <div>
    <label v-model="user_info.first_name"></label>
    <label v-model="user_info.last_name"></label>
    <label v-model=""></label>
    <router-link class="button" to="/ChangePassword">Endre passord</router-link>
  </div>
</template>

<script>
    export default {
      name: "user-info",
      data(){
        return{
          user_info:{
            first_name: '',
            last_name: '',
            email: ''
          }
        }
      }
    }
</script>

<style scoped>

</style>
