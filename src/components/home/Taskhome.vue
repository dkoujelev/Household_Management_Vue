<template>
  <div class="'columns">

    <table class="table is-striped is-bordered is-fullwidth is-hoverable">
      <thead>
      <tr>
        <th>Beskrivelse</th>
        <th>Frist</th>
        <th>Status</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>Vaske doen</td>
        <td>Om 2 dager</td>
        <td>
          <label class="checkbox">
            <input type="checkbox">
          </label>
        </td>
      </tr>
      <tr>
        <td>Vaske doen</td>
        <td>Om 5 dager</td>
        <td>
          <label class="checkbox">
            <input type="checkbox">
          </label>
        </td>
      </tr>
      <tr>
        <td>Vaske doen</td>
        <td>Om 7 dager</td>
        <td>
          <label class="checkbox">
            <input type="checkbox">
          </label>
        </td>
      </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
  export default {
    name: 'Taskhome',
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
