<template>
  <div class="'columns ">

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
    <router-link class="button" to="/Addnews">Lag gjøremål</router-link>

    <div class="modal" v-bind:class="{'is-active': modalVisible}" >
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Modal title</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <!-- Content ... -->
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success">Save changes</button>
          <button class="button">Cancel</button>
        </footer>
      </div>
      <button class="modal-close" @click="modalVisible = false"></button>
    </div>

    <p>
      <button class="button" id="showModal" @click="modalVisible = true">Show</button>
    </p>

  </div>
</template>

<script>
  export default {
    name: 'Task',
    data(){
      return{
        modalVisible: false
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
