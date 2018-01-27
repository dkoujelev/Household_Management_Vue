<template>
  <div class="container">
    <div class="columns is-centered">
      <div class="column is-8">

          <div class="is-ancestor">
            <div class="is-parent box" style="background-color:hsl(217, 71%, 53%)">
              <div class="is-child ">
                <ItemChart></ItemChart>
              </div>
            </div>
            <div class="is-parent box" style="background-color:hsl(217, 71%, 53%)">
              <div class="is-child">
                <GjeldChart></GjeldChart>
              </div>
            </div>
          </div>

      </div>
    </div>
  </div>
</template>


<script>

  import ItemChart from '@/components/Charts/ItemChart';
  import GjeldChart from '@/components/Charts/GjeldChart';

  export default {
    name: 'Statistikk',
    components:{ItemChart, GjeldChart}
  };
</script>
<style></style>
