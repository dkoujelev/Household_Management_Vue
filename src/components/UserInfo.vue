<template>
  <div class="is-ancestor">
    <div class="is-parent tile box" style="background-color: azure">
      <div class="is-child tile is-2">
        <div class="block">
          <p>Fornavn: {{user_info.first_name}}</p>
          <p>Etternavn: {{user_info.last_name}}</p>
          <p>E-mail: {{user_info.email}}</p>
          <router-link class="button is-dark" to="/ChangePassword">Endre passord</router-link>
        </div>
      </div>
    </div>
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
