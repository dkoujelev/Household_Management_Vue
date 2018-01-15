<template>

  <div class="app">
    <div class="container is-widescreen">
      <div class="notification">
        This container is <strong>fullwidth</strong> <em>until</em> the <code>$widescreen</code> breakpoint.
        <table class="table is-full-">
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
            <td>Om 2 dager</td>
            <td>
              <label class="checkbox">
                <input type="checkbox">
              </label>
            </td>
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
  </div>

  <AddGroup :current_user="this.$parent.current_user" :current_collective="{kollektiv_id: 1, navn: 'Testkollektiv 1'}" @added-group="addedGroup"></AddGroup>

</template>

<script>

  import AddGroup from './AddGroup';

  export default {
    name: 'Test',
    components: {AddGroup},
    data () {
      return {
      };
    },
    methods:{
      addedGroup(e){
            alert(JSON.stringify(e));
        }
    }
  }
</script>

<style>
</style>
