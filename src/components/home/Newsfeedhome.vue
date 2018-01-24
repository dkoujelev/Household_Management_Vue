<template>
  <div class="is-ancestor">
    <div class=" is-parent is-vertical ">
      <h2 class="subtitle is-2">Nyheter</h2>
      <div class="child tile is-vertical">
        <article class="message is-link" v-for="row in rows">
          <div class="message-header">
            <h2>{{row.overskrift}}</h2>
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
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import {store} from '@/store'

  export default {
    name: 'Nyhetsfeed',
    data() {
      return {
        rows: []
      };
    },
    mounted() {
      this.fillRows();
    },
    methods: {
      formateDate(raw) {
        return raw.substring(8, 10) + " " + raw.substring(5, 7) + " " + raw.substring(0, 4)
          + " kl: " + raw.substring(11, 16);
      },
      fillRows(){
        axios.get('http://localhost:9000/rest/melding/motta/kollektiv/' + store.state.current_group.undergruppe_id).then(response => {
          let resRows = response.data;
          let brukere;
          let len = (resRows.length <= 5 ? resRows.length : 5);

          axios.get('http://localhost:9000/rest/bruker').then(res => {
            brukere = res.data;
            console.log(resRows[0].sendt);
            for(let i = 0; i < len; i++){
              let date = this.formateDate(resRows[i].sendt);
              let obj = {hvem: brukere[resRows[i].skrevet_av_bruker],melding_id: resRows[i].melding_id, overskrift: resRows[i].overskrift, nyhet: resRows[i].tekst, nar: date,
                knapper: (resRows[i].skrevet_av_bruker === store.state.current_user.bruker_id)};
              this.rows.push(obj);
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
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }


</style>
