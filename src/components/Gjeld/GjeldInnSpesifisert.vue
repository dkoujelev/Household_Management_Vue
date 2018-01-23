<template>
  <div class="tile is-vertical box" style="background-color: white">
    <div class="is-ancestor" style="background-color: white">
      <div class=" is-parent is-vertical " style="background-color: white">
        <div class="child tile " style="background-color: white">
          <div class="title is-size-5">Penger som {{user_owes.fornavn + " " + user_owes.etternavn}} skylder meg: </div>
        </div> <br>

        <div class="child tile" style="background-color:white">
          <table class="table">
            <thead>
            <th scope="col">Utgift for:</th>
            <th scope="col">Dato:</th>
            <th scope="col">Delsum per handletur:</th>
            <th scope="col">Status: </th>
            </thead>

            <tbody>
            <tr v-for="debt in debts" @click="selectUser(user_owes)">
              <td data-label="Utgift for:">  Handletur  </td>
              <td data-label="Dato:" Dato> 22.01.18 </td>
              <td data-label="delsum:">  {{debt.belop + " kr" }}  </td>
              <td data-label="Status:"> <input type="checkbox"> </td>
            </tr>
            </tbody>
          </table>

        </div>

        <div class="box" style="background-color: white">
          <div class="columns">
            <div class="column is-three-fifths"> <p class="text"> Total skyld {{user_owes.fornavn + " " + user_owes.etternavn}} har til meg: &nbsp &nbsp</p> </div>
            <div class="column is-two-fifths"> <div class="box" style="background-color: lightsalmon; text-align: center">  41 kr </div>  </div>
          </div>
        </div> <br>

        <button @click="$router.back()">Tilbake</button>
        <button>Fjern valgt gjeld</button>
      </div>
    </div>
  </div>
</template>





<!-- <template>
  <div class="box">
    <div class="title is-size-5">Penger som {{user_owes.fornavn + " " + user_owes.etternavn}} skylder meg </div>
    <div class="level" v-for="debt in debts">
      <a>{{debt.belop}}kr -  litt mer info her <input type="checkbox"></a>
    </div>
    <button @click="$router.back()">Tilbake</button>
    <button>Fjern valgt gjeld</button>
  </div>
</template> -->



<!--
<template>
  <div class="is-ancestor" style="background-color: white">
    <div class=" is-parent is-vertical " style="background-color: white">
      <div class="child tile " style="background-color: white">
        <h3>Medlemmer som skylder meg penger</h3>
      </div>

      <div class="child tile" style="background-color:white">
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


    </div>
  </div>
</template> -->



<script>

  import axios from 'axios';
  import {store} from '../../store';

  export default {
    created(){
      axios.post('http://localhost:9000/rest/gjeldSpesifisert', {skylder: this.$route.params.bruker_skylder_id ,
        innkrever: store.state.current_user.bruker_id})
      .then(response => {
        this.debts = response.data;
        return axios.get('http://localhost:9000/rest/bruker/' + this.$route.params.bruker_skylder_id);
      }).then(response => this.user_owes = response.data)
      .catch(err => {
        console.log(err);
      });
    },
    data(){
      return {
        user_owes: {fornavn: '', etternavn: ''},
        debts: [],
        users: []
      };
    }
  };
</script>
<style>

</style>
