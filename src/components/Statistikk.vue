<template>
  <div>
    <ItemChart></ItemChart>
    <GjeldChart></GjeldChart>
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
