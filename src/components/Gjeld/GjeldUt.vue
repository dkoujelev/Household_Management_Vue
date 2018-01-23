<template>
  <div class="box">
    <div class="title is-size-5">Brukere jeg skylder penger</div>
      <div>
        <table>
          <thead>
           <th scope="col" > Navn  </th>
           <th scope="col" > Sum  </th>
           
           <!-- <th scope="col" > Dato Lagt til</th> -->
          </thead>

          <tbody>
            <a @click="selectUser(user)" v-for="user in users">
            <tr >
              <td data-label="Navn"> {{user.fornavn + " " + user.etternavn + " " }} </td>
              <td data-label="Sum"> {{user.sum + " kr"}} </td>
            </tr>
            </a>
          </tbody>
        </table>

        <!-- <a>{{user.fornavn + " " + user.etternavn + " ( " + user.sum + " kr )"}}</a> -->
      </div>
  </div>

</template>
<script>

  import axios from 'axios';
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
    }
  };
</script>
<style>

</style>
