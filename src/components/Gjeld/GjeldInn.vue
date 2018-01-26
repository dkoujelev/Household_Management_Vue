<template>
  <div class="container">
    <br>
    <p class="subtitle">Medlemmer som skylder meg penger:</p>
    <p class="text"> Totalbeløp: &nbsp &nbsp    <span class="ny" style="font-weight: bold; font-size: large; text-align: center; color: red"> {{totalDebt}} kr </span>  </p>

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

    <br>
    <router-link class="button is-white is-rounded is-outlined" to="AddExpence">Legg til utgift </router-link>
    <div class="columns is-centered">
      <div class="column is-8">
        <div class="card is-rounded is-centered">
          <div class="is-ancestor box" style="background-color: hsl(217, 71%, 53%)">
            <div class="is-parent">
            </div>
            <div class="child tile" >
            </div>
            <div class="is-child">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>












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
    },
    computed: {
      totalDebt(){
        let total = 0;
        for(let user of this.users)
          total += user.sum;
        return total;
      }
    }


  };
</script>
<style scoped>


</style>


<!-- old table
     <table class="myTable">
       <thead class="myThead">
         <div class="myTd" scope="col">Navn:</div>
         <div class="myTd" scope="col">Delsum per medlem:</div>
       </thead>
       <tbody>
       <tr v-for="user in users">
         <td data-label="Navn:"> <p @click="selectUser(user)">{{user.fornavn}}  {{user.etternavn}}</p>  </td>
         <td data-label="Totalsum">  {{user.sum + " kr" }}  </td>
       </tr>
       </tbody>
     </table> -->
