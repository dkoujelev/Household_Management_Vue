<template>
    <div class="box">
      <div class='chart'>
        <div class="field"><label>test</label><flat-pickr v-model="from"></flat-pickr></div>
        <div class="field"><label>test</label><flat-pickr v-model="to"></flat-pickr></div>
        <ChartAxis :data='chartData'></ChartAxis>
      </div>
    </div>
</template>

<script>
  import { svgArea, svgLine, svgScatter, svgBar } from 'd2b'
  import { ChartAxis } from 'vue-d2b'
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  import {store} from '@/store';

  export default {
    data () {
      return {
        from: new Date(),
        to: new Date()
      }
    },
    asyncComputed:{

      chartData(){
        let settings = {
          from: this.from, to:this.to,
          kollektiv_id: store.state.current_group.kollektiv_id,
          antall: 5
        };

        let response = {data:[
          {navn: 'Melk', antall:3},
          {navn: 'Ost', antall: 5}
        ]};

//        return axios.post('http://localhost:9000/rest/oftestKjopteVarer', settings)
//          .then(response => {
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
//          });
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
    height: 500px;
  }
</style>
