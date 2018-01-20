<template>
  <div>
    <h1>Endring av passord</h1>
    <br/>
    <p class="help is-danger">{{this.error.all}}</p>
    <p class="help is-danger">{{this.error.oldPassword}}</p>
    <input type="password" placeholder="Gammelt passord" v-model="oldPassword"/>
    <br/>
    <p class="help is-danger">{{this.error.newPasswordMissmatch}}</p>
    <input type="password" placeholder="Nytt passord" v-model="newPassword"/>
    <br/>
    <input type="password" placeholder="Gjenta nytt passord" v-model="newPasswordRepeat"/>
    <br>
    <button class="button" @click="changePassword">Bytt passord</button>
  </div>
</template>

<script>
  import axios from 'axios'
  import router from '../router/index'
  import {store} from '../store'

    export default {
        name: "change-password",
      data(){
        return{
          oldPassword: '',
          newPassword: '',
          newPasswordRepeat: '',
          infoToValidate: {
            email: store.state.current_user.epost
          },
          error: {
            oldPassword: '',
            newPasswordMissmatch: '',
            all: ''
          }
        }
      },
      methods: {
        clearFields(){
          this.oldPassword = '';
          this.newPassword = '';
          this.newPasswordRepeat = '';
        },
        clearErrors(){
          this.error.newPasswordMissmatch = '';
          this.error.oldPassword = '';
          this.error.all = '';
        },
        validateInfo(){
          let isValid = true;
          this.clearErrors();

          if(this.newPassword === '' || this.oldPassword === '' || this.newPasswordRepeat === ''){
            this.error.all = 'Ingen felter kan stå tomme';
            isValid = false;
          }

          if(this.newPassword !== this.newPasswordRepeat){
            this.clearFields();
            this.error.newPasswordMissmatch = 'Passordene er ikke like';
            isValid = false;
          }

          this.infoToValidate.password = this.oldPassword;
          axios.post('http://localhost:9000/rest/password', this.infoToValidate).then(response => {
            if(!response.data.valid){
              this.clearFields();
              this.error.oldPassword = 'Feil passord';
              isValid = false;
            }
          });

          return isValid;
        },
        changePassword(){
          if(this.validateInfo()){
            let update = {email: store.state.current_user.epost, newPassword: this.newPassword};
            axios.put('http://localhost:9000/rest/changePassword', update).then(response => {
              if(response.data.updated){
                alert('changed');
                this.$emit('passwordUpdated');
                router.push(''); // Push to my profile page
              } else{
                this.$emit('passwordChangeFailed');
              }
            });
          }
        }
      }
    }
</script>

<style scoped>

</style>
