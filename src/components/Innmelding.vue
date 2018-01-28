<template>
  <div class="container">
    <div class="columns is-centered">
      <div class="column is-8">
        <div class="is-rounded is-centered" style="background-color: transparent">
          <div class="is-ancestor">
            <!-- Modal start -->
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
            <div class="is-parent box" style="background-color:hsl(217, 71%, 53%)	 ">
              <div class="is-child">
                <p class="title"style="color:white">Opprett grupper og kollektiv</p>
                <div v-if="showJoinSection===true">
                  <p style="color: red">{{ joinResult }}</p>
                  <div class="field">
                    <div class="field-body">
                      <p class="subtitle" style="color:white">Søk medlemskap i et kollektiv: </p>
                      <input  type="text" class="input" style="width: 160px" placeholder="Kollektivets navn" v-model="innmelding.kollektiv_navn">
                        <button class="button" style="background-color:orange" v-on:click="joinGroup(innmelding.kollektiv_navn)">
                          Søk medlemskap
                        </button>
                    </div>
                  </div>
                </div>
                <br>
                <div v-if="showCreateMainGroupSection===true">
                  <p style="color: red"> {{ createMainResult }}</p>
                  <div class="field">
                    <div class="field-body">

                      <p class="subtitle " style="color:white">Opprett et kollektiv:</p>
                      <input  type="text" class="input" style="width: 20%" placeholder="Kollektivets navn" v-model="oppretteMain.navn">
                      <input  type="text" class="input" style="width: 40%" placeholder="Beskrivelse" v-model="oppretteMain.beskrivelse">
                      <button class="button" style="background-color:orange;" v-on:click="createMainGroup(oppretteMain.navn)">
                        Opprett kollektiv
                      </button>
                    </div>
                  </div>
                </div>
                <br>
              </div>
            </div>

            <div class="is-parent box" style="background-color:hsl(217, 71%, 53%)">
              <div class="is-child">
                <!-- Table starting here -->
                <div v-if="showUsersGroups===true">
                  <h2 class="subtitle" style="color: white">Dine kollektiv og grupper</h2>
                  <div class="content1">
                    <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                      <thead>
                      <th>Navn</th>
                      <th>Beskrivelse</th>
                      <th>Medlemmer</th>
                      <th>Handling</th>
                      </thead>
                      <tr v-for="option in options_epic"  v-bind:key="option.uid">
                        <td>{{ option.text }} {{ option.isDef }}</td>
                        <!-- Her kan vel egentlig variabelen isDef brukes til å bedre skille mellom gruppe og kollektiv, om ønskelig...
                             F.eks ved å kjøre fet skrift eller annen (bakgrunns)farge på kollektiv or whatever. Opp til stylistene! -->
                        <td>
                          {{ option.beskrivelse }}
                        </td>
                        <td>

                          <button class="button is-link " @click="showMembers(option)">Vis medlemmer</button>
                        </td>
                        <td v-if="option.canLeave===true">
                          <button class="button is-danger " v-on:click="leaveSubGroup(option.uid)">Forlat</button>

                        </td>
                        <td v-if="option.canJoin===true">
                          <button class="button is-link " v-on:click="joinSubGroup(option.uid)">Bli med</button>


                        </td>
                      </tr>
                    </table>
                  </div>
                  {{ leaveJoinSubResult }}
                </div>
              </div>
            </div>


            <div class="is-parent box" style="background-color:hsl(217, 71%, 53%)" >
              <div class="is-child">
                <div v-if="showGroupSelect===true">
                  <p class="title" style="color:white">Administrer grupper og kollektiv</p>
                  <div class="field">
                    <div class="field-body">
                      <p class="help" style="color:white; font-size: large">Velg kollektiv:</p>
                      <select class="dropdown" v-model="selected_maingroup" v-on:change="makeMainGrpObj(selected_maingroup)" style="background-color: white">
                        <option disabled value="">Velg kollektiv</option>
                        <option v-for="option in options_maingroup" v-bind:value="option.value" v-bind:key="option.value">
                          {{ option.text }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <br>
                <div v-if="showCreateSubGroupSection===true">
                  {{ createSubResult }}
                  <div class="field">
                    <div class="field-body">
                      <p class="subtitle"  style="color:white">Opprett en gruppe i {{ selected_maingroup_object.navn }}:</p>
                      <input  type="text" class="input" style="width: 20%" placeholder="Navn" v-model="oppretteSub.navn">
                      <input  type="text" class="input" style="width: 40%" placeholder="Beskrivelse" v-model="oppretteSub.beskrivelse">
                      <button class="button"  style="background-color:orange" v-on:click="createSubGroup(oppretteSub.navn)">
                        Opprett gruppe
                      </button>
                    </div>
                  </div>
                </div>
                <br>
                <div v-if="showInviteSection===true">
                  {{ mailResult }}
                  <div class="field">
                    <div class="field-body">
                      <p class="subtitle"  style="color:white">Inviter nye medlemmer til {{ selected_maingroup_object.navn }}:</p>
                      <input class="input" type="email" style="width: 320px" placeholder="Email" v-model="innmelding.epost">
                      <button class="button" style="background-color:orange" v-on:click="doInvite">Send invitasjon</button>
                    </div>
                  </div>

                </div>
                <br>
                <div v-if="showApproveSection===true">
                  <p class="text" style="color:white">Disse ønsker å bli med i {{ selected_maingroup_object.navn }}</p>
                  <div class="content1">
                    <table class="table is-bordered is-fullwidth">
                      <thead>
                      <th>Hvem</th>
                      <th>Velg</th>
                      </thead>
                      <tr v-for="item in approvals"  v-bind:key="item.tid">
                        <td> {{ item.bruker }}</td>
                        <td>
                          <button class="button is-link" v-on:click="approve(item.kollektiv, item.bruker,1)"><span class="icon"><i class="fa fa-thumbs-o-up" /></span></button>
                          <button class="button is-link" v-on:click="approve(item.kollektiv, item.bruker,0)"><span class="icon"><i class="fa fa-thumbs-o-down" /></span></button>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
                <br>
                <div v-if="showAvailableSubgroups===true">
                  Dette er alle gruppene som hører inn under {{ selected_maingroup_object.navn }}:
                  <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                    <thead>
                    <th>Grupper</th>
                    <th></th>
                    </thead>
                    <tr v-for="option in options_subgroup"  v-bind:key="option.uid">
                      <td>{{ option.navn }}</td>
                      <td> <button class="button is-link is-hidden-touch" v-on:click="joinSubGroup(option.uid)">Bli med</button>
                        <button class="button is-link is-small is-hidden-desktop" v-on:click="joinSubGroup(option.uid)">Bli med</button>
                      </td>
                    </tr>
                  </table>
                  {{ leaveJoinSubResult }}
                </div>
              </div>
            </div>

            {{ mailResult }}
          </div>
          <br>
          <div v-if="showApproveSection===true">
            Disse ønsker å bli med i {{ selected_maingroup_object.navn }}. Du kan godkjenne eller avvise søknaden(e).
            <dl id="approvalsList">
              <dt v-for="item in approvals"  v-bind:key="item.tid">
                {{ item.bruker }}
              </dt>
              <dd v-for="item in approvals" v-bind:key="item.tid">
                <button class="button is-link" v-on:click="approve(item.kollektiv, item.bruker,1)"><span class="icon"><i class="fa fa-thumbs-o-up" /></span></button>
                <button class="button is-link" v-on:click="approve(item.kollektiv, item.bruker,0)"><span class="icon"><i class="fa fa-thumbs-o-down" /></span></button>
              </dd>
            </dl>
          </div>
          <br>
          <div v-if="showAvailableSubgroups===true">
            Dette er alle gruppene som hører inn under {{ selected_maingroup_object.navn }}:
              <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                  <thead>
                  <th>Grupper</th>
                  <th></th>
                  </thead>
                  <tr v-for="option in options_subgroup"  v-bind:key="option.uid">
                  <td>{{ option.navn }}</td>
                  <td> <button class="button is-link is-hidden-touch" v-on:click="joinSubGroup(option.uid)">Bli med</button>
                    <button class="button is-link is-small is-hidden-desktop" v-on:click="joinSubGroup(option.uid)">Bli med</button>
                  </td>
                  </tr>
              </table>
            {{ leaveJoinSubResult }}

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import axios from 'axios';
  import router from '../router/index'
  import {store} from '../store'
  import Modal from '@/components/Modal'

  export default {
    name: 'Innmelding',
    components:{Modal},
    data(){
        return {

            // Disse tre brukes for å vise medlemmer i gruppe
            // Når man trykker "Vis medlemmer" i gruppelista.
            // -Oddbjørn
            selectedGroup: {text:''},
            groupMembers:[],
            showingMembers: false,

            updated: false,

            showCreateMainGroupSection: true,
            showCreateSubGroupSection: false,
            showJoinSection: true,
            showInviteSection: false,
            showGroupSelect: false,
            showUsersGroups: true,
            showApproveSection: false,
            showAvailableSubgroups:false,
            current_user: store.state.current_user,
            createMainResult: '',
            createSubResult: '',
            joinResult: '',
            leaveJoinSubResult:'',
            mailResult: '',
            approvals: '',
            selected_maingroup_object: '',
            innmelding: {
                epost: '',
                kollektiv_id: ''
            },
            oppretteMain:{
                navn: '',
                beskrivelse: ''
            },
            oppretteSub:{
                navn: '',
                beskrivelse: ''
            },
            options_bruker_id: [
                { text: 'One', value: '1' },
                { text: 'Two', value: '2' },
                { text: 'Three', value: '3' },
                { text: 'Four', value: '4' },
                { text: 'Five', value: '5' }
            ],
            error: '',
            selected_maingroup: '',
            options_maingroup: [
                { text: 'One', value: 'A' },
                { text: 'Two', value: 'B' },
                { text: 'Three', value: 'C' }
            ],
            selected_maingroup_nonadmin: '',
            options_maingroup_nonadmin: [
                { text: 'One', value: 'A' },
                { text: 'Two', value: 'B' },
                { text: 'Three', value: 'C' }
            ],
            selected_subgroup: '',
            options_subgroup: '',
            options_epic:[],
            options_usersgroups: ''
      }
    },
    mounted() {
      this.load();
    },
    render(){
      this.load();
    },
    methods: {
      load(){
        this.options_maingroup = [];
        this.options_subgroup = '';
        this.options_epic = [];
        this.options_usersgroups = '';
        this.getGroupsWhereAdminFor(this.current_user.bruker_id);
        this.getAllGroupsFor(this.current_user.bruker_id);
      },
        showMembers(gruppe){
          axios.get('http://localhost:9000/rest/medlemmerIUndergruppe/' + gruppe.uid).then(response => {
            this.showingMembers = true;
            this.selectedGroup = gruppe;
            this.groupMembers = response.data;
          }).catch(err => console.log(err));
        },
        //   validateEmail(email){
        //     var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([status-zA-Z\-0-9]+\.)+[status-zA-Z]{2,}))$/;
        //     return regex.test(email);
        //   },

        makeMainGrpObj(kid){
            axios.get('http://localhost:9000/rest/kollektiv/' + kid).then(response => {
                console.log(response);
                let tmpObj = {
                    kollektiv_id: response.data.kollektiv_id,
                    navn: response.data.navn,
                    beskrivelse: response.data.beskrivelse
                };

                // let tmpObj = response.data.map((item) => {
                //     return {
                //         text: item.navn,
                //         value: item.kollektiv_id,
                //         navn: item.navn,
                //         gid: item.kollektiv_id,
                //         uid: item.undergruppe_id
                //     };
                    this.selectGroup(tmpObj);
                });
            // });
        },

        selectGroup(theGroup){
           // console.log('DEBUG - selectGroup(' + theGroup + ')');
            console.log('Henter hovedgruppen for kollektiv ' + theGroup.kollektiv_id);
            this.selected_maingroup_object=theGroup;
            this.showInviteSection=true;
            axios.get('http://localhost:9000/rest/hovedgruppenForKollektiv/' + theGroup.kollektiv_id).then(response => {
                this.options_defaultgroup = response.data.map((item) => {
                    return {
                        text: item.navn,
                        value: item.kollektiv_id,
                        navn: item.navn,
                        gid: item.kollektiv_id,
                        uid: item.undergruppe_id
                    };
                });
                this.selected_subgroup = this.options_defaultgroup[0];
                this.showCreateSubGroupSection=true;

                console.log("Henter alle søknader som skal godkjennes for kollektiv " + this.selected_subgroup.navn);
                axios.get('http://localhost:9000/rest/innmeldingerForKollektiv/' + theGroup.kollektiv_id).then(response => {
                    this.approvals = response.data.map((item) => {
                        return {
                            bruker: item.bruker_epost,
                            tid: item.dato_svar_admin,
                            kollektiv: item.kollektiv_id,
                            status_admin: item.status_admin,
                            status_bruker: item.status_bruker
                        };
                    });
                    if(this.approvals.length==0){
                        this.showApproveSection=false;
                    }else{
                      this.showApproveSection=true;
                    }
                    //this.selected_subgroup = '';
                }).catch(err => {
                    console.log("selectGroup - Error");
                    console.log(err);
                });
            }).catch(err => {
                console.log("selectGroup - Error");
                console.log(err);
            });
            this.getSubGroupsFor(theGroup.kollektiv_id);
        },

        getAllGroupsFor(bruker_id){
            //console.log('DEBUG - getAllGroupsFor(' + bruker_id + ')');
            console.log('Getting all groups for user ' + bruker_id);
            axios.get('http://localhost:9000/rest/kollektivForBruker/' + bruker_id).then(response => {
              this.options_maingroup_nonadmin = response.data.map((item) => {
                this.getSubGroupsFor(item.kollektiv_id);
              });
              this.selected_maingroup_nonadmin = '';
            });
            axios.get('http://localhost:9000/rest/undergrupperForBruker/' + bruker_id).then(response => {
              this.options_usersgroups = response.data.map((item) => {
                  let tmpIsDef = '';
                  let tmpCanLeave = false;

                  if(item.default_gruppe==1){
                      tmpIsDef='(Kollektiv)';
                      tmpCanLeave=false;
                  } else {
                      tmpCanLeave=true;
                  };
                  return {
                      text: item.navn,
                      value: item.undergruppe_id,
                      uid: item.undergruppe_id,
                      kid: item.kollektiv_id,
                      isDef: tmpIsDef,
                      canLeave:tmpCanLeave
                  };
              });
            });
            this.showUsersGroups=true;
        },

        getGroupsWhereAdminFor(bruker_id){
            //console.log('DEBUG - getGroupsWhereAdminFor(' + bruker_id + ')');
            console.log('Getting main group(s) where user ' + bruker_id + ' is admin');
            axios.get('http://localhost:9000/rest/kollektivForAdmin/' + bruker_id).then(response => {
                //console.log('kollektivForAdmin:');
                //console.log(response);
                this.options_maingroup = response.data.map((item) => {
                    return {
                        text: item.navn,
                        value: item.kollektiv_id,
                        navn: item.navn,
                        kid: item.kollektiv_id
                    };
                });
                //this.selected_maingroup = '';

                if(response.data.length==0){ //User is admin of 0 groups. Inviting not allowed!
                    this.showInviteSection=false;
                    this.showApproveSection=false;
                }else if(response.data.length==1){ //User is admin of exactly 1 group. That group is automatically selected.
                    console.log('User is admin of one:');
                    this.selected_maingroup_object = {
                        navn: response.data[0].navn,
                        kollektiv_id: response.data[0].kollektiv_id,
                        undergruppe_id: 0
                    };
                  console.log('This one: ' + this.selected_maingroup_object);
                  this.selectGroup(this.selected_maingroup_object);
                  //this.selected_maingroup = response.data[0].kollektiv_id;
                  //this.selected_maingroup_name = response.data[0].navn;
                  this.showCreateSubGroupSection=true;
                  this.showInviteSection=true;
                  this.showGroupSelect=false;
                    //this.showApproveSection=true;
                }else{ //User is admin of several groups. Group must be selected in order to invite.
                  // this.showInviteSection=true;
                    this.showGroupSelect=true;
                    //this.showApproveSection=true;
                };

              }).catch(err => {
                  console.log("getGroupsWhereAdminFor - Error:");
                  console.log(err);
              });
          },

      getSubGroupsFor(kollektiv_id){
       // console.log('DEBUG - getSubGroupsFor(' + kollektiv_id + ')');
        console.log('Getting subgroup(s) for group ' + kollektiv_id);
        let tmpOptions = [];
        axios.get('http://localhost:9000/rest/undergrupperForKollektiv/' + kollektiv_id).then(response => {
            this.tmpOptions = response.data.map((item) => {
                return {
                    text: item.navn,
                    value: item.kollektiv_id,
                    navn: item.navn,
                    gid: item.kollektiv_id,
                    uid: item.undergruppe_id,
                    beskrivelse: item.beskrivelse,
                    isDef:item.default_gruppe,
                    canJoin: true,
                    canLeave:false
                };
            });

            // You've just gotten all of the subs for ONE main group.
            // These must be merged with the EPIC list...
                for(let i=0;i<this.tmpOptions.length;i++){
                  let thisGroupIsAlreadyInEpic = false
                  for(let j=0;j<this.options_epic.length;j++){
                    if(this.tmpOptions[i].uid == this.options_epic[j].uid){
                      thisGroupIsAlreadyInEpic=true;
                    };
                  };
                  if(!thisGroupIsAlreadyInEpic){
                    // Add the sub group to Epic, but first determine if the user is a member or not.
                    this.tmpOptions[i].canJoin=true;
                    for(let k=0;k<this.options_usersgroups.length;k++){
                      if(this.tmpOptions[i].uid == this.options_usersgroups[k].uid){
                          this.tmpOptions[i].canJoin=false;
                          if(!this.tmpOptions[i].isDef){
                            this.tmpOptions[i].canLeave=true;
                          };
                          break;
                        };
                      };
                     if(this.tmpOptions[i].isDef){
                            this.tmpOptions[i].isDef='(Kollektiv)';
                          }else{
                            this.tmpOptions[i].isDef='(Gruppe)';
                          };
                    this.options_epic.push(this.tmpOptions[i]);
                  };
                };

            this.showAvailableSubgroups=(this.options_epic.length < 2);
            this.selected_subgroup = '';
          }).catch(err => {
              console.log(err);
              console.log("Error!");
          });
      },


      approve(kollektiv,epost,status){
       // console.log('DEBUG - approve(' + kollektiv + '.....etc)');
          //console.log("epost=" + epost + '   ' + "kollektiv=" + kollektiv + '   ' + "status=" + status);
          let tmpDate = new Date;
        axios.put('http://localhost:9000/rest/innmelding', {
            kollektiv_id: kollektiv,
            bruker_epost: epost,
            status_admin:status,
            //status_bruker: '',
            dato_svar_admin: tmpDate.getTime(),  // This is set server side
            //dato_svar_bruker: '',
            aktiv: false,
            //notat_admin: '',
            //notat_bruker: ''
        }).then(response => {
            console.log(response);
            store.state.updateGroups = !store.state.updateGroups;
            this.updated = !this.updated;
            this.load();
            //TODO: Hide the button / entire line / just add status green tick?
        }).catch(err => {
              console.log(err);
              console.log("Error!");
          });
      },

      createMainGroup(groupName){
         // console.log('DEBUG - createMainGroup(' + groupName + ')');
          axios.post('http://localhost:9000/rest/kollektiv/' + this.current_user.bruker_id, {
                navn: this.oppretteMain.navn,
                beskrivelse: this.oppretteMain.beskrivelse
            }).then(response => {
                console.log(response);
                this.createMainResult="Du har opprettet et kollektiv!";
                store.state.updateGroups = !store.state.updateGroups;
                this.updated = !this.updated;
                this.load();
                //TODO: Hide the button / entire line / just add status green tick?
            }).catch(err => {
                this.createMainResult="Noe gikk galt!";
                console.log(err);
                console.log("Error!");
            });
      },

    createSubGroup(groupName){
      // console.log('DEBUG - createSubGroup(' + groupName + ')');
      axios.post('http://localhost:9000/rest/undergruppe/' + this.current_user.bruker_id, {
        navn: this.oppretteSub.navn,
        beskrivelse: this.oppretteSub.beskrivelse,
        kollektiv_id: this.selected_maingroup_object.kollektiv_id,
        default_gruppe: 0
      }).then(response => {
        console.log(response);
        this.createSubResult="Du har opprettet en gruppe!";
        store.state.updateGroups = !store.state.updateGroups;
        this.updated = !this.updated;
        this.load();
      //TODO: Hide the button / entire line / just add status green tick?
    }).catch(err => {
        this.createSubResult="Noe gikk galt!";
      console.log(err);
      console.log("Error!");
    });
    },

      joinGroup(groupName){
         // console.log('DEBUG - joinGroup(' + groupName + ')');
         axios.get('http://localhost:9000/rest/kollektivMedNavn/' + groupName).then(response => {
             //console.log(groupName + '=' + response.data);
                    if(response.data != null){
                        this.kollektiv_id=response.data.kollektiv_id;
                        //console.log("Klar for innmelding!");
                        let tmpDate=new Date;
                        axios.post('http://localhost:9000/rest/innmelding', {
                            kollektiv_id: this.kollektiv_id,
                            bruker_epost:  store.state.current_user.epost,
                            status_admin:2,
                            status_bruker: '1',
                            dato_svar_admin: null,
                            dato_svar_bruker: tmpDate.getTime(),
                            aktiv: true,
                            notat_admin: null,
                            notat_bruker: null
                        }).then(response => {
                            console.log(response);
                            this.joinResult="Du har søkt om medlemskap!";
                            store.state.updateGroups = !store.state.updateGroups;
                            this.updated = !this.updated;
                            this.load();
                            //TODO: Hide the button / entire line / just add status green tick?
                        }).catch(err => {
                            this.joinResult="Noe gikk galt!";
                            console.log(err);
                            console.log("Error!");
                        });
                    }else{
                        //No hit!
                        this.joinResult="Ukjent kollektiv!";
                    };
         })
      },
      joinSubGroup(subGroupID){
         // console.log('DEBUG - joinSubGroup(' + subGroupID + ')');
           axios.post('http://localhost:9000/rest/undergruppeLeggTilBruker/' + subGroupID, {
                undergruppe_id: subGroupID,
                bruker_id: this.current_user.bruker_id
           }).then(response => {
               // Report back to GUI
               this.leaveJoinSubResult = 'Innmelding OK!';
                store.state.updateGroups = !store.state.updateGroups;
                 this.updated = !this.updated;
                 this.load();
           }).catch(err => {
               console.log(err);
               this.leaveJoinSubResult = 'Innmelding IKKE OK!';
           });
      },
      leaveSubGroup(subGroupID){
         // console.log('DEBUG - leaveSubGroup(' + subGroupID + ')');
            axios.put('http://localhost:9000/rest/undergruppeFjernBruker/' + subGroupID, {
                undergruppe_id: subGroupID,
                bruker_id: this.current_user.bruker_id
           }).then(response => {
               // Report back to GUI
               this.leaveJoinSubResult = 'Fjerning OK!';
                store.state.updateGroups = !store.state.updateGroups;
                this.updated = !this.updated;
                this.load();
           }).catch(err => {
               console.log(err);
               this.leaveJoinSubResult = 'Fjerning IKKE OK!';
           });
      },
      doInvite(){
       // console.log('DEBUG - doInvite()');
        //console.log('Doing invite stuff...');
        let tmpDate = new Date;
        axios.post('http://localhost:9000/rest/epost/', {
                 to: this.innmelding.epost,
                 from: 'test@team1.zzz',
                 subject: 'Invitasjon',
                 body: 'Du har blitt invitert til å bli med i kollektivet "' + this.selected_maingroup_object.navn +
                 ". Trykk på denne lenken for å godta invitasjonen: http://localhost:9000/rest/invitasjon/" + this.selected_maingroup + "?bruker_epost=" + this.innmelding.epost + "&bruker_svar=jatakk"
             }).then(response => {
                axios.post('http://localhost:9000/rest/innmelding/', {
                    kollektiv_id: this.selected_maingroup,
                    bruker_epost: this.innmelding.epost,
                    status_admin: 1,
                    dato_svar_admin: tmpDate.getTime,
                    aktiv: true
                }).then(response => {
                    this.mailResult = "Invitasjon er sendt!";
                    this.innmelding.epost='';
                    console.log('GUI got: ' + response.data); // response.data is seemingly empty, but how can we check?
                    this.sendResult = 'Epost sendt!';
                }).catch(err => {
                    console.log(err); // We assume that this suffers from the same issue(s) as response.data
                    this.sendResult = 'Epost IKKE sendt!';
                });
            }).catch(err => {
                console.log(err); // We assume that this suffers from the same issue(s) as response.data
                this.sendResult = 'Epost IKKE sendt!';
            });
      }
    }
  }
</script>

<style scoped>
  div.content1 {
    height:250px;
    overflow:auto;
    /**background:#fff;*/
  }

</style>
