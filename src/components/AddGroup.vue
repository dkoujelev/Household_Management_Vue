<template>
  <div class="box">
    <h1 class="title">Opprett gruppe i {{current_group.kollektiv_navn}}</h1>
    <div class="field">
      <label for="name" class="label">Navn</label>
      <div class="control">
        <input type="text" class="input" v-model="group.navn" id="name" placeholder="Navn på ny gruppe">
      </div>
    </div>
    <div class="field">
      <label for="desc" class="label">Beskrivelse</label>
      <div class="control">
        <textarea type="text" class="textarea" v-model="group.beskrivelse" id="desc" placeholder="Beskrivelse" />
      </div>
    </div>
    <div class="field">
      <a href="" class="button is-primary" @click.prevent="addGroup">Opprett gruppe</a>
      <a href="" class="button" @click.prevent="$emit('cancel')">Avbryt</a>
    </div>
  </div>
</template>
<script>

  import axios from 'axios';

  export default {
      props: ['current_user','current_group'],
      data(){
          return {
            group:{default_gruppe:false},
            groups: []
          };
      },
      created(){
        axios.get('http://localhost:9000/rest/undergruppe').then(response => {
            this.groups = response.data;
        }).catch(err => {
            console.log(err);
        });
      },
      methods:{
          addGroup(){
            let newGroup = {};
            newGroup.navn = this.group.navn;
            newGroup.beskrivelse = this.group.beskrivelse;
            newGroup.kollektiv_id = this.current_group.kollektiv_id;
            newGroup.default_gruppe = false;

            axios.post('http://localhost:9000/rest/undergruppe/' + this.current_user.bruker_id, newGroup).then(response => {
              newGroup.undergruppe_id = response.insertId;
              this.$emit('added-group', newGroup);
            }).catch(err => {
              console.log(err);
            });
          }
      },
  };
</script>
<style></style>
