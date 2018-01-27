
<template>
  <div class="container">
    <br>
    <p class="subtitle">Medlemmer jeg skylder penger:</p>
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










<!-- Old content -->
<!-- <template>
  <div class="is-ancestor" style="background-color: white">
    <div class=" is-parent is-vertical " style="background-color: white">
      <div class="child tile " style="background-color: white">
        <h3>Medlemmer jeg skylder penger: </h3> <br>
      </div>
      <div class="child tile" style="background-color:white">
        <table class="table">
          <thead>
            <th scope="col">Navn:</th>
            <th scope="col">Delsum per medlem:</th>
          </thead>

          <tbody>
              <tr v-for="user in users" >
                <td data-label="Navn"> <a @click="selectUser(user)"> {{user.fornavn}}  {{user.etternavn }}  </a>  </td>
                <td data-label="Totalsum"> <a @click="selectUser(user)">{{user.sum + " kr" }}  </a> </td>
              </tr>
          </tbody>
        </table>

      </div>

      <div class="child tile box" style="background-color: white">
        <p class="text"> Total skyld jeg har til andre medlemmer: &nbsp &nbsp</p>
        <div class="child tile box" style="background-color: lightsalmon; font-weight: bold; font-size: large" > {{totalDebt}} kr </div>
      </div> <br>


    </div>
  </div>
</template> -->

<script>

  import axios from 'axios';
  import router from '@/router/index'
  import {store} from '../../store'

  export default {
    created(){
      axios.get('http://localhost:9000/rest/gjeldBrukerErSkyldig/' + store.state.current_user.bruker_id).then(response => {
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
        router.push('GjeldUtSpesifisert/' + user.bruker_id);
      }
    },
    computed:{
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

