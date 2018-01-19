<template>
  <div>

    <testDato></testDato>

  <div class='chart'>
    <!-- import font awesome for legend icons -->
    <link href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' rel='stylesheet'>
    <ChartAxis :data='chartData'></ChartAxis>
  </div>
  </div>
</template>

<script>
  import { svgArea, svgLine, svgScatter } from 'd2b'
  import { ChartAxis } from 'vue-d2b'
  import testDato from '@/components/Charts/testDato'

  export default {
    data () {
      return {
        chartData: {
          sets: [
            {
              generators: [svgArea(), svgLine(), svgScatter()],
              graphs: [
                {
                  label: 'area 1',
                  values: [
                    {x: 1, y: 25},
                    {x: 2, y: 38},
                    {x: 3, y: 24},
                    {x: 4, y: 60},
                    {x: 5, y: 22}
                  ]
                },
                {
                  label: 'area 2',
                  values: [
                    {x: 1, y: 15},
                    {x: 2, y: 8},
                    {x: 3, y: 54},
                    {x: 4, y: 22},
                    {x: 5, y: 20}
                  ]
                }
              ]
            }
          ]
        }
      }
    },

    components: {
      ChartAxis,
      testDato
    }
  }
</script>

<style scoped>
  .chart{
    width: 100%;
    height: 500px;
  }
</style>
