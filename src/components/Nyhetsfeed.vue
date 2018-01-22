<template>
  <div>
    <vue-good-table
      title="Nyhets-feed"
      :columns="columns"
      :rows="rows"
      :onClick="deleteNews"
      :paginate="true"
      per-page=5
      next-text="Neste"
      prev-text="Forrige"
      rows-per-page-text="Antall rader"
      of-text="av"

    />
    <router-link class="button" to="/Addnews">Lag nyhet</router-link>
  </div>
</template>

<script>

  import axios from 'axios';
  import Vue from 'vue'
  import VueGoodTable from 'vue-good-table';
  import {store} from '@/store'
  Vue.use(VueGoodTable);

  export default {
    name: 'Nyhetsfeed',
    data(){
      return {
        columns: [
          {
            label: 'Hvem',
            field: 'hvem',
            filterable: false
          },
          {
            label: 'Nyhet',
            field: 'nyhet',
            filterable: false
          },
          {
            label: 'Når',
            field: 'nar',
            filterable: false
          },
          {
            label: '',
            field: 'knapper',
            filterable: false,
            html: true
          }
        ],
        rows: [],
        news_id: []
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
      deleteNews(row, index){
        let id = this.news_id[row.originalIndex];
        
      },
      fillRows(){
        axios.get('http://localhost:9000/rest/melding/motta/kollektiv/' + store.state.current_group.undergruppe_id).then(response => {
          let resRows = response.data;
          console.log(resRows[0].sendt);
          for(let i = 0; i < resRows.length; i++){
            let date = this.formateDate(resRows[i].sendt);
            let obj = {hvem: resRows[i].overskrift, nyhet: resRows[i].tekst, nar: date,
              knapper: (resRows[i].skrevet_av_bruker === store.state.current_user.bruker_id ? "<button class='button is-danger' @click='deleteNews'>Slett</button>" : '')};
            this.news_id.push(resRows[i].melding_id);
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
