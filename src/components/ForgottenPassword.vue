<template>
  <section id="registerDiv" class="hero is-fullheight is-medium is-bold">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <article class="card is-rounded">
            <div class="card-content">
              <img src="../img/logo_full.png" height="200" width="400"/>
              <h1 class="title"><br/>Glemt passord</h1>
              <p class="control has-icon">
                <input class="input" type="email" placeholder="Epost" @keyup.enter="sendNewPassword" v-model="forgottenPasswordEmail">
                <span class="icon is-small">
                <i class="fa fa-envelope"></i>
                </span>
              </p>
              <p class="help is-success">{{successMsg}}</p>
              <p class="control">
                <br/>
                <button class="button is-link is-medium is-fullwidth" @click="sendNewPassword">
                  Send nytt passord
                </button>
              </p>

              <router-link class="is-ink" to="/Login">Tilbake til Login</router-link>
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
    name: 'ForgottenPassword',
    data(){
      return {
        forgottenPasswordEmail: '',
        successMsg: '  '
      };
    },
    methods: {
      sendNewPassword(){
        axios.post('http://localhost:9000/rest/forgottenPassword',{epost: this.forgottenPasswordEmail})
          .then(response => {
            this.successMsg = 'Nytt passord sendt på mail.';
          }).catch(err => { console.log(err); });
      },
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
