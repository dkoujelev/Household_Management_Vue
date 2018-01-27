<template>


        <div class="is-ancestor">
          <div class="is-parent">
            <div class="is-child">
              <div class="title" style="color:white">Oftest kjøpte varer i valgt tidsperiode</div>
              <div class="field-body">
                <div class="field"><label style="color:white">Fra dato: </label><flat-pickr :options="{dateFormat:'dd.mm.YYYY'}" v-model="from"></flat-pickr></div>
                <div class="field"><label style="color:white">Til dato: </label><flat-pickr :options="{dateFormat:'dd.mm.YYYY'}" v-model="to"></flat-pickr></div>
              </div>
              <br>
              <div class="content1">



                  <ChartAxis style="background-color: white" :data='chartData'></ChartAxis>
                 <!-- <a class="button" @click="goBack">Tilbake</a> -->
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
  .ChartAxis{
    width: 100%;
    height: 400px;
  }

  div.content1 {
    height: 500px;
    overflow: auto;
  }
</style>
