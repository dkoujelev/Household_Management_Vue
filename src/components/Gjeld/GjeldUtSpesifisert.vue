
<template>
  <div class="container" >
    <div class="columns is-centered" >
      <div class="column is-8">

        <div class="is-ancestor box" style="background-color:hsl(217, 71%, 53%)">
          <div class="is-parent">
            <h3 style="color: white">Penger som jeg skylder {{user_owes.fornavn + " " + user_owes.etternavn}}: </h3>
            <br>
            <div class="block_1"></div> <hr/>
            <p class="subtitle"> Kredit - Gjeld ut - {{user_owes.fornavn + " " + user_owes.etternavn}}: &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span class="p" style="font-size: 20px; color: #FF7F50; font-weight: bold"> {{totalDebt}} kr </span></p>
            <div class="block_1"></div> <hr/>
            <br>
            <div class="child tile" style="background-color:white">
              <table class="table">
                <thead>
                <th scope="col">Utgift for</th>
                <th scope="col">Dato</th>
                <th scope="col">Delsum per handletur</th>
                <th scope="col"></th>

                </thead>

                <tbody>
                <tr v-for="debt in debts">
                  <td data-label="Utgift for:">  {{debt.beskrivelse}}  </td>
                  <td data-label="Dato:" Dato> {{debt.opprettet}} </td>
                  <td data-label="Delsum:">  {{debt.belop + " kr" }}  </td>
                  <td data-label="Tilknyttet handleliste">
                    <a v-if="debt.handleliste_id !== null" @click="showShoppingList(debt)"><span class="icon"><i class="fa fa-shopping-cart fa-lg"></i></span></a>
                    <p v-else></p>
                  </td>
                </tr>
                </tbody>

              </table>

            </div>
          </div>
          <br>
          <br>
          <br>
          <br>
          <a class="button" @click="$router.back()">Avbryt</a>
        </div>
        <br>


      </div>

    </div>
    <Modal :modalVisible.sync="showingShoppingList" @modalClosing="showingShoppingList=false;">
      <h2 slot="title" style="color:white">{{currentList_name}}</h2>
      <ViewShoppingList :readOnly="true" :id.sync="currentList_id" slot="content" @closingShoppingList="showingShoppingList=false;"/>
    </Modal>
  </div>
</template>



<!-- Gjeld ut spesifisert -->
<!-- <template>
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
                <td data-label="Utgift for:">  {{debt.beskrivelse}}  </td>
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
</template> -->






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
  import Modal from '@/components/Modal';
  import ViewShoppingList from '@/components/ShoppingList/ViewShoppingList';

  export default {
    components:{Modal, ViewShoppingList},
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
        debts: [],
        currentList_id: null,
        currentList_name:null,
        showingShoppingList: false
      };
    },
    methods:{
      formatDate(raw){
        return raw.substring(8, 10) + "." + raw.substring(5, 7) + "." + raw.substring(0,4);
      },
      showShoppingList(debt){
        this.currentList_id = debt.handleliste_id;
        this.currentList_name = debt.handleliste_navn;
        this.showingShoppingList=true;
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
  .FixedHeightContainer
  {
    /** float:right; */
    height: 250px;
    width:250px;
    padding:3px;
    background:#f00;
  }
  .Content
  {
    height:200px;
    overflow:auto;
    /**background:#fff;*/
  }


  div.container {
    alignment: center;


  }
  .column1 {
    padding: 1%;
  }
  .column2 {
    padding: 1%;

  }
  .vl {
    border-left: 1px solid orange;
    height: 400px;
    position: absolute;
    left: 50%;
    margin-left: -3px;
    top: 0;
    down: 0;
  }





  /** */


  div.content1 {
    height: 330px;
    overflow: auto;
  }
  p.title{
    color: white;
  }
  p{
    color: white;
  }

  /** .table {
    width: 50%
  } */

  thead th:nth-child(1){
    width: 70%;
  }
  thead th:nth-child(2){
    width: 15%;
  }
  thead th:nth-child(3){
    width: 15%;
  }
  hr { width:100%; height:1px; background: #fff }

  .button {
    background-color: orange;
    color: black;
    font-size: medium;
    font-weight: normal;
  }

  button {
    background-color: orange;
    color: black;
    font-size: medium;
    font-weight: normal;
  }
  .container.inner{
    height:150px;
    overflow:auto;
    /**background:#fff;*/
  }
</style>
