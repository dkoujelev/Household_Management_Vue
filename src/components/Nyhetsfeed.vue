<template>
  <div class="is-ancestor">
    <div class=" is-parent is-vertical ">
      <h2 class="subtitle is-2">Nyheter</h2>
      <div class="child tile is-vertical">
        <article class="message is-link" v-for="row in rows">
          <div class="message-header">
            <h2>{{row.overskrift}}</h2>
            <a v-if="row.knapper" @click="deleteNews(row)">Slett</a>
          </div>
          <div class="message-body">
            <h3>{{row.nyhet}}</h3>

            <div class="block">
              <nav class="level">
                <!-- left side -->
                <div class="level-left">
                  <p class="has-text-grey">{{row.hvem.fornavn}} {{row.hvem.etternavn}}</p>
                </div>

                <!-- right side -->
                <div class="level-right">
                  <div class="level-item">
                    <p class="has-text-grey">{{row.nar}}</p>
                  </div>
                </div>
              </nav>
            </div>


          </div>

        </article>
      </div>
      <div class="child box" style="background-color: azure">
        <router-link class="button is-link" to="/Addnews">Lag nyhet</router-link>
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
    props: [ 'value' ],
    computed: {
      len: function () {
        return (isNaN(Number.parseInt(this.value)) ? -1 : this.value);
      }
    },
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
          let brukere;
          axios.get('http://localhost:9000/rest/bruker').then(res => {
            brukere = res.data;
            let cap = this.len;
            for(let i = 0; i < resRows.length; i++){
              let date = this.formateDate(resRows[i].sendt);
              let obj = {hvem: brukere[resRows[i].skrevet_av_bruker],melding_id: resRows[i].melding_id, overskrift: resRows[i].overskrift, nyhet: resRows[i].tekst, nar: date,
                knapper: (resRows[i].skrevet_av_bruker === store.state.current_user.bruker_id)};
              this.rows.push(obj);
              console.log(cap);
              if(cap > 0){
                cap -= 1;
              }
              if(cap === 0){
                break;
              }
            }
          });
          }).catch(err => {
            console.log(err);
          });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  tbody {
    height: 200px;
    display: inline-block;
    width: 100%;
    overflow: auto;
  }
  body {
    height: 230px;
    overflow-x: auto;
    overflow-y: auto;
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
