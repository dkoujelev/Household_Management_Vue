<template>
  <div class="box">
    <h1 class="title">Opprett nytt Kostnadsregister</h1>
    <div class="field">
      <label for="name" class="label">Navn</label>
      <div class="control">
        <input type="text" class="input" v-model="costRegister.navn" id="name" placeholder="Navn på nytt kostnadsregister">
      </div>
    </div>

    <div class="field">
      <a href="" class="button is-primary" @click.prevent="addCostRegister">Opprett kostnadsregister</a>
      <a href="" class="button" @click.prevent="$emit('cancel')">Avbryt</a>
    </div>
  </div>
</template>
<script>

  import axios from 'axios';

  export default {
    name: 'AddCostRegister',
    data(){
      return {
        costRegisters: [],
        costRegister: {},
      };
    },
    created(){
      /*axios.get('http://localhost:9000/rest/kollektiv').then(response => {
        this.costRegisters = response.data;
      }).catch(err => {
          console.log(err);
      });*/
    },
    methods: {
      addCostRegister(){
          this.costRegister.undergruppe_id = this.$parent.$data.current_group.undergruppe_id;

        axios.post('http://localhost:9000/rest/regnskap',this.costRegister).then(response => {
          let newCostRegister = {};
        newCostRegister.navn = this.costRegister.navn;
        newCostRegister.beskrivelse = this.costRegister.beskrivelse;
        newCostRegister.kollektiv_id = response.data.insertId;
        this.$emit('added-costRegister', newCostRegister);
      }).catch(err => {
          console.log(err);
      });
      }
    }
  }
</script>
<style></style>
