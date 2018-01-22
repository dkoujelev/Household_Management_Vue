<template>
  <div class="is-ancestor">

    <div class="is-parent tile  box" style="background-color: azure">
      <div class="is-parent tile is is-4 is-block-desktop-only">

    </div>
      <div class="is-child tile is is-vertical">
        <h1>Endring av passord</h1>
        <div>
          <p class="help is-danger">{{this.error.all}}</p>
          <br>
          <input type="password" class="input"  placeholder="Gammelt passord" v-model="oldPassword"/>
        </div>
        <div>
          <p class="help is-danger">{{this.error.oldPassword}}</p>
          <br>
          <input type="password" class="input" placeholder="Nytt passord" v-model="newPassword"/>
          <br/>
          <input type="password" class="input" placeholder="Gjenta nytt passord" v-model="newPasswordRepeat"/>
        </div>
        <div>
          <p class="help is-danger">{{this.error.newPasswordMissmatch}}</p>
          <br/>
          <button class="button is-primary" @click="changePassword">Bytt passord</button>
        </div>
    </div>
      <div class="is-parent tile is is-4 is-block-desktop-only">

      </div>
    </div>
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
