<template>
  <section>
    <div class="is-ancestor">
      <h3 class="title is-3">Administrere grupper og kollektiv</h3>
      <div class="is-parent tile">
        <br>
        <div class="is-child tile box" style="background-color: azure">
          <div v-if="showJoinSection===true">
            Skriv inn navnet på kollektivet du ønsker å bli medlem av
            <br>
            <div class="field-body">
              <div class="field">
                <input  type="text" class="input" placeholder="Kollektivets navn" v-model="innmelding.kollektiv_navn">
              <button class="button" v-on:click="joinGroup(innmelding.kollektiv_navn)">
                Søk medlemskap
              </button>
            </div>
            </div>
            {{ joinResult }}
          </div>
          <br>
          <div v-if="showCreateMainGroupSection===true">
            Skriv inn navnet på kollektivet du ønsker å opprette
            <br>
            <div class="field-body">
              <div class="field">
                <input  type="text" class="input" placeholder="Kollektivets navn" v-model="oppretteMain.navn">
                <input  type="text" class="input" placeholder="Beskrivelse" v-model="oppretteMain.beskrivelse">
                <button class="button" v-on:click="createMainGroup(oppretteMain.navn)">
                  Opprett kollektiv
                </button>
              </div>
            </div>
            {{ createMainResult }}
          </div>
          <br>
          <div v-if="showCreateSubGroupSection===true">
            Skriv inn navnet på gruppen du ønsker å opprette
            <br>
            <input  type="text" class="input" placeholder="Gruppens navn" v-model="oppretteSub.navn">
            <input  type="text" class="input" placeholder="Beskrivelse" v-model="oppretteSub.beskrivelse">
            <button class="button" v-on:click="createSubGroup(oppretteSub.navn)">
              Opprett gruppe
            </button>
            {{ createSubResult }}
          </div>
        </div>
      </div>
      <div class="is-parent tile">
        <div class="is-child tile box" style="background-color: azure">
          <div v-if="showUsersGroups===true">
            Du er medlem av følgende kollektiv og grupper:
            <ul id="usersGroupsList">
              <li v-for="option in options_usersgroups"  v-bind:key="option.uid">
                {{ option.text }} {{ option.isDef }}
                <button v-if="option.canLeave===true" v-on:click="leaveSubGroup(option.uid)">Forlat gruppe</button>
              </li>
            </ul>
            {{ leaveSubResult }}
          </div>
        </div>
        <div class="is-child tile box is-7" style="background-color: azure">
          <div v-if="showInviteSection===true">
            <div v-if="showGroupSelect===true">
              Du er administrator for flere kollektiv.
              Nå administreres
              <select class="dropdown" v-model="selected_maingroup" v-on:change="selectGroup(selected_maingroup)">
                <option disabled value="">Velg kollektiv</option>
                <option v-for="option in options_maingroup" v-bind:value="option.value" v-bind:key="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <br>
            Her kan du invitere nye medlemmer til {{ selected_maingroup.navn }}

            <div class="field-body">
              <div class="field">
                <input class="input" type="email" placeholder="Email" v-model="innmelding.epost">
                <button class="button" v-on:click="doInvite">Send invitasjon</button>
              </div>
            </div>
            {{ mailResult }}
          </div>
          <br>
          <div v-if="showApproveSection===true">
            Disse ønsker å bli med i {{ selected_maingroup.navn }}. Du kan godkjenne eller avvise søknaden(e).
            <dl id="approvalsList">
              <dt v-for="item in approvals"  v-bind:key="item.tid">
                {{ item.bruker }}
              </dt>
              <dd v-for="item in approvals" v-bind:key="item.tid">
                <button v-on:click="approve(item.kollektiv, item.bruker,1)"><span class="icon"><i class="fa fa-thumbs-o-up" /></span></button>
                <button v-on:click="approve(item.kollektiv, item.bruker,0)"><span class="icon"><i class="fa fa-thumbs-o-down" /></span></button>
              </dd>
            </dl>
          </div>
          <br>
          <div v-if="showAvailableSubgroups===true">
            Dette er alle gruppene som hører inn under {{ selected_maingroup.navn }}:
            <ul id="availableSubGroupsList">
              <li v-for="option in options_subgroup"  v-bind:key="option.uid">
                {{ option.navn }}
                <button v-on:click="joinSubGroup(option.uid)">Bli med</button>
              </li>
            </ul>
            {{ joinSubResult }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

  import axios from 'axios';
  import router from '../router/index'
  import {store} from '../store'

  export default {
    name: 'Innmelding',
    data(){
        return {
            showCreateMainGroupSection: false,
            showCreateSubGroupSection: false,
            showJoinSection: false,
            showInviteSection: false,
            showGroupSelect: false,
            showSubGroupSelect: false,
            showUsersGroups: false,
            showApproveSection: false,
            showAvailableSubgroups:false,
            current_user: store.state.current_user,
            createMainResult: '',
            createSubResult: '',
            joinResult: '',
            joinSubResult: '',
            leaveSubResult: '',
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
            // options_subgroup: [
            //     { text: 'subOne', value: 'sA' },
            //     { text: 'subTwo', value: 'sB' },
            //     { text: 'subThree', value: 'sC' }
            // ],
            // options_allgroups: [
            //     { text: 'subOne', value: 'sA' },
            //     { text: 'subTwo', value: 'sB' },
            //     { text: 'subThree', value: 'sC' }
            // ],
            options_usersgroups: ''
      }
    },
    created: function() {
        this.getGroupsWhereAdminFor(this.current_user.bruker_id);
        this.getAllGroupsFor(this.current_user.bruker_id);

    },
    methods: {
    //   validateEmail(email){
    //     var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([status-zA-Z\-0-9]+\.)+[status-zA-Z]{2,}))$/;
    //     return regex.test(email);
    //   },
        selectGroup(theGroup){
            console.log('DEBUG - selectGroup(' + theGroup + ')');
            console.log('Henter hovedgruppen for kollektiv ' + theGroup.kollektiv_id);
            this.selected_maingroup_object=theGroup;
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
            // axios.get('http://localhost:9000/rest/undergrupperForKollektiv/' + theGroup.kollektiv_id).then(response => {
            //     this.options_subgroups = response.data.map((item) => {
            //         return {
            //             text: item.navn,
            //             value: item.kollektiv_id,
            //             navn: item.navn,
            //             gid: item.kollektiv_id,
            //             uid: item.undergruppe_id
            //         };
            //     });
            // });
            this.getSubGroupsFor(theGroup.kollektiv_id);
      },

      getAllGroupsFor(bruker_id){
          console.log('DEBUG - getAllGroupsFor(' + bruker_id + ')');
          console.log('Getting all groups for user ' + bruker_id);
          axios.get('http://localhost:9000/rest/kollektivForBruker/' + bruker_id).then(response => {
            this.options_maingroup_nonadmin = response.data.map((item) => {
                return {
                    text: item.navn,
                    value: item.kollektiv_id
                };
            });
            this.selected_maingroup_nonadmin = '';
          });
          axios.get('http://localhost:9000/rest/undergrupperForBruker/' + bruker_id).then(response => {
            this.options_usersgroups = response.data.map((item) => {
                //console.log('------------------------------------------------------------');
                let tmpIsDef = '';
                let tmpCanLeave = false;
                //console.log("test: " + response.data);
                //console.log("test: " + item.default_gruppe);
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
            //console.log(this.options_usersgroups);
          });
      },
      getGroupsWhereAdminFor(bruker_id){
        console.log('DEBUG - getGroupsWhereAdminFor(' + bruker_id + ')');
        console.log('Getting main group(s) where user ' + bruker_id + ' is admin');
        axios.get('http://localhost:9000/rest/kollektivForAdmin/' + bruker_id).then(response => {
            //console.log('kollektivForAdmin:');
            //console.log(response);
            this.options_maingroup = response.data.map((item) => {
                return {
                    text: item.navn,
                    value: item.kollektiv_id
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
                this.showInviteSection=true;
                this.showGroupSelect=false;
                this.showApproveSection=true;
            }else{ //User is admin of several groups. Group must be selected in order to invite.
                this.showInviteSection=true;
                this.showGroupSelect=true;
                this.showApproveSection=true;
            };

          }).catch(err => {
              console.log("getGroupsWhereAdminFor - Error:");
              console.log(err);
          });
      },



      getSubGroupsFor(kollektiv_id){
        console.log('DEBUG - getSubGroupsFor(' + kollektiv_id + ')');
        console.log('Getting subgroup(s) for group ' + kollektiv_id);
        axios.get('http://localhost:9000/rest/undergrupperForKollektiv/' + kollektiv_id).then(response => {
            this.options_subgroup = response.data.map((item) => {
                return {
                    text: item.navn,
                    value: item.kollektiv_id,
                    navn: item.navn,
                    gid: item.kollektiv_id,
                    uid: item.undergruppe_id
                };
            });
            if(this.options_subgroup.length < 2){
                this.showAvailableSubgroups=false;
            } else {
                this.showAvailableSubgroups=true;
            };
            this.selected_subgroup = '';

          }).catch(err => {
              console.log(err);
              console.log("Error!");
          });
      },


      approve(kollektiv,epost,status){
        console.log('DEBUG - approve(' + kollektiv + '.....etc)');
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
            //TODO: Hide the button / entire line / just add status green tick?
        }).catch(err => {
              console.log(err);
              console.log("Error!");
          });
      },

      createMainGroup(groupName){
          console.log('DEBUG - createMainGroup(' + groupName + ')');
          axios.post('http://localhost:9000/rest/kollektiv/' + this.current_user.bruker_id, {
                navn: this.oppretteMain.navn,
                beskrivelse: this.oppretteMain.beskrivelse
            }).then(response => {
                console.log(response);
                this.createMainResult="Du har opprettet et kollektiv!";
                //TODO: Hide the button / entire line / just add status green tick?
            }).catch(err => {
                this.createMainResult="Noe gikk galt!";
                console.log(err);
                console.log("Error!");
            });
      },

    createSubGroup(groupName){
        console.log('DEBUG - createSubGroup(' + groupName + ')');
          axios.post('http://localhost:9000/rest/undergruppe/' + this.current_user.bruker_id, {
                navn: this.oppretteSub.navn,
                beskrivelse: this.oppretteSub.beskrivelse,
                kollektiv_id: this.selected_subgroup.kollektiv_id,
                default_gruppe: 0
            }).then(response => {
                console.log(response);
                this.createSubResult="Du har opprettet en gruppe!";
                //TODO: Hide the button / entire line / just add status green tick?
            }).catch(err => {
                this.createSubResult="Noe gikk galt!";
                console.log(err);
                console.log("Error!");
            });
      },

      joinGroup(groupName){
          console.log('DEBUG - joinGroup(' + groupName + ')');
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
          console.log('DEBUG - joinSubGroup(' + subGroupID + ')');
           axios.post('http://localhost:9000/rest/undergruppeLeggTilBruker/' + subGroupID, {
                undergruppe_id: subGroupID,
                bruker_id: this.current_user.bruker_id
           }).then(response => {
               // Report back to GUI
               this.joinSubResult = 'Innmelding OK!';
           }).catch(err => {
               console.log(err);
               this.joinSubResult = 'Innmelding IKKE OK!';
           });
      },
      leaveSubGroup(subGroupID){
          console.log('DEBUG - leaveSubGroup(' + subGroupID + ')');
            axios.put('http://localhost:9000/rest/undergruppeFjernBruker/' + subGroupID, {
                undergruppe_id: subGroupID,
                bruker_id: this.current_user.bruker_id
           }).then(response => {
               // Report back to GUI
               this.leaveSubResult = 'Fjerning OK!';
           }).catch(err => {
               console.log(err);
               this.leaveSubResult = 'Fjerning IKKE OK!';
           });
      },
      doInvite(){
        console.log('DEBUG - doInvite()');
        //console.log('Doing invite stuff...');
        let tmpDate = new Date;
        axios.post('http://localhost:9000/rest/epost/', {
                 to: this.innmelding.epost,
                 from: 'test@team1.zzz',
                 subject: 'Invitasjon',
                 body: 'Du har blitt invitert til å bli med i kollektivet "' + this.selected_maingroup.navn +
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
  .input{
    width: 40em;
  }
</style>
