<template>
<<<<<<< HEAD
  <div>
    <table>
      <thead>
        <th>Tittel</th>
        <th>Nyhet</th>
        <th>Når</th>
        <th></th>
      </thead>
      <tr v-for="row in rows">
        <td>{{row.hvem}}</td>
        <td>{{row.nyhet}}</td>
        <td>{{row.nar}}</td>
        <td v-if="row.knapper"><button class="button is-danger" @click="deleteNews(row)">Slett</button></td>
      </tr>
    </table>
    <router-link class="button" to="/Addnews">Lag nyhet</router-link>
=======
  <div class="is-ancestor box" style="background-color: green">
    <div class="is-parent box" style="background-color: peru">
      <div class="is-child box" style="background-color:lightblue">
        <div>
          <vue-good-table
            title="Nyhets-feed"
            :columns="columns"
            :rows="rows"
            :paginate="true"
            per-page=5
          next-text="Neste"
          prev-text="Forrige"
          rows-per-page-text="Antall rader"
          of-text="av"

          />
          <br>
          <router-link class="button is-dark" to="/Addnews">Lag nyhet</router-link>
        </div>
      </div>
    </div>
>>>>>>> 1154b54b452737ca03d7291d2745e55ce4dc18b7
  </div>
</template>

<script>

  import axios from 'axios';
  import Vue from 'vue'
  import {store} from '@/store'

  export default {
    name: 'Nyhetsfeed',
    data(){
      return {
        rows: []
      };
    },
    mounted(){
      this.fillRows();
    },
    methods: {
      formateDate(raw){
        return raw.substring(8, 10) + " " + raw.substring(5, 7) + " " + raw.substring(0,4)
          + " kl: " + raw.substring(11, 16);
      },
      deleteNews(row){
        let id = row.melding_id;
        axios.delete('http://localhost:9000/rest/melding/' + id).then(response => {
          alert('Nyhet slettet');
          this.rows = [];
          this.fillRows();
        });
      },
      fillRows(){
        axios.get('http://localhost:9000/rest/melding/motta/kollektiv/' + store.state.current_group.undergruppe_id).then(response => {
          let resRows = response.data;
          console.log(resRows[0].sendt);
          for(let i = 0; i < resRows.length; i++){
            let date = this.formateDate(resRows[i].sendt);
            let obj = {melding_id: resRows[i].melding_id, hvem: resRows[i].overskrift, nyhet: resRows[i].tekst, nar: date,
              knapper: (resRows[i].skrevet_av_bruker === store.state.current_user.bruker_id)};
            this.rows.push(obj);
          }
          }).catch(err => {
            console.log(err);
          });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  columns {
    color: black;

  }

</style>
