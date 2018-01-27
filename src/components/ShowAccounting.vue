<template>
  <div class="container">
    <div class="columns is-centered ">
      <div class="column is-8">
        <div class="card is-rounded">
          <div class="is-ancestor box" style="background-color:hsl(217, 71%, 53%)	 ">
            <p class="title">Regnskap</p>
            <p class="subtitle"> Min personlige økonomiske balanse: </p>
            <div class="is-parent is-centered is-12">
              <div class="tile is-child is-6 is-centered">
                <div class="block">
                  <br>
                  <br>
                  <a class="button" @click="showingExpense=true"> Legg til utgift for gruppe</a>

                  <p class="subtitle"> Debet - Gjeld inn: &nbsp&nbsp&nbsp<span class="p" style="font-size: 20px; color: lawngreen; font-weight: bold"> {{totalDebt.sum_in}} kr &nbsp &nbsp <router-link class="button"  style="background-color: orange" to="/GjeldInn">Administrer </router-link> </span>  </p>
                  <p class="subtitle"> Kredit - Gjeld ut: &nbsp&nbsp&nbsp&nbsp&nbsp<span class="p" style="font-size: 20px; color: #ff9980; font-weight: bold"> {{totalDebt.sum_out}} kr &nbsp &nbsp <router-link class="button"  style="background-color: orange" to="/GjeldUt">Administrer </router-link> </span> </p>
                  <div class="block_1"></div> <hr/>
                  <p class="subtitle"> Balanse: &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span class="p" style="font-size: 20px; color: lawngreen; font-weight: bold"> {{totalDebt.balance}} kr </span></p>
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
    <Modal :modalVisible.sync="showingExpense" @modalClosing="showingExpense=false;">
      <h2 slot="title" style="color:white">Legg til utgift</h2>
      <AddExpence slot="content" @closing="showingExpense=false;" />
    </Modal>
    </div>
</template>

<!--
<template>
  <div class="container">

      <div class="tile is-ancestor">
        <div class="tile"></div>
      <div class="tile is-10 is-center">
        <div class=" tile is-parent is-10 is-center">

          <div class="tile is-child box is-12 is-center" style="background-color: hsl(217, 71%, 53%)	">
            <p class="title" style="color: white;"> Regnskap</p>
            <GjeldInn :current_user="$parent.current_user" > </GjeldInn>
          </div>
        </div>
        <!-- <div class="tile is-parent is-12">
          <div class="tile is-child box" style="background-color: hsl(217, 71%, 53%)	">
            <GjeldUt :current_user="$parent.current_user">  </GjeldUt>
          </div>
        </div> -->
      <!--</div>
      </div>

  </div>


</template>


  <!-- <div class="container">

      <div class="content is-vertical notification is-success">

        <div class="columns">
          <div class="column 1">
            <p class="title">Mitt regnskap</p>
            <GjeldInn :current_user="$parent.current_user"> </GjeldInn>
          </div>

          <div class="column 2">
            <p class="title"> &nbsp</p>
            <GjeldUt :current_user="$parent.current_user"></GjeldUt>
          </div>
            <div class="ancestor">
              <div class="child">
                <div class="content">
                </div>
              </div>
            </div>
        </div>
      </div>
  </div>
</template>







<!-- To hovedkollonner-->

<!-- <template>

  <div class="tile is-vertical">
    <div class="tile is-ancestor">
      <div class="tile is-2 is-center"></div>
    <div class="tile is-8 is-center">
      <div class=" tile is-parent is-8 ">
        <div class="tile is-child box" style="background-color: hsl(217, 71%, 53%)	">
          <GjeldInn :current_user="$parent.current_user"> </GjeldInn>
        </div>
      </div>
      <div class="tile is-parent is-12">
        <div class="tile is-child box" style="background-color: hsl(217, 71%, 53%)	">
          <GjeldUt :current_user="$parent.current_user">  </GjeldUt>
        </div>
      </div>
    </div>
    </div>
  </div>-->





  <!-- <div class="container">
    <div class="tile is-ancestor">
      <div class="tile is-vertical">
        <div class="tile">
          <div class="tile is-parent is-vertical">
            <article class="tile is-child notification is-success">
              <div class="columns">

                <div class="column1">

                  <p class="title">Mitt regnskap</p>
                  <p class="subtitle">Medlemmer som skylder meg penger:</p>

                  <div class="content1">
                      <GjeldInn :current_user="$parent.current_user"> </GjeldInn>
                  </div>
                </div>
                <div class="column2">
                  <p class="title"> &nbsp</p>
                  <p class="subtitle">Medlemmer jeg skylder penger</p>
                  <div class="content" >
                    <GjeldUt :current_user="$parent.current_user"></GjeldUt>
                  </div>

                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> -->




<!-- My back up Regnskap-->
<!-- <template>

  <div class="tile is-vertical box" style="background-color: white">
    <div class="title"> Mitt Regnskap: <br> </div>
    <div class="tile is-ancestor" style="background-color: white">

      <div class="column">
        <div class="tile is-child box" style="background-color: white">
          <GjeldInn :current_user="$parent.current_user"> </GjeldInn>

        </div>
      </div>

      <div class="column">
        <div class="tile is-child box" style="background-color: white">
          <GjeldUt :current_user="$parent.current_user"></GjeldUt>
        </div>
      </div>
    </div>
  </div>
</template> -->




  <!-- My new Scoll box:

  <div class="tile is-ancestor">
    <div class="tile is-parent">
      <article class="tile is-child">
        <div class="container">
          <div class="FixedHeightContainer">
            <h2>Title</h2>
            <div class="Content">
              blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah...
            </div>

          </div>
        </div>



      </article>
    </div> -->







<!--<div class="columns is-mobile">
              <div class="column">1</div>
              <div class="column">2</div>
              <div class="column">3</div>
              <div class="column">4</div>
            </div> -->

<!--- <div class="box" style="background-color: white">
    <div class="title"> Mitt Regnskap <br> </div>




      <div class="columns">
        <div class="column is half"> </div>
        <div class="box is-one-third"> <GjeldInn :current_user="$parent.current_user"> </GjeldInn>  </div>
        <div class="column is-"> </div>
        <div class="box is-one-third">  <GjeldUt :current_user="$parent.current_user"></GjeldUt>  </div>


      </div>
    </div>
  </div> -->

<!-- <div class="tile is-vertical">
  <div class="tile is-ancestor">
    <div class=" tile is-parent">
      <div class="tile is-child box" style="background-color: lightskyblue">
        <Newsfeedhome></Newsfeedhome>
      </div>
    </div>
  </div>
  <div class="tile is-ancestor box" style="background-color: fuchsia">
    <div class="tile is-parent box" style="background-color: greenyellow">
      <div class="tile is-child box is-half" style="background-color: blue">
        <Shoppinglistshome></Shoppinglistshome>
      </div>
    </div>
    <div class="tile is-parent box" style="background-color: aquamarine">
      <div class="tile is-child box is-half" style="background-color: red">
        <Shoppinglistshome></Shoppinglistshome>
      </div>
    </div>
  </div>
</div> -->


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
        showingExpense:false
      };
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
