<template>
  <div class="app">
    <h1>{{ msg }}</h1>
    dette er en test for å se om ting virker
  </div>
</template>

<script>
  export default {
    name: 'Test',
    data () {
      return {
        msg: 'yolo'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
</style>
