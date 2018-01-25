<template>

</template>

<script>
    export default {
      name: "todo-list-overview3",

      data() {
        return {
          rows: [],
          modalVisible: false,
        };
      },
      mounted() {
        this.fillRows();
      },


      methods: {
        fillRows() {
              axios.get('http://localhost:9000/rest/gjoremalsliste/:id' + store.state.current_user.bruker_id).then(response => {
                //alert('Alle lister til bruker hentet');
                let resRows = response.data;
                console.log(resRows);
                for (let i = 0; i < resRows.length; i++) {
                  let obj = {navn: resRows[i].navn, beskrivelse: resRows[i].beskrivelse,  start: resRows[i].start, frist: resRows[0].frist};
                  this.rows.push(obj);
                }
              }).catch(err => {
                console.log(JSON.stringify(err));
          });
        },
      }
    }

</script>

<style scoped>

</style>
