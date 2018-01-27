<template>
  <div class="container" >
    <div class="columns is-centered" >
      <div class="column is-8">

          <div class="is-ancestor box" style="background-color:hsl(217, 71%, 53%)">
            <div class="is-parent">
              <p class="title"> Debet - Gjeld inn</p>
              <p class="subtitle"> Skyld andre medlemmer har til meg </p>
              <br>

              <div class="block_1"></div> <hr/>
              <p class="subtitle"> Debet - Gjeld inn: &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span class="p" style="font-size: 20px; color: lawngreen; font-weight: bold"> {{totalDebt}} kr </span></p>
              <div class="block_1"></div> <hr/>

              <div class="is-child">
                <div class="block">

                  <div class="content1">
                    <br>
                    <table class="table is-child">
                      <thead>
                      <th scope="col">Navn</th>
                      <th scope="col">Person beløp</th>
                      <th scope="col"> Vis </th>
                      </thead>

                      <tbody>
                      <tr v-for="user in users" @click="selectUser(user)">
                        <td data-label="Navn">  {{user.fornavn}}  {{user.etternavn}}  </td>
                        <td data-label="Sum">  {{user.sum + " kr" }}  </td>
                        <td data-label="Vis"> <button> Vis person </button></td>
                      </tr>
                      </tbody>
                    </table>

                  </div>
                </div>

                </div>
              </div>
            <br>
            <br>
            <br>

            <a class="button" @click="showingExpense=true"> Legg til utgift for gruppe</a>
            <a class="button" @click="$router.back()">Avbryt</a>
            </div>
            <br>
            <br>
          </div>

      </div>
    <Modal :modalVisible.sync="showingExpense" @modalClosing="showingExpense=false;">
      <h2 slot="title" style="color:white">Legg til utgift</h2>
      <AddExpence slot="content" @closing="showingExpense=false;" />
    </Modal>
    </div>
</template>



<!-- <template>
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

      </div>
    </div>
  </div>
  </div>
</template> -->












<script>

  import axios from 'axios';
  import router from '@/router/index';
  import {store} from '../../store';
  import Modal from '@/components/Modal';
  import AddExpence from '@/components/AddExpence';

  export default {
    components:{Modal, AddExpence},
    created(){
      axios.get('http://localhost:9000/rest/gjeldBrukerKreverInn/' + store.state.current_user.bruker_id).then(response => {
        this.users = response.data;
      }).catch(err => {
        console.log(err);
      });
    },
    data(){
        return {
            users: [],
          showingExpense:false
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
