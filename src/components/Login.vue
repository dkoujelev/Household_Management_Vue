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
                <input class="input" type="email" placeholder="Email" v-model="login_info.epost">
                <span class="icon is-small">
                  <i class="fa fa-envelope"></i>
                </span>
              </p>
              <p class="control has-icon">
                <input class="input" type="password" placeholder="Password" @keyup.enter="login" v-model="login_info.passord">
                <span class="icon is-small">
                  <i class="fa fa-lock"></i>
                </span>
              </p>
              <p class="control">
                <label class="checkbox">
                  <input type="checkbox">
                  Remember me
                </label>
              </p>
              <p class="control">
                <button class="button is-primary is-medium is-fullwidth" v-on:click="login">
                  <i class="fa fa-user"></i>
                  &nbsp Login
                </button>
              </p>
              <br/>
              <router-link class="is-link" to="/Register">Registrer deg?</router-link>
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
    name: 'Login',
    data(){
      return {
        login_info: {
          epost: '',
          passord: ''
        },
        error: ''
      }
    },
    methods: {
      validateEmail(email){
        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
      },
      login(){

        this.error = '';
        if(!this.validateEmail(this.login_info.epost)){
          this.login_info.epost = "";
          this.login_info.passord = "";
          this.error = 'Ugyldig epost';
        } else{
          axios.post('http://localhost:9000/rest/login', this.login_info).then(response => {
            this.$emit('logging_in', this.login_info);
            console.log("Logging in...");

            if(response.data == null){
              this.login_info.epost = "";
              this.login_info.passord = "";
              this.error = "Ukjent brukernavn eller passord!"; //this.error="Bruker med denne eposten finnes ikke";
            } else{
              this.login_info.epost = "";
              this.login_info.passord = "";
              this.$parent.current_user = response.data;
              this.$parent.loggedIn = true;
              axios.get('http://localhost:9000/rest/kollektivForBruker/' + response.data.bruker_id).then(response => {
                let rows = response.data;
                this.$parent.current_user.kollektiv = [];
                for(let row of rows){
                  this.$parent.current_user.kollektiv.push(row.kollektiv_id);
                }
                router.push('home');
              });
            }
          }).catch(err => {
            console.log(err);
          });
        }
      }
    }
  }
</script>

<style scoped>

</style>
