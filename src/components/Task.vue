<template>
  <div class="app">
    <div class="block">
      <table class="table">
        <thead>
          <tr>
            <th>Beskrivelse</th>
            <th>Frist</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <th>Vaske doen</th>
          <th>Om 2 dager</th>
          <th>
            <label class="checkbox">
              <input type="checkbox">
            </label>
          </th>
        </tr>
        <tr>
          <th>Vaske doen</th>
          <th>Om 5 dager</th>
          <th>
            <label class="checkbox">
              <input type="checkbox">
            </label>
          </th>
        </tr>
        <tr>
          <th>Vaske doen</th>
          <th>Om 7 dager</th>
          <th>
            <label class="checkbox">
              <input type="checkbox">
            </label>
          </th>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Task',
    data () {
      return {
        msg: ''
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
