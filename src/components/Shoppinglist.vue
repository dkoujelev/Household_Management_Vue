<template>
  <div class="'columns">

    <table class="table is-striped is-bordered is-fullwidth is-hoverable ">
      <thead>
      <tr>
        <td>Produkt</td>
        <td>Antall</td>
        <td>Status</td>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>Melk</td>
        <td>2</td>
        <td>
          <label class="checkbox">
            <input type="checkbox">
          </label>
        </td>
      </tr>
      <tr>
        <td>Melk</td>
        <td>2</td>
        <td>
          <label class="checkbox">
            <input type="checkbox">
          </label>
        </td>
      </tr>
      <tr>
        <td>Melk</td>
        <td>2</td>
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
    name: 'Shoppingslist',

    components: {}
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
