<template>
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
</template>

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
  table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
    border: 1px solid #ddd;
  }

  th, td {
    text-align: left;
    padding: 16px;

  }

  tr {
    color: royalblue;
  }

  th {
    background-color: gainsboro;
  }

  tr:nth-child(odd) {
    background-color: #f2f2f2

  }
  tr:hover {
    background-color: azure;
    text-decoration-line: underline;
    color: royalblue;
    cursor: hand;

  }
  tr:active{
    color: black;
  }


</style>

