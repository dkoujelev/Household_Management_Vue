<template>
  <section>
    <div v-if="showJoinSection===true">
    Skriv inn navnet på kollektivet du ønsker å bli medlem av
        <input  type="text" placeholder="Kollektivets navn" v-model="innmelding.kollektiv_navn">
        <button v-on:click="joinGroup(innmelding.kollektiv_navn)">
        Søk medlemskap
        </button>
        {{ joinResult }}
    </div>
    
    <div v-if="showInviteSection===true">              
        <div v-if="showGroupSelect===true">
            Du er administrator for flere kollektiv.
            Nå administreres 
            <select v-model="selected_maingroup" v-on:change="selectGroup(selected_maingroup)">
                <option disabled value="">Velg kollektiv</option>
                <option v-for="option in options_maingroup" v-bind:value="option.value" v-bind:key="option.value">
                {{ option.text }}
                </option>
            </select>
        </div>
        Her kan du invitere nye medlemmer til {{ selected_maingroup_name }}
            
    <input  type="email" placeholder="Email" v-model="innmelding.epost">
    <button v-on:click="doInvite">Send invitasjon</button>
    {{ mailResult }}
    </div>

    <div v-if="showApproveSection===true">
    Disse ønsker å bli med i {{ selected_subgroup.navn }}. Du kan godkjenne eller avvise søknaden(e).
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
            showJoinSection: true,
            showInviteSection: false,
            showGroupSelect: false,
            showSubGroupSelect: false,
            showApproveSection: false,
            current_user:this.$parent.current_user,
            joinResult: '',
            mailResult: '',
            approvals: '',
            selected_maingroup_name: '',
            innmelding: {
                epost: '',
                kollektiv_id: ''
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
            selected_subgroup: '',
            options_subgroup: [
                { text: 'subOne', value: 'sA' },
                { text: 'subTwo', value: 'sB' },
                { text: 'subThree', value: 'sC' }
            ]
      }
    },
    created: function() {

    this.getGroupsFor(this.current_user.bruker_id);

    },
    // mounted: function() {
    //     console.log('xThis is printed at each reload!');
    //     console.log("xI'm placing code here to simulate status logged-in user..."); // TODO: Fix this workaround!
    //     //bruker_id=selected_bruker_id;
    //     console.log("xRight now, I'm simulating user " + bruker_id);
    //     this.getGroupsFor(bruker_id);
    // },
    methods: {
    //   validateEmail(email){
    //     var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([status-zA-Z\-0-9]+\.)+[status-zA-Z]{2,}))$/;
    //     return regex.test(email);
    //   },
      getGroupsFor(bruker_id){
        console.log('Getting main group(s) for user ' + bruker_id);
        axios.get('http://localhost:9000/rest/kollektivForAdmin/' + bruker_id).then(response => {
            this.options_maingroup = response.data.map((item) => {
                return {
                    text: item.navn,
                    value: item.kollektiv_id
                };
            });
            this.selected_maingroup = '';

            if(response.data.length==0){ //User is admin of 0 groups. Inviting not allowed!
                this.showInviteSection=false;
                this.showApproveSection=false;
            }else if(response.data.length==1){ //User is admin of exactly 1 group. That group is automatically selected.
                this.selected_maingroup = response.data[0].kollektiv_id;
                this.selected_maingroup_name = response.data[0].navn;
                this.showInviteSection=true;
                this.showGroupSelect=false;
                this.showApproveSection=true;
            }else{ //User is admin of several groups. Group must be selected in order to invite.
                this.showInviteSection=true;
                this.showGroupSelect=true;
                this.showApproveSection=true;
            };

          }).catch(err => {
              console.log(err);
              console.log("Error!");
          });
      },

      selectGroup(kollektiv_id){
            console.log('Kollektiv ' + kollektiv_id + ' valgt...');
            // getMainGroupFor(kollektiv_id){
                //this.getApprovalsForGroup(kollektiv_id);
                console.log('Getting subgroup(s) for group ' + kollektiv_id);
                //this.selected_maingroup_name = kollektiv_navn
                axios.get('http://localhost:9000/rest/hovedgruppenForKollektiv/' + kollektiv_id).then(response => {
                    this.options_subgroup = response.data.map((item) => {
                        return {
                            text: item.navn,
                            value: item.kollektiv_id
                        };
                    });
                    this.selected_subgroup = this.options_subgroup[0]; //'';
                    this.selected_subgroup.navn = this.options_subgroup[0].text;
                    //console.log("Selected: " + this.selected_subgroup.value);

                    //getApprovalsForGroup(kollektiv_id){
                        console.log("Henter alle søknader som skal godkjennes for kollektiv " + this.selected_subgroup.navn);

                        axios.get('http://localhost:9000/rest/innmeldingerForKollektiv/' + kollektiv_id).then(response => {
                        //console.log('Response: ' + response.data);
                        this.approvals = response.data.map((item) => {
                            return {
                                bruker: item.bruker_epost,
                                tid: item.dato_svar_admin,
                                kollektiv: item.kollektiv_id,
                                status_admin: item.status_admin,
                                status_bruker: item.status_bruker
                            };
                        });
                        this.selected_subgroup = '';
                        }).catch(err => {
                            console.log(err);
                            console.log("Error!");
                        });
                    //};
                }).catch(err => {
                    console.log(err);
                    console.log("Error!");
                });
            //}
      },

    //   getSubGroupsFor(kollektiv_id){
    //     console.log('Getting subgroup(s) for group ' + kollektiv_id);
    //     axios.get('http://localhost:9000/rest/undergrupperForKollektiv/' + kollektiv_id).then(response => {
    //         this.options_subgroup = response.data.map((item) => {
    //             return {
    //                 text: item.navn,
    //                 value: item.kollektiv_id
    //             };
    //         });
    //         this.selected_subgroup = '';

    //       }).catch(err => {
    //           console.log(err);
    //           console.log("Error!");
    //       });
    //   },




      approve(kollektiv,epost,status){
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

      joinGroup(groupName){
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
      doInvite(){
        //console.log('Doing invite stuff...');
        let tmpDate = new Date;
        axios.post('http://localhost:9000/rest/epost/', {
                 to: this.innmelding.epost,
                 from: 'test@team1.zzz',
                 subject: 'Invitasjon',
                 body: 'Du har blitt invitert til å bli med i kollektivet "' + this.selected_maingroup_name +
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

</style>
