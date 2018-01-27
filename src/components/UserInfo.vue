<template>
  <div class="container">
    <div class="columns is-centered">
      <div class="column is-8">
        <div class="is-centered" >
          <div class="is-ancestor">
            <div class="is-parent box" style="background-color:hsl(217, 71%, 53%)	 ">
              <div class="is-child">
                <div class="block">
                  <p class="title">Min Side</p>
                  <br>
                  <p class="subtitle">Personalia:</p>
                  <p>Fornavn: {{user_info.first_name}}</p>
                  <p>Etternavn: {{user_info.last_name}}</p>
                  <p>E-mail: {{user_info.email}}</p>
                  <button class="button" style="background-color: orange" @click="changingPassword=true">Endre passord</button>
                 </div>
              </div>
            </div>

            <br> 
            <p class="subtitle">Dine kollektiv og grupper:</p>
            <div class="is-parent">

              <div class="is-child">
                <p class="subtitle">Du er medlem av følgende kollektiv og grupper:</p>
                <div class="content1">
                  <div>
                    <button @click="fixButtonsForGroups()">Fix buttons</button>
                    <div class="content">
                      <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                        <thead>
                          <th>Navn</th>
                          <th>Beskrivelse</th>
                          <th>Medlemmer</th>
                          <th>Handling</th>
                        </thead>
                        <tr v-for="group in groups"  v-bind:key="group.uid">
                          <td>{{ group.navn }}</td>
                          <td>{{ group.beskrivelse }}</td>
                          <td>
                            <button class="button is-link" @click="showMembers(group)">Vis medlemmer</button>
                          </td>

                          <td v-if="group.canLeave">
                            <button class="button is-danger is-hidden-mobile" @click="leaveSubGroup(group.undergruppe_id)">Forlat</button>
                            <button class="button is-danger is-small is-hidden-desktop" @click="leaveSubGroup(group.undergruppe_id)">Forlat</button>
                          </td>
                          <td v-if="group.canJoin">
                            <button class="button is-success is-hidden-mobile" @click="joinSubGroup(group.undergruppe_id)">Bli med</button>
                            <button class="button is-success is-small is-hidden-desktop" @click="joinSubGroup(group.undergruppe_id)">Bli med</button>

                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
                <br>
                <router-link class="button"  style="background-color: orange" to="/Innmelding">Administrere grupper/kollektiver</router-link>
              </div>
            </div>
            <br>
          </div>
        </div>
      </div>
    </div>
    <Modal :modalVisible.sync="showingMembers" @modalClosing="showingMembers=false;">
      <h2 slot="title">Medlemmer</h2>
      <p>{{selectedGroup.text}}</p>
      <table slot="content" class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
        <th>Epost</th>
        <th>Navn</th>
        </thead>
        <tr v-for="member in groupMembers" v-bind:key="member.bruker_id">
          <td>{{member.epost}}</td>
          <td>{{member.fornavn + " " + member.etternavn}}</td>
        </tr>
      </table>
    </Modal>
    <Modal :modalVisible.sync="changingPassword" @modalClosing="changingPassword=false;">
      <h2 slot="title">Endring av passord</h2>
      <ChangePassword slot="content" @change-password-canceled="changingPassword=false"></ChangePassword>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import {store} from '../store'
  import Modal from '@/components/Modal'
  import ChangePassword from '@/components/ChangePassword.vue'

    export default {
      name: "user-info",
      data(){
        return{
          changingPassword: false,
          user_info:{
            first_name: '',
            last_name: '',
            email: ''
          },
          groups:[],
          allGroups:[],
          selectedGroup: {text:''},
          groupMembers:[],
          showingMembers: false,
        }
      },
      components:{Modal, ChangePassword},
      methods: {
        getData(){
          axios.get('http://localhost:9000/rest/bruker/' + store.state.current_user.bruker_id).then(response => {
            let data = response.data;
            console.log(data);
            this.user_info.first_name = data.fornavn;
            this.user_info.last_name = data.etternavn;
            this.user_info.email = data.epost;
          });
        },

        getGroups(){
          console.log('Getting all of the groups available for the user...');
          let thiz = this;
          axios.get('http://localhost:9000/rest/undergrupperForBruker/' + store.state.current_user.bruker_id).then(response => {
            thiz.usersGroups = response.data;
            axios.get('http://localhost:9000/rest/tilgjengeligeundergrupperforbruker/' + store.state.current_user.bruker_id).then(response => {
              thiz.groups=response.data.map((item) => {
                let canJoin = true;
                let canLeave = false;
                thiz.usersGroups.forEach(function(grpU){
                  if(grpU.undergruppe_id==item.undergruppe_id){
                    canJoin=false;
                    canLeave=true;
                  };
                  if(grpU.default_gruppe){ 
                    canLeave=false;
                  };
                });              

                return {
                  text: item.navn,
                  value: item.kollektiv_id,
                  navn: item.navn,
                  gid: item.kollektiv_id,
                  uid: item.undergruppe_id,
                  undergruppe_id:item.undergruppe_id,
                  kollektiv_id:item.kollektiv_id,
                  beskrivelse: item.beskrivelse,
                  isDef:item.default_gruppe,
                  canJoin:canJoin,
                  canLeave:canLeave
                };
              })
            })
          })
        },

        leaveSubGroup(undergruppe_id){
           console.log('DEBUG - leaveSubGroup(' + undergruppe_id + ')');
          axios.put('http://localhost:9000/rest/undergruppeFjernBruker/' + undergruppe_id, {
            undergruppe_id: undergruppe_id,
            bruker_id: store.state.current_user.bruker_id
          }).then(response => {
            this.getGroups();
          }).catch(err => {
            console.log(err);
          });
        },
        joinSubGroup(undergruppe_id){
          console.log('DEBUG - joinSubGroup(' + undergruppe_id + ')');
          axios.post('http://localhost:9000/rest/undergruppeLeggTilBruker/' + undergruppe_id, {
            undergruppe_id: undergruppe_id,
            bruker_id: store.state.current_user.bruker_id
          }).then(response => {
            this.getGroups();
          }).catch(err => {
            console.log(err);
          });
        },
        showMembers(group){
          axios.get('http://localhost:9000/rest/medlemmerIUndergruppe/' + group.undergruppe_id).then(response => {
            this.showingMembers = true;
            this.selectedGroup = group.undergruppe_id;
            this.groupMembers = response.data;
          }).catch(err => console.log(err));
        },
      },
      created(){
        this.getData();
        this.getGroups();
      }
    }
</script>

<style scoped>

  div.content1 {
    height: 235px;
    overflow: auto;
  }
  p.title{
    color: white;
  }
  p{
    color: white;
  }

  thead th:nth-child(1){
    width: 70%;
  }
  thead th:nth-child(2){
    width: 15%;
  }
  thead th:nth-child(3){
    width: 15%;
  }

</style>
