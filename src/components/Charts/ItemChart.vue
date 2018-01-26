<template>
    <div class="is-parent">
      <div class="tile is-child box">
        <div class='chart'>
          <div class="field"><label>fra dato: </label><flat-pickr v-model="from"></flat-pickr></div>
          <div class="field"><label>til dato: </label><flat-pickr v-model="to"></flat-pickr></div>
          Oftest kjøpte varer i valgt periode:
          <ChartAxis :data='chartData'></ChartAxis>
        </div>
      </div>
      <!-- FUCKED FIX for å unngå at chart havner utfor div'en. -->
      <div class="tile is-child box">
        <br />
        <br />
        <br />
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
    }
  }
</script>

<style scoped>
  .chart{
    width: 100%;
    height: 400px;
  }
</style>
