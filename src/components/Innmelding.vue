<template>
  <section class="hero is-fullheight is-medium is-bold">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <article class="card is-rounded">
            <div class="card-content">
              <img src="../img/logo_full.png" height="200" width="400"/>
              <p class="help is-danger">{{this.error}}</p>

                
                <p class="control has-icon">
                <h1>Her kan du simulere forskjellige brukere</h1>
                    <select class="control" v-model="selected_bruker_id" v-on:change="getGroupsFor(selected_bruker_id)">
                        <option v-for="option in options_bruker_id" v-bind:value="option.value">
                        {{ option.text }}
                        </option>
                    </select>
                </p>
                <hr>

              <div v-if="showJoinSection===true">
                
                <p>Skriv inn navnet på kollektivet du ønsker å bli medlem av</p>
                <p class="control has-icon">
                    <input class="input" type="text" placeholder="Kollektivets navn" v-model="innmelding.kollektiv_navn">
                    <span class="icon is-small">
                        <i class="fa fa-plus"></i>
                    </span>
                </p>
                <p class="control">
                  <button class="button is-primary is-medium is-fullwidth" v-on:click="joinGroup">
                    <i class="fa fa-user"></i>
                    &nbsp Søk medlemskap
                  </button>
                  <span>{{ joinResult }}</span>
                </p>
                <hr>
              </div>
              
              <div v-if="showInviteSection===true">              
                <p class="control has-icon">
                    <div v-if="showGroupSelect===true">
                      <span>Du er administrator for flere kollektiv.<br>Inviter til 
                        <select class="control" v-model="selected_maingroup" v-on:change="getMainGroupFor(selected_maingroup)">
                            <option disabled value="">Velg kollektiv</option>
                            <option v-for="option in options_maingroup" v-bind:value="option.value">
                            {{ option.text }}
                            </option>
                        </select>
                      </span>
                    </div>
                    <div v-else>
                      <span>Klikk på knappen for å invitere nye medlemmer til {{ selected_maingroup_name }}</span>
                      <br>
                    </div>
            <!--    <select class="control" v-model="selected_subgroup">
                        <option disabled value="">Velg gruppe</option>
                        <option v-for="option in options_subgroup" v-bind:value="option.value">
                        {{ option.text }}
                        </option>
                    </select>           -->
                </p>
                <br>
                <p class="control has-icon">
                    <input class="input" type="email" placeholder="Email" v-model="innmelding.epost">
                    <span class="icon is-small">
                        <i class="fa fa-envelope"></i>
                    </span>
                </p>
                <p class="control">
                  <button class="button is-primary is-medium is-fullwidth" v-on:click="doInvite">
                  <i class="fa fa-user"></i>
                  &nbsp Inviter nytt medlem
                  </button>
                  <span>{{ mailResult }}</span>
                </p>
              <hr>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

  import axios from 'axios';
  import router from '../router/index'

  export default {
    name: 'Innmelding',
    //props: ['bruker_id'],
    data(){
        return {
            showJoinSection: true,
            showInviteSection: false,
            showGroupSelect: false,
            showSubGroupSelect: false,
            joinResult: '',
            mailResult: '',
            selected_maingroup_name: '',
            innmelding: {
                epost: '',
                kollektiv_id: ''
            },
            selected_bruker_id: 4, //bruker_id,
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
        console.log('This is printed at each reload!');
        console.log("I'm placing code here to simulate a logged-in user..."); // TODO: Fix this workaround!
        this.bruker_id=this.selected_bruker_id;
        console.log("Right now, I'm simulating user " + this.bruker_id);
        this.getGroupsFor(this.bruker_id)
    },
    // mounted: function() {
    //     console.log('xThis is printed at each reload!');
    //     console.log("xI'm placing code here to simulate a logged-in user..."); // TODO: Fix this workaround!
    //     //bruker_id=selected_bruker_id;
    //     console.log("xRight now, I'm simulating user " + bruker_id);
    //     this.getGroupsFor(bruker_id);
    // },
    methods: {
    //   validateEmail(email){
    //     var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

            if(response.data.length==0){
                this.showInviteSection=false;
            }else if(response.data.length==1){
                this.selected_maingroup = response.data[0].kollektiv_id;
                this.selected_maingroup_name = response.data[0].navn;
                this.showInviteSection=true;
                this.showGroupSelect=false;
            }else{
                this.showInviteSection=true;
                this.showGroupSelect=true;
            };

          }).catch(err => {
              console.log(err);
              console.log("Error!");
          });
      },

      getMainGroupFor(kollektiv_id){
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
            console.log("Selected: " + this.selected_subgroup.value);
          }).catch(err => {
              console.log(err);
              console.log("Error!");
          });
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
      joinGroup(groupName){
        
      },
      doInvite(){
        console.log('Doing invite stuff...');
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
                    dato_svar_admin: 1234, // TODO: Epoch time!
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