<template>
  <section class="hero is-fullheight is-medium is-primary is-bold">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <article class="card is-rounded">
            <div class="card-content">
              <img src="../img/logo_full.png" height="200" width="400"/>
              <p class="control has-icon">
                <input class="input" type="email" placeholder="Email">
                <span class="icon is-small">
                  <i class="fa fa-envelope"></i>
                </span>
              </p>
              <p class="control has-icon">
                <input class="input" type="password" placeholder="Password">
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
                <button class="button is-primary is-medium is-fullwidth">
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
    export default {
        name: "login"
    }
</script>

<style scoped>

</style>
