<template>

  <div class="columns is-centered">
    <div class="column is-7">
      <div class="card is-rounded is-centered">
        <div class="is-ancestor box" style="background-color: hsl(48, 100%, 67%)	">
          <div class="is-parent">
            <div class="is-child">
              <div class="title">Statistikk</div>
              <div class="content1">
                <div class="field-body">
                  <div class="field"><label>fra dato: </label><flat-pickr :options="{dateFormat:'dd.mm.YYYY'}" v-model="from"></flat-pickr></div>
                  <div class="field"><label>til dato: </label><flat-pickr :options="{dateFormat:'dd.mm.YYYY'}" v-model="to"></flat-pickr></div>
                </div>
                <br>
                Oftest kjøpte varer i valgt tidsperiode:
                  <ChartAxis :data='chartData'></ChartAxis>
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
  import { svgArea, svgLine, svgScatter, svgBar } from 'd2b'
  import { ChartAxis } from 'vue-d2b'
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  import {store} from '@/store';
  import axios from 'axios';
  import router from '@/router';

  export default {
    data () {
      let from_date = new Date();
      from_date.setFullYear(from_date.getFullYear()-1);
      return {
        from: from_date,
        to: new Date()
      }
    },
    asyncComputed:{
      chartData: {
        get(){
          let settings = {
            fra: this.from, til:this.to,
            kollektiv_id: store.state.current_group.kollektiv_id,
            antall: 5
          };

          let response = {data:[
            {navn: 'Melk', antall:3},
            {navn: 'Ost', antall: 5}
          ]};

        return axios.post('http://localhost:9000/rest/statistikkMestKjopteVarerKollektiv/'+settings.kollektiv_id, settings)
          .then(response => {
          let chart_data= {
            sets: [
              {
                generators: [svgBar()],
                graphs: [
                  {
                    label: 'Ofte kjøpte varer',
                    values: []
                  }
                ]
              }
            ]
          };
          for(let vare of response.data){
            chart_data.sets[0].graphs[0].values.push({
              x: vare.navn,
              y: vare.antall
            });
          }
          return chart_data;
          });
        },
        default(){
          return {
            sets: [
              {
                generators: [svgBar()],
                graphs: [
                  {
                    label: 'Ofte kjøpte varer',
                    values: []
                  }
                ]
              }
            ]
          };
        }
      }
    },
    components: {
      ChartAxis,
      flatPickr
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
