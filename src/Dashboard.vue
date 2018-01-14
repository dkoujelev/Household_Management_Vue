<template>
  <div>
    <div class="navbar is-success">
      <div class="navbar-brand">
        <router-link class="navbar-item" to="/">
          <img src="./img/logo_medium.png" alt="image not found" width="175"/>
        </router-link>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <router-link class="navbar-item" to="/">Hjem</router-link>
          <router-link class="navbar-item" to="/HelloWorld">Hello World!</router-link>
          <router-link class="navbar-item" to="/Task">Gjøremål</router-link>
          <router-link class="navbar-item" to="/Login">Login</router-link>
          <router-link class="navbar-item" to="/Register">Registrer deg</router-link>
        </div>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'dashboard'
}
</script>

<style>
  .navbar {
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
</style>
