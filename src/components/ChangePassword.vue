<template>
  <div>
    <h1>Endring av passord</h1>
    <br/>
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

    export default {
        name: "change-password",
      data(){
        return{
          oldPassword: '',
          newPassword: '',
          newPasswordRepeat: '',
          infoToValidate: {
            email: this.$parent.current_user.epost
          },
          error: {
            oldPassword: '',
            newPasswordMissmatch: ''
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
        },
          validateInfo(){
            let isValid = true;
            clearErrors();

            if(this.newPassword != this.newPasswordRepeat){
              clearFields();
              this.error.newPasswordMissmatch = 'Passordene er ikke like';
              isValid = false;
            }

            this.infoToValidate.password = this.oldPassword;
            axios.post('http://localhost:9000/rest/password', this.infoToValidate).then(response => {
              if(!response.data.valid){
                clearFields();
                this.error.oldPassword = 'Feil passord';
                isValid = false;
              }
            });

            return isValid;
          },
          changePassword(){
            if(validateInfo()){
              let update = {newPassword: this.newPassword};
              axios.post('http://localhost:9000/rest/changePassword', update).then(response => {
                if(response.data.updated){
                  this.$emit('passwordUpdated');
                  router.push(''); // Push to my profile page
                } else{
                  this.$emit('passwordChangeFiled');
                }
              });
            }
          }
      }
    }
</script>

<style scoped>

</style>
