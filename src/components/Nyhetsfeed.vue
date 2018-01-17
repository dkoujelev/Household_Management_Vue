<template>
  <div class="'columns">

    <table class="table is-striped is-bordered is-fullwidth is-hoverable">
      <thead>
      <tr>
        <th>Bruker</th>
        <th>Nyhet</th>
        <th>Når</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>DMITRI</td>
        <td>dMITRI KOMMER HJEM </td>
        <td>Om 2 dager</td>
      </tr>
      <tr>
        <td>KHA</td>
        <td>LIKER TRENING</td>
        <td>FOR 5 DAGER</td>
      </tr>
      <tr>
        <td>EIRIK</td>
        <td>Vaske doen</td>
        <td>Om 7 dager</td>
      </tr>
      </tbody>
    </table>
    <router-link class="button" to="/Addnews">Lag nyhet</router-link>


  </div>
</template>

<script>

  import Addnews from './Addnews';

  export default {
    name: 'Nyhetsfeed',

    components: {Addnews},

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
