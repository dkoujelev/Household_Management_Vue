<template>
<div class="container">
  <div class="columns is-centered">
    <div class="column is-7">
      <div class="card is-rounded is-centered">
        <div class="is-ancestor box" style="background-color: hsl(348, 100%, 61%)	;">
         <div class="is-parent">
           <div class="is-child">
             <p class="title">Liste over grupper med gjøremål</p>
             <div class="content1">
               <table class="table">
                 <thead>
                 <tr>
                   <th>Gruppenavn</th>
                   <th>Gruppe id</th>
                   <th>Status</th>
                   <th></th>
                 </tr>
                 </thead>
                 <tbody>
                 <tr v-for="row in rows">
                   <td><a @click=" selectGroup(row.undergruppe_id)"> {{row.gruppenavn}}</a></td>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>


<script>
  //import TodoList from '@/components/TODO/TodoList'
  import axios from 'axios';
  import {store} from '@/store'
  import Vue from 'vue'
  import router from '@/router/index'

    export default {
      name: 'TodoListOverview',
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
          router.push('/TodoListOverview2/' + group);
        },

        fillRows() {
          axios.get('http://localhost:9000/rest/undergrupperForBruker/' + store.state.current_user.bruker_id).then(response => {
            //alert('Alle lister til bruker hentet');
            let resRows = response.data;
            console.log(resRows);
            for (let i = 0; i < resRows.length; i++) {
              let obj = {undergruppe_id: resRows[i].undergruppe_id, gruppenavn: resRows[i].navn, gruppe: resRows[i].navn, date: resRows[0].opprettet};
              this.rows.push(obj);
            }
          }).catch(err => {
            console.log(JSON.stringify(err));
          });
        }
      }
    }

</script>

<style scoped>
  columns {
    color: black;
  }

  section.panel{

  }

  div.panel-block{

  }
  div.content1 {
    height: 450px;
    overflow: auto;
  }
</style>
