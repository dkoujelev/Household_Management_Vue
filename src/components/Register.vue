<template>
  <section id="registerDiv" >

    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <article class="card is-rounded">
            <div class="card-content" style="background-color: hsl(217, 71%, 53%)">
              <img src="../img/logo_full.png" height="200" width="400"/>
              <h1 class="title" style="color:white;"><br/>Registrer deg</h1>
              <p class="help is-danger">{{this.errorMessages.email}}</p>
              <p class="control has-icon">
                <input class="input" type="email" placeholder="Epost" v-model="user.epost">
                <span class="icon is-small">
                <i class="fa fa-envelope"></i>
              </span>
              </p>
              <p class="help is-danger">{{this.errorMessages.fornavn}}</p>
              <p class="control has-icon">
                <input class="input" type="text" placeholder="Fornavn" v-model="user.fornavn">
                <span class="icon is-small">
                <i class="fa fa-user"></i>
              </span>
              </p>
              <p class="help is-danger">{{this.errorMessages.etternavn}}</p>
              <p class="control has-icon">
                <input class="input" type="text" placeholder="Etternavn" v-model="user.etternavn">
                <span class="icon is-small">
                <i class="fa fa-user"></i>
              </span>
              </p>
              <p class="help is-danger">{{this.errorMessages.password}}</p>
              <p class="control has-icon">
                <input class="input" type="password" placeholder="Passord" v-model="passord">
                <span class="icon is-small">
                <i class="fa fa-lock"></i>
              </span>
              </p>
              <p class="help is-danger">{{this.errorMessages.passwordMissmatch}}</p>
              <p class="control has-icon">
                <input class="input" type="password" placeholder="Gjenta passord" @keyup.enter="passMatch" v-model="gjentaPassord">
                <span class="icon is-small">
                <i class="fa fa-lock"></i>
              </span>
              </p>
              <p class="control">
                <br/>
                <button class="button  is-medium is-fullwidth" style="background-color: orange" v-on:click="passMatch">
                  <i class="fa fa-user"></i>
                  &nbsp Lag bruker
                </button>
              </p>

              <router-link class="text" style="color:white" to="/Login">Login. Jeg har allerde en bruker.</router-link>
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
    name: 'RegisterUser',
    data(){
      return {
        user: {
          epost: '',
          fornavn: '',
          etternavn: '',
          hashed_passord: ''
        },
        passord: '',
        gjentaPassord: '',
        errorMessages:{
          email: '',
          fornavn: '',
          etternavn: '',
          password: '',
          passwordMissmatch: ''
        }
      };
    },
    methods: {
      emailUsed(epost, callback){
        axios.get('http://localhost:9000/rest/brukerepost/' + epost).then(response => {
          callback(response.data.exists);
        }).catch(err => {
          console.log(err);
        });
      },
      validateEmail(email){
        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
      },
      validateName(name) {
        var regex = /^[a-zA-ZæøåÆØÅ_\- ]+$/;
        return regex.test(name);
      },
      validatePassword(password) {
        //var regex = /^[a-åA-Å_\- ]+$/;
        //return regex.test(password);
        return password.length >= 8 && password.length <= 12;
      },
      registerUser(){
        this.user.hashed_passord = this.passord;
        axios.post('http://localhost:9000/rest/bruker', this.user).then(response => {
          this.$emit('added-user', this.user);
          console.log("User added");
          router.push('login');
        }).catch(err => {
          console.log(err);
        });
      },
      passMatch(){
        //Reset errors
        this.errorMessages.email = "";
        this.errorMessages.fornavn = "";
        this.errorMessages.etternavn = "";
        this.errorMessages.password = "";
        this.errorMessages.passwordMissmatch = "";

        let noErrors = true;
        //Check for errors
        if(!this.validateEmail(this.user.epost)){
          this.user.epost = '';
          this.errorMessages.email = "Ugyldig epost";
          noErrors = false;
        }
        this.emailUsed(this.user.epost, exists=>{
          if(exists) {
            console.log("im in here")
            this.user.epost = '';
            this.errorMessages.email = "Epost allerede i bruk";
            noErrors = false;
          }
        });

        if(!this.validateName(this.user.fornavn)) {
          this.user.fornavn = '';
          this.errorMessages.fornavn = "Ugyldig fornavn";
          noErrors = false;
        }

        if(!this.validateName(this.user.etternavn)) {
          this.user.etternavn = '';
          this.errorMessages.etternavn = "Ugyldig etternavn";
          noErrors = false;
        }

        if(!this.validatePassword(this.passord)) {
          this.user.passord = '';
          this.gjentaPassord = '';
          //this.errorMessages.password = "Ugyldig passord";
          this.errorMessages.password = "Ugyldig passord. Passord må bestå av 8 - 12 tegn";
          noErrors = false;
        }

        if(this.passord !== this.gjentaPassord){
          this.errorMessages.passwordMissmatch = 'Passord matcher ikke';
          this.passord = '';
          this.gjentaPassord = '';
          noErrors = false;
        }

        if(noErrors){
          console.log("Registrert");
          this.registerUser();
        }

        noErrors = true;
      }
    }
  }
</script>

<style scoped>
  .title{
    color: black;
  }
  .error{
    color: red;
  }
</style>
