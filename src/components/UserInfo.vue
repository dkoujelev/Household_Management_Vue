<template>
  <div>
    <label>{{user_info.first_name}}</label>
    <br/>
    <label>{{user_info.last_name}}</label>
    <br/>
    <label>{{user_info.email}}</label>
    <br/>
    <router-link class="button" to="/ChangePassword">Endre passord</router-link>
  </div>
</template>

<script>
  import axios from 'axios'
  import {store} from '../store'

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
      },
      methods: {
        getData(){
          axios.get('http://localhost:9000/rest/bruker/' + store.state.current_user.bruker_id).then(response => {
            let data = response.data;
            console.log(data);
            this.user_info.first_name = data.fornavn;
            this.user_info.last_name = data.etternavn;
            this.user_info.email = data.epost;
          });
        }
      },
      created(){
        this.getData();
      }
    }
</script>

<style scoped>

</style>
