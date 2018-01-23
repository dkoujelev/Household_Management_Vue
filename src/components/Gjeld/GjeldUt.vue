<template>
  <div class="is-ancestor" style="background-color: white">
    <div class=" is-parent is-vertical " style="background-color: saddlebrown">
      <div class="child tile " style="background-color: lightgray">
        <h3>Medlemmer jeg skylder penger</h3>
      </div>
      <div class="child tile" style="background-color:lightgray">
        <table class="table">
          <thead>
            <th scope="col">Navn</th>
            <th scope="col">Sum</th>
          </thead>

          <tbody>

              <tr v-for="user in users" >

                <td data-label="Navn"> <a @click="selectUser(user)"> {{user.fornavn}}  {{user.etternavn }}  </a>  </td>
                <td data-label="Sum"> <a @click="selectUser(user)">{{user.sum + " kr" }}  </a> </td>

              </tr>

          </tbody>
        </table>

      </div>
      <div class="child tile" style="background-color: lightgrey">
        <router-link class="button" to="/Addnews">Lag nyhet</router-link>
      </div>

    </div>
  </div>
</template>





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
