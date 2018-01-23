<template>
  <div class="is-ancestor" style="background-color: white">
    <div class=" is-parent is-vertical " style="background-color: saddlebrown">
      <div class="child tile " style="background-color: lightgray">
        <h3>Nyhetsfeed</h3>
      </div>
      <div class="child tile" style="background-color:lightgray">
        <table>
          <thead>
          <th scope="col">Tittel</th>
          <th scope="col">Nyhet</th>
          <th scope="col">Når</th>
          <th scope="col"></th>
          </thead>
          <tr v-for="row in rows">
            <td data-label="Tittel">{{row.overskrift}}</td>
            <td data-label="Nyhet">{{row.nyhet}}</td>
            <td data-label="Når">{{row.nar}}</td>
            <td v-if="row.knapper"><button class="button is-danger" @click="deleteNews(row)">Slett</button></td>
            <td v-else></td>
          </tr>
        </table>

      </div>
        <div class="child tile" style="background-color: lightgrey">
          <router-link class="button" to="/Addnews">Lag nyhet</router-link>
        </div>

      </div>
    </div>
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
            let obj = {melding_id: resRows[i].melding_id, overskrift: resRows[i].overskrift, nyhet: resRows[i].tekst, nar: date,
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
  body {
    font-family: "Open Sans", sans-serif;
    line-height: 2.25;
  }
  table {
    border: 2px solid #ccc;
    border-collapse: collapse;
    margin: 0;
    padding: 0;
    width: 100%;
    table-layout:auto; /*table setup*/
  }
  table caption {
    font-size: 1.5em;
    margin: .5em 0 .75em;
  }
  table tr {
    background: #f8f8f8;
    border: 1px solid #ddd;
    padding: .35em;
  }
  table th,
  table td {
    background: lightgray;
    padding: .625em;
    text-align: left;
  }
  table th {
    background: grey;
    font-size: .85em;
    letter-spacing: .1em;
    text-transform: uppercase;
  }
  @media screen and (max-width: 600px) {
    table {
      border: 0;
    }
    table caption {
      font-size: 1.3em;
    }
    table thead {
      border: none;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }
    table tr {
      border-bottom: 3px solid #ddd;
      display: block;
      margin-bottom: .625em;
    }
    table td {
      border-bottom: 1px solid #ddd;
      display: block;
      font-size: .8em;
      text-align: right;
    }
    table td:before {
      /*
      * aria-label has no advantage, it won't be read inside a table
      content: attr(aria-label);
      */
      content: attr(data-label);
      float: left;
      font-weight: bold;
      text-transform: uppercase;
    }
    table td:last-child {
      border-bottom: 0;
    }
  }

  button{
    color: orange;
  }

</style>
