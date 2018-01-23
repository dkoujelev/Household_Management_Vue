<template>
  <div class="box">
    <GjeldInn :current_user="$parent.current_user"></GjeldInn>
    <GjeldUt :current_user="$parent.current_user"></GjeldUt>
  </div>
</template>



<script>
  import GjeldInn from '@/components/Gjeld/GjeldInn'
  import GjeldUt from '@/components/Gjeld/GjeldUt'
  export default {
    components: {GjeldInn, GjeldUt}
  }
</script>

