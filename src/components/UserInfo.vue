<template>
  <div class="container">
    <div class="columns is-centered">
      <div class="column is-8">
        <div class="is-centered" >
          <div class="is-ancestor">

            <div v-if="notifications.length > 0" class="is-parent box" style="background-color:hsl(217, 71%, 53%)">
              <div class="is-child">
                <div class="block">
                  <p class="title">Beskjeder</p>
                  <br>
                   <div class="content">
                      <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                        <thead>
                          <th>Info</th>
                          <!-- <th></th> -->
                        </thead>
                        <tr v-for="notif in notifications"  v-bind:key="notif.id">
                          <td>{{ notif.tekst }}</td>
                          <!-- <td>
                            <button class="button is-success" @click="notifRead(notif.id)">Lest</button>
                          </td> -->
                        </tr>
                      </table>
                    </div>
                 </div>
              </div>
            </div>

            <div class="is-parent box" style="background-color:hsl(217, 71%, 53%)">
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

            <div class="is-parent box" style="background-color:hsl(217, 71%, 53%)">
            <p class="subtitle">Dine kollektiv og grupper:</p>
              <div class="is-child">
                    <div class="content1">
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
                            <button class="button is-danger " @click="leaveSubGroup(group.undergruppe_id)">Forlat</button>
                          </td>
                          <td v-if="group.canJoin">
                            <button class="button is-success " @click="joinSubGroup(group.undergruppe_id)">Bli med</button>
                          </td>
                        </tr>
                      </table>
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
    <Modal :modalVisible.sync="changingPassword" @modalClosing="changingPassword=false;" :showClose="false">
      <h2 slot="title">Endring av passord</h2>
      <ChangePassword slot="content" @change-password-canceled="changingPassword=false" @passwordUpdated="changingPassword = false"></ChangePassword>
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
          notifications: [],
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
            store.state.updateGroups = !store.state.updateGroups;
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
            store.state.updateGroups = !store.state.updateGroups;
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
        getStatusForNotifications(){
          axios.get('http://localhost:9000/rest/notifikasjon/' + store.state.current_user.bruker_id + '/ulest').then(response => {
            if(response.data){
              this.notifications=response.data;
              axios.put('http://localhost:9000/rest/notifikasjon/' + store.state.current_user.bruker_id + '/lesalle', {
                bruker_id:store.state.current_user.bruker_id
              }).then(response => {
                //this.getStatusForNotifications();
              }).catch(err => {
                console.log(err);
              });
            };
          });
        },
        notifRead(notif_id){
          axios.put('http://localhost:9000/rest/notifikasjon/' + notif_id + '/les', {
            id: notif_id
          }).then(response => {
            this.getStatusForNotifications();
          }).catch(err => {
            console.log(err);
          });
        }
      },
      created(){
        this.getData();
        this.getGroups();
        this.getStatusForNotifications();
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
