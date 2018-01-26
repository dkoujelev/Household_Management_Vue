<template>

  <div class="columns is-centered">
    <div class="column is-7">
      <div class="card is-rounded is-centered">
        <div class="is-ancestor box" style="background-color: hsl(48, 100%, 67%)	">
          <div class="is-parent">
            <div class="is-child">
              <div class="title">Statistikk</div>
              <div class="content1">
                Brukere som har mest gjeld i kollektivet:
                <ChartPie :data='chartData'></ChartPie>
                <a class="button" @click="goBack">Tilbake</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import { ChartPie } from 'vue-d2b'
  import router from '@/router'
  import {store} from '@/store'
  import axios from 'axios'

  export default {
    asyncComputed:{
      chartData: {
        get(){

          let kollektiv_id = store.state.current_group.kollektiv_id;
          return axios.get('http://localhost:9000/rest/statistikkGjeldKollektiv/'+kollektiv_id)
            .then(response => {
              let chart_data = [];
              for(let user of response.data){
                chart_data.push({
                  label: user.fornavn + " " + user.etternavn,
                  value: user.belop
                });
              }
              return chart_data;
            });
        },
        default(){
          return [];
        }
      }
    },
    components: {
      ChartPie
    },
    methods:{
      goBack(){
        router.back();
      }
    }
  }
</script>

<style scoped>
  .chart{
    width: 100%;
    height: 400px;
  }

  div.content1 {
    height: 500px;
    overflow: auto;
  }
</style>
