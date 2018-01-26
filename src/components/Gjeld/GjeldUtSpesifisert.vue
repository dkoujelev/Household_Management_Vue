
<template>
  <div class="tile is-vertical box" style="background-color: white">
    <div class="is-ancestor" style="background-color: white">
      <div class=" is-parent is-vertical " style="background-color: white">
        <div class="child tile " style="background-color: white">
          <div class="title is-size-5">Penger som jeg skylder {{user_owes.fornavn + " " + user_owes.etternavn}}: </div>
        </div> <br>

        <div class="child tile" style="background-color:white">
          <table class="table">
            <thead>
            <th scope="col">Utgift for:</th>
            <th scope="col">Dato:</th>
            <th scope="col">Delsum per handletur:</th>
            <th scope="col">Handleliste </th>

            </thead>

            <tbody>
              <tr v-for="debt in debts">
                <td data-label="Utgift for:">  Handletur  </td>
                <td data-label="Dato:" Dato> {{debt.opprettet}} </td>
                <td data-label="Delsum:">  {{debt.belop + " kr" }}  </td>
                <td data-label="Tilknyttet handleliste">
                  <a v-if="debt.handleliste_id !== null" @click="showShoppingList(debt)">Vis handleliste</a>
                  <p v-else>Ingen handleliste</p>
                </td>
              </tr>
            </tbody>




          </table>


        </div>
        <div class="box" style="background-color: white">
          <div class="columns">
            <div class="column is-three-fifths"> <p class="text"> Total skyld jeg har til {{user_owes.fornavn + " " + user_owes.etternavn}}: &nbsp &nbsp</p> </div>
            <div class="column is-two-fifths"> <div class="box" style="background-color: lightsalmon; text-align: center; font-weight: bold; font-size: large">  {{totalDebt}} kr </div>  </div>
          </div>
        </div> <br>

        <button @click="$router.back()"> Tilbake </button>

      </div>
    </div>
  </div>
</template>






<!-- <template>
  <div class="box">
    <div class="title is-size-5">Penger som jeg skylder {{user_owes.fornavn + " " + user_owes.etternavn}} </div>
    <div class="level" v-for="debt in debts">
      <a> {{debt.belop}}kr -  litt mer info her <input type="checkbox"></a>
    </div>
    <button @click="$router.back()">Tilbake</button>


  </div>
</template> -->






<script>

  import axios from 'axios';
  import {store} from '../../store';
  import router from '@/router';

  export default {
    created(){
      axios.post('http://localhost:9000/rest/gjeldSpesifisert', {skylder: store.state.current_user.bruker_id ,
        innkrever: this.$route.params.bruker_skylder_id})
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
    data(){
      return {
        user_owes: {fornavn: '', etternavn: ''},
        debts: []
      };
    },
    methods:{
      showShoppingList(debt){
        router.push('/ViewShoppingList/' + debt.handleliste_id);
      },
      formatDate(raw){
        return raw.substring(8, 10) + "." + raw.substring(5, 7) + "." + raw.substring(0,4);
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
<style scoped>

</style>
