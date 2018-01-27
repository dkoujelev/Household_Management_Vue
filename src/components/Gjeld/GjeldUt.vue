<template>
  <div class="container" >
    <div class="columns is-centered" >
      <div class="column is-8">

        <div class="is-ancestor box" style="background-color:hsl(217, 71%, 53%)">
          <div class="is-parent">
            <p class="title"> Kredit - Gjeld Ut</p>
            <p class="subtitle"> Skyld jeg har til andre medlemmer </p>
            <br>


            <div class="block_1"></div> <hr/>
            <p class="subtitle"> Kredit - Gjeld ut total: &nbsp&nbsp<span class="p" style="font-size: 20px; color: #FF7F50; font-weight: bold"> {{totalDebt}} kr </span></p>
            <div class="block_1"></div> <hr/>

            <div class="is-child">
              <div class="block">
                <div class="content1">
                  <br>
                  <table class="table is-child">
                    <thead>
                    <th scope="col">Navn</th>
                    <th scope="col">Person belløp</th>
                    <th scope="col"> Vis </th>
                    </thead>

                    <tbody>
                    <tr v-for="user in users" @click="selectUser(user)">
                      <td data-label="Navn">  {{user.fornavn}}  {{user.etternavn}}  </td>
                      <td data-label="Sum">  {{user.sum + " kr" }}  </td>
                      <td data-label="Vis"> <button class="button" style="background-color: hsl(217, 71%, 53%); color: white"> Vis person </button></td>
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
          <br>
          <a class="button" @click="$router.back()">Avbryt</a>

        </div>
        <br>


      </div>

    </div>
  </div>
</template>



<!-- <template>
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


        </div>
      </div>
    </div>
  </div>
</template> -->










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

