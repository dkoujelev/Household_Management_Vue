<template>
  <div class="tile is-ancestor" id="ancestor">
    <div class="tile is-vertical is-8">
      <div class="tile">
        <div class="tile is-parent is-vertical">
          <article class="tile is-child notification is-primary">
            <div class="container is-fluid">
              <div class="field">
                <label class="label">Navn å vareliste</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Text input" value="">
                </div>
              </div>


              <div class="field" v-for="row in rows">
                <!--<label class="label">Skriv inn varer</label> -->

                <div class="field-body">
                  <input class="input" name="" v-model="row.name" type="text" placeholder="Text input" value="">
                <button class="button is-danger" id="decrementButton" @click="decrement(row)">
                <i class="fa fa-minus" id="minus" aria-hidden="true"></i>
                </button>
                  <button class="button is-info" @click="row.antall++" id="incrementButton">
                  <i class="fa fa-plus" id="plus" aria-hidden="true" ></i>
                    <div>
                      {{row.antall}}
                    </div>
                  </button>
                </div>

              </div>

              <div class="field is-grouped">
                <div class="control">

                  <button class="button is-danger" @click="addRow">Add</button>
                  <button class="button is-danger" @click="removeRow(row)">Remove</button>

                </div>
              </div>
              <div class="field is-grouped">
                <div class="control">
                  <button class="button is-link" @click="sendData">Submit</button>
                </div>
                <p class="control">
                  <a class="button is-danger">
                    Delete post
                  </a>
                </p>
              </div>
            </div>


          </article>
        </div>
      </div>
    </div>
  </div>


</template>




<script>
  //metode som inneholder et objekt som returnern data

  import axios from 'axios';

  export default {

    name: "ShoppingList",
    data() {
      return {
        rows: [
          {name: "", antall: 1},
        ]
      }
    },
    methods: {
      addRow: function () {
        this.rows.push({name: "", antall: 1});
      },
      removeRow: function (row) {
        //console.log(row);
        this.rows.splice(row, 1);
      },
      decrement(row){
        if(row.antall > 1){
          row.antall--;
        }
      },

      sendData(){
        let shoppinglist =
        {
          navn: this.name,
          opprettet: new Date(),
          frist: null,
          beskrivelse: "",
          undergruppe_id: 1, //Må leses inn fra komponent (foreldre som inneholder)
          handling_utfort: null,
          varer: this.row
        };

        axios.post('http://localhost:9000/rest/handleliste', shoppinglist, response => {
          alert('handleliste lagt inn!');
        });

      }

    }
  }


</script>




<style scoped>
#minus{
  color: black;
}

#plus{
  color: black;
  }


</style>
