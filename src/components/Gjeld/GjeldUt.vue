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
        <div class="child tile box" style="background-color: lightsalmon; font-weight: bold; font-size: large" > 41 kr </div>
      </div> <br>


    </div>
  </div>
</template>


<style>
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


<!-- <template>
  <div class="box">
    <div class="title is-size-5">Medlemmer jeg skylder penger</div>
      <div>
        <table>
          <thead>
           <th scope="col" > Navn  </th>
           <th scope="col" > Sum  </th>

           <!-- <th scope="col" > Dato Lagt til</th>
          </thead>

          <tbody>
            <a @click="selectUser(user)" v-for="user in users">
              <tr>
                <td data-label="Navn"> {{user.fornavn}}  {{user.etternavn}} </td>
                <td data-label="Sum"> {{user.sum + " kr"}} </td>
              </tr>
            </a>
          </tbody>
        </table>

        <!-- <a>{{user.fornavn + " " + user.etternavn + " ( " + user.sum + " kr )"}}</a>
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
    }
  };
</script>
<style>

</style>
