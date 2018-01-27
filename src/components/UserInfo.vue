<template>
  <div class="container">
    <div class="columns is-centered">
      <div class="column is-8">
        <div class="card is-rounded is-centered">
          <div class="is-ancestor box" style="background-color:hsl(217, 71%, 53%)	 ">
            <div class="is-parent">
              <div class="is-child">
                <div class="block">
                  <p class="title">Min Side</p>
                  <p class="subtitle">Personalia:</p>
                  <p>Fornavn: {{user_info.first_name}}</p>
                  <p>Etternavn: {{user_info.last_name}}</p>
                  <p>E-mail: {{user_info.email}}</p>
                  <button class="button" style="background-color: orange" @click="changingPassword=true">Endre passord</button>
                 </div>
              </div>
            </div>
            <br>
            <p class="subtitle">Du er medlem av følgende kollektiv og grupper:</p>
            <div class="is-parent">
              <div class="is-child">
                <div class="content1">
                  <div>
                    <div class="content">
                      <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                        <thead>
                        <th>Oversikt</th>
                        <th></th>
                        <th></th>
                        </thead>
                        <tr v-for="group in groups">
                          <td>{{ group.navn }}</td>
                          <td>
                            <button class="button is-link is-small is-hidden-desktop" @click="showMembers(group)">Vis medlemmer</button>
                            <button class="button is-link is-hidden-mobile" @click="showMembers(group)">Vis medlemmer</button>
                          </td>
                          <td>
                            <button class="button is-danger is-hidden-mobile" v-if="!group.default_gruppe" @click=" leaveSubGroup(group.undergruppe_id)">Forlat gruppe</button>
                            <button class="button is-danger is-small is-hidden-desktop" v-if="!group.default_gruppe" @click="leaveSubGroup(group.undergruppe_id)">Forlat gruppe</button>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br>
            <div class="is-parent">
              <div class="is-child">
                <router-link class="button"  style="background-color: orange" to="/Innmelding">Administrere grupper/kollektiver</router-link>
              </div>
            </div>
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
        <tr v-for="member in groupMembers">
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
          let bruker_id = store.state.current_user.bruker_id;
          axios.get('http://localhost:9000/rest/undergrupperForBruker/' + bruker_id).then(response => {
            this.groups = response.data;

          });
          this.showUsersGroups=true;
        },
        leaveSubGroup(group){
           console.log('DEBUG - leaveSubGroup(' + group.undergruppe_id + ')');
          axios.put('http://localhost:9000/rest/undergruppeFjernBruker/' + group.undergruppe_id, {
            undergruppe_id: group.undergruppe_id,
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
