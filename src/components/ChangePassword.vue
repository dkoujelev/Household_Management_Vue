<template>
  <div class="is-ancestor">
    <div class="is-child ">
      <div>
        <p class="text">Gammelt passord:</p>
        <p class="help is-danger">{{this.error.all}}</p>
        <p class="help is-danger">{{this.error.oldPassword}}</p>
        <input type="password" class="input"  placeholder="Gammelt passord" v-model="oldPassword"/>
      </div>
      <br>
      <div>
        <p class="text">Nytt passord:</p>
        <p class="help is-danger">{{this.error.newPasswordMissmatch}}</p>
        <input type="password" class="input" placeholder="Nytt passord" v-model="newPassword"/>
        <input type="password" class="input" placeholder="Gjenta nytt passord" v-model="newPasswordRepeat"/>
      </div>
      <br>

      <p class="help is-success">{{passwordChangeMsg}}</p>
      <div class="block">
        <div class="level">
          <div class="is-pulled-left">
            <a class="button " style="background-color: orange" @click="changePassword">Bytt passord</a>
          </div>
        <div class="is-pulled-right">
          <a class="button is-danger" @click="$emit('change-password-canceled')">Tilbake</a>
        </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
  import axios from 'axios'
  import router from '../router/index'
  import {store} from '../store'

    export default {
        name: "ChangePassword",
      data(){
        return{
          passwordChangeMsg: '',
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
          this.passwordChangeMsg = '';
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
                this.passwordChangeMsg = 'Passord endret.';
                this.$emit('passwordUpdated');
                this.clearErrors();
                this.clearFields();
                //router.push(''); // Push to my profile page
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
