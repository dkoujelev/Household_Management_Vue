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
            <th scope="col">Beskrivelse</th>
            <th scope="col">Dato:</th>
            <th scope="col">Delsum per handletur:</th>
            <th scope="col">Slett gjeld? </th>
            <th scope="col">Tilknyttet handleliste</th>
            </thead>

            <tbody>
            <tr v-for="debt in debts">
              <td data-label="Utgift for:">  {{debt.beskrivelse}}  </td>
              <td data-label="Dato:"> {{debt.opprettet}} </td>
              <td data-label="delsum:">  {{debt.belop + " kr" }}  </td>
              <td data-label="Status:"> <input type="checkbox" v-model="debt.delete"> </td>
              <td data-label="Tilknyttet handleliste">
                <a v-if="debt.handleliste_id !== null" @click="showShoppingList(debt)">Vis handleliste</a>
                <p v-else>Ingen handleliste</p>
              </td>
            </tr>
            </tbody>
          </table>

        </div>
        <a class="button" @click="deleteDebt">Slett valgt gjeld</a>

        <div class="box" style="background-color: white">
          <div class="columns">
            <div class="column is-three-fifths"> <p class="text"> Total skyld {{user_owes.fornavn + " " + user_owes.etternavn}} har til meg: &nbsp &nbsp</p> </div>
            <div class="column is-two-fifths"> <div class="box" style="background-color: lightsalmon; text-align: center; font-weight: bold; font-size: large">  {{totalDebt}} kr </div>  </div>
          </div>
        </div> <br>

        <button @click="$router.back()">Tilbake</button>
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
  import router from '@/router'

  export default {
    created(){
      this.loadDebt();
    },
    data(){
      return {
        user_owes: {fornavn: '', etternavn: ''},
        debts: [],
        users: []
      };
    },
    methods:{
      formatDate(raw){
        return raw.substring(8, 10) + "." + raw.substring(5, 7) + "." + raw.substring(0,4);
      },
      loadDebt(){
        axios.post('http://localhost:9000/rest/gjeldSpesifisert', {skylder: this.$route.params.bruker_skylder_id ,
          innkrever: store.state.current_user.bruker_id})
          .then(response => {
            this.debts = response.data;
            for(let debt of this.debts)
              debt.opprettet = this.formatDate(debt.opprettet);
            return axios.get('http://localhost:9000/rest/bruker/' + this.$route.params.bruker_skylder_id);
          }).then(response => this.user_owes = response.data)
          .catch(err => {
            console.log(err);
          });
      },
      deleteDebt(){
        let debts_to_be_deleted=[];
        for(let debt of this.debts)
          if('delete' in debt && debt.delete)
            debts_to_be_deleted.push(debt.gjeld_id);

        console.log("deleting debts:");
        console.log(debts_to_be_deleted);

        axios.post('http://localhost:9000/rest/settFlereGjeldSomBetalt',{ids: debts_to_be_deleted})
          .then(response => {
            this.loadDebt();
          }).catch(err => console.log(err));
      },
      showShoppingList(debt){
        router.push('/ViewShoppingList/' + debt.handleliste_id);
      }
    },
    computed:{
      totalDebt(){
        let total = 0;
        for(let debt of this.debts)
          total += debt.belop;
        return total;
      }
    }
  };
</script>
<style>

</style>
