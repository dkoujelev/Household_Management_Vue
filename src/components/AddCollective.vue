<template>
  <div class="box">
    <h1 class="title">Opprett nytt kollektiv</h1>
      <div class="field">
        <label for="name" class="label">Navn</label>
        <div class="control">
          <input type="text" class="input" v-model="collective.navn" id="name" placeholder="Navn på nytt kollektiv">
        </div>
      </div>
    <div class="field">
      <label for="desc" class="label">Beskrivelse</label>
      <div class="control">
        <textarea type="text" class="textarea" v-model="collective.beskrivelse" id="desc" placeholder="Beskrivelse" />
      </div>
    </div>
    <div class="field">
        <a href="" class="button is-primary" @click.prevent="addCollective">Opprett kollektiv</a>
        <a href="" class="button" @click.prevent="$emit('cancel')">Avbryt</a>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';

  export default {
      name: 'AddCollective',
      data(){
          return {
              collectives:[],
              collective: {},
          };
      },
      created(){
          axios.get('http://localhost:9000/rest/kollektiv').then(response => {
              this.collectives = response.data;
          }).catch(err => {
              console.log(err);
          });
    },
    methods: {
      addCollective(){
        axios.post('http://localhost:9000/rest/kollektiv/' + window.current_user.bruker_id,this.collective).then(response => {
            let newCollective = {};
            newCollective.navn = this.collective.navn;
            newCollective.beskrivelse = this.collective.beskrivelse;
            newCollective.kollektiv_id = response.data.insertId;
            this.$emit('added-collective', newCollective);
        }).catch(err => {
            console.log(err);
        });
      }
    }
  }
</script>
<style></style>
