<template>
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <article class="card is-rounded">
            <div class="card-content" style="background-color: hsl(217, 71%, 53%)">
              <img src="../img/logo_full.png" height="200" width="400"/>
              <h1 class="title" style="color:white"><br/>Glemt passord</h1>
              <p class="control has-icon">
                <input class="input" type="email" placeholder="Epost" @keyup.enter="sendNewPassword" v-model="forgottenPasswordEmail">
                <span class="icon is-small">
                <i class="fa fa-envelope"></i>
                </span>
              </p>
              <p class="help" style="color:red">{{successMsg}}</p>
              <p class="control">
                <br/>
                <button class="button is-medium is-fullwidth" style="background-color: orange" @click="sendNewPassword">
                  Send nytt passord
                </button>
              </p>

              <router-link class="text" style="color:white" to="/Login">Tilbake til Login</router-link>
            </div>
          </article>
        </div>
      </div>
    </div>
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

</style>
