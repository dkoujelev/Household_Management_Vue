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
                <input class="input" type="email" placeholder="Email" v-model="innmelding.epost">
                <span class="icon is-small">
                  <i class="fa fa-envelope"></i>
                </span>
              </p>
              <p class="control has-icon">
                <select v-model="selected">
                    <option v-for="option in options" v-bind:value="option.value">
                    {{ option.text }}
                    </option>
                </select>
              </p>
              <p class="control">
                <button class="button is-primary is-medium is-fullwidth" v-on:click="submit">
                  <i class="fa fa-user"></i>
                  &nbsp Bli medlem
                </button>
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
//   let selected = {text:'Velg en gruppe', value:''};
//   let options= [
//       { text: 'One', value: 'A' },
//       { text: 'Two', value: 'B' },
//       { text: 'Three', value: 'C' }
//     ];
//import Vue from 'vue';
export { //Vue({
  //el: '...',
  data: {
    selected: 'A',
    options: [
      { text: 'One', value: 'A' },
      { text: 'Two', value: 'B' },
      { text: 'Three', value: 'C' }
    ]
  }
}


  import axios from 'axios';
  import router from '../router/index'

  export default {
    name: 'Innmelding',
    data(){
      return {
        innmelding: {
          epost: 'ukjent@ukjent.x',
          kollektiv_id: '1'
        },
        error: ''
      }
    },
    methods: {
    //   validateEmail(email){
    //     var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //     return regex.test(email);
    //   },
      submit(){
        this.error = '';
        // if(!this.validateEmail(this.login_info.epost)){
        //   this.login_info.epost = "";
        //   this.login_info.passord = "";
        //   this.error = 'Ugyldig epost';
        // } else{
          axios.post('http://localhost:9000/rest/innmelding', this.login_info).then(response => {
            this.$emit('logging_in', this.login_info);
            console.log("Logging in...");

            if(response.data == null){
              this.login_info.epost = "";
              this.error = "Ukjent brukernavn eller passord!"; //this.error="Bruker med denne eposten finnes ikke";
            } else if(!response.data.passwordMatch){
              //this.login_info.epost = "";
              this.error = "Ukjent brukernavn eller passord!"; //this.error = "Feil passord";
            } else{
              this.login_info.epost = "";
              router.push('home');
            }
          }).catch(err => {
            console.log(err);
          });
        //}
      }
    }
  }
</script>

<style scoped>

</style>