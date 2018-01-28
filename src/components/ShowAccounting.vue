<template>
  <div class="container">
    <div class="columns is-centered ">
      <div class="column is-8">
        <div class="card is-rounded">
          <div class="is-ancestor box" style="background-color:hsl(217, 71%, 53%)	 ">
            <p class="title">Regnskap</p>
            <p class="subtitle"> Min personlige økonomiske balanse: </p>
            <div class="is-parent is-12">
              <div class="tile is-child is-6 is-centered">
                <div class="block is-centered">
                  <br>
                  <br>
                  <a class="button" @click="showingExpense=true"> Legg til utgift for gruppe</a>
                  <p class="subtitle"> Debet - Gjeld inn: &nbsp&nbsp&nbsp<span class="p" style="font-size: 20px; color: lawngreen; font-weight: bold"> {{totalDebt.sum_in}} kr &nbsp &nbsp <router-link class="button"  style="background-color: orange" to="/GjeldInn">Administrer </router-link> </span>  </p>
                  <p class="subtitle"> Kredit - Gjeld ut: &nbsp&nbsp&nbsp&nbsp&nbsp<span class="p" style="font-size: 20px; color: #ff9980; font-weight: bold"> {{totalDebt.sum_out}} kr &nbsp &nbsp <router-link class="button"  style="background-color: orange" to="/GjeldUt">Administrer </router-link> </span> </p>
                  <div class="block_1"></div> <hr/>
                  <p class="subtitle"> Balanse: &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
                    <span class="p" style="font-size: 20px; color: lawngreen; font-weight: bold" v-if="totalDebt.balance >= 0"> {{totalDebt.balance}} kr </span>
                    <span class="p" style="font-size: 20px; color: #ff9980; font-weight: bold" v-else> {{totalDebt.balance}} kr </span>
                  </p>
                  <div class="block_1"></div> <hr/>
                  <br>
                  <br>
                </div>
              </div>
            </div>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            </div>
          </div>
        </div>
      </div>
    <Modal :modalVisible.sync="showingExpense" @modalClosing="closeModal" :showClose="false">
      <h2 slot="title" style="color:white">Legg til utgift</h2>
      <AddExpence slot="content" @closing="closeModal" />
    </Modal>
    </div>
</template>



<script>
  import axios from 'axios'
  import {store} from '@/store'
  import GjeldInn from '@/components/Gjeld/GjeldInn'
  import GjeldUt from '@/components/Gjeld/GjeldUt'
  import Modal from '@/components/Modal'
  import AddExpence from '@/components/AddExpence';

  export default {
    data(){
      return {
        showingExpense:false,
        updated: false
      };
    },
    methods: {
      closeModal(){
        this.showingExpense = false;
        this.updated = !this.updated;
      }
    },
    components: {GjeldInn, GjeldUt, Modal, AddExpence},
    asyncComputed:{
      totalDebt:{
        get(){
          let users_in, users_out;
          return axios.get('http://localhost:9000/rest/gjeldBrukerKreverInn/' + store.state.current_user.bruker_id).then(response => {
            users_in = response.data;
            return axios.get('http://localhost:9000/rest/gjeldBrukerErSkyldig/' + store.state.current_user.bruker_id);
          }).then(response=>{
            users_out = response.data;

            let sum_in=0, sum_out=0, balance;

            for(let user of users_in)
              sum_in+=user.sum;

            for(let user of users_out)
              sum_out+=user.sum;

            balance = sum_in-sum_out;

            return {sum_in,sum_out,balance};

          }).catch(err => {
            console.log(err);
          });
        },
        watch(){
          this.updated;
        },
        default:{sum_in:0,sum_out:0,balance:0}
      }
    },

  }
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
    height: 235px;
    overflow: auto;
  }
  p.title{
    color: white;
  }
  p{
    color: white;
  }

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

  button{
    background-color: orange;
    color: black;
    font-size: medium;
    font-weight: normal;
  }

</style>
