<template>
  <div>
    <flat-pickr v-model="date" :config="{enableTime: true}"></flat-pickr>
  </div>
</template>

<script>
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';

  export default {
    data () {
      return {
        date: new Date(),
      }
    },
    components: {
      flatPickr
    }
  }
</script>
