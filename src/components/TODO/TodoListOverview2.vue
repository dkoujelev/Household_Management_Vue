<template>
  <div class="column">
  <div class="columns is-one-quarter">
    <div class="column is-half">
  <div class="table is-striped">
    <section class="panel">
      <p class="panel-heading"> {{gruppe}}
        Gjøremålliste
      </p>
      <div class="panel-block">
        <table class="table">
          <thead>
          <tr>
            <th>tittel</th>
            <th>Gruppenavn</th>
            <th>Status</th>
            <th>Dato</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="row in rows">
            <td @click="selectGroup(group)"> {{row.tittel}},{{row.dato}} </td>
            <td>Kommer</td>
            <td class="is-icon">
              <a href="#">
                <i class="fa fa-twitter"></i>
              </a>
            </td>
            <td class="is-icon">
              <a href="#">
                <i class="fa fa-instagram"></i>
              </a>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
  </div>
  </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import {store} from '@/store'


    export default {
      name: "todo-list-overview2",
      data() {
        return {
          rows: []
        };
      },
      mounted() {
        this.fillRows()
      },

// [{}] <- betyr at array inneholder et objekt

      methods: {

        selectGroup(group) {
          router.push('TodoListOverview2/' + user.bruker_id);
        },

        fillRows() {
          axios.get('http://localhost:9000/rest/gjoremalslisterUndergruppe/1').then(response => {
            //alert('Alle lister til bruker hentet');
            let resRows = response.data;
            console.log(resRows);
            for (let i = 0; i < resRows.length; i++) {
              let obj = {tittel: resRows[i].navn, gruppe: resRows[i].navn, dato: resRows[0].opprettet};
              this.rows.push(obj);
            }
          }).catch(err => {
            console.log(JSON.stringify(err));
          });

          settGruppe(g)
          {
            axios.get('http://localhost:9000/http://localhost:9000/rest/undergrupperForBruker/9').then(response => {
              //alert('Alle lister til bruker hentet');
              let resRows = response.data;
              console.log(g);
              let obj = {gruppe: g.navn};
              this.rows.push(obj);

            }).catch(err => {
              console.log(JSON.stringify(err));
            });

          }
        }

      }
    }

</script>

<style scoped>

div.panel-block{

}


</style>
