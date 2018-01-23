<template>
  <div class="is-ancestor" style="background-color: white">
    <div class=" is-parent is-vertical " style="background-color: white">
      <div class="child tile " style="background-color: white">
        <h3>Medlemmer som skylder meg penger: </h3> <br>
      </div>

      <div class="child tile" style="background-color:white">
        <table class="table">
          <thead>
            <th scope="col">Navn:</th>
            <th scope="col">Delsum per medlem:</th>
          </thead>

          <tbody>
            <tr v-for="user in users" @click="selectUser(user)">
              <td data-label="Navn:">  {{user.fornavn}}  {{user.etternavn}}  </td>
              <td data-label="Totalsum">  {{user.sum + " kr" }}  </td>
            </tr>
          </tbody>
        </table>

      </div>

      <div class="child tile box" style="background-color: white">
        <p class="text"> Total skyld andre medlemmer har til meg: &nbsp &nbsp</p>
        <div class="child tile box" style="background-color: lightsalmon"> 124197 kr </div>
      </div> <br>


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
