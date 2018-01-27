<template>
  <div class="tile is-vertical">
    <div class="tile is-ancestor">
      <div class="tile is-2 is-center"></div>
      <div class="tile is-8 is-center">
        <div class=" tile is-parent is-6 ">
          <div class="tile is-child box" style="background-color: hsl(217, 71%, 53%)	">
            <ItemChart></ItemChart>
          </div>
        </div>
        <div class="tile is-parent is-6">
          <div class="tile is-child box" style="background-color: hsl(217, 71%, 53%)	">
            <GjeldChart></GjeldChart>
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
