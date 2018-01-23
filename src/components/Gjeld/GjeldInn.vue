<template>
  <div class="is-ancestor" style="background-color: white">
    <div class=" is-parent is-vertical " style="background-color: saddlebrown">
      <div class="child tile " style="background-color: lightgray">
        <h3>Medlemmer som skylder meg penger</h3>
      </div>
      <div class="child tile" style="background-color:lightgray">
        <table class="table">
          <thead>
            <th scope="col">Navn</th>
            <th scope="col">Sum</th>
          </thead>

          <tbody>
            <tr v-for="user in users" @click="selectUser(user)">
              <td data-label="Navn">  {{user.fornavn}}  {{user.etternavn}}  </td>
              <td data-label="Sum">  {{user.sum + " kr" }}  </td>
            </tr>
          </tbody>
        </table>

      </div>
      <div class="child tile" style="background-color: lightgrey">
        <router-link class="button" to="/Addnews">Lag nyhet</router-link>
      </div>

    </div>
  </div>
</template>







<!-- <template>
  <div class="box">
    <div class="title is-size-5">Medlemmer som skylder meg penger</div>
    <div class="level" v-for="user in users">
      <a @click="selectUser(user)">{{user.fornavn + " " + user.etternavn + " ( " + user.sum + " kr )"}}  <label></label><input type="checkbox" v-model="user.checked"></a>
    </div>
    <button>Fjern valgt gjeld</button>

  </div>
</template> -->




<script>

  import axios from 'axios';
  import router from '@/router/index'
  import {store} from '../../store'

  export default {
    created(){
      axios.get('http://localhost:9000/rest/gjeldBrukerKreverInn/' + store.state.current_user.bruker_id).then(response => {
        this.users = response.data;
      }).catch(err => {
        console.log(err);
      });
    },
    data(){
        return {
            users: []
        };
    },
    methods:{
        selectUser(user){
          router.push('GjeldInnSpesifisert/' + user.bruker_id);
        }
    }
  };
</script>
<style>

</style>
