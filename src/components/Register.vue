<template>
  <section class="hero is-fullheight is-medium is-primary is-bold">

    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <article class="card is-rounded">
            <div class="card-content">
              <img src="../img/logo_full.png" height="200" width="400"/>
              <h1 class="title"><span style="color: aqua"><br/>Registrer deg</span></h1>
              <p class="control has-icon">
                <input class="input" type="email" placeholder="Email">
                <span class="icon is-small">
                <i class="fa fa-envelope"></i>
              </span>
              </p>
              <p class="control has-icon">
                <input class="input" type="text" placeholder="Fornavn">
                <span class="icon is-small">
                <i class="fa fa-user"></i>
              </span>
              </p>
              <p class="control has-icon">
                <input class="input" type="text" placeholder="Etternavn">
                <span class="icon is-small">
                <i class="fa fa-user"></i>
              </span>
              </p>
              <p class="control has-icon">
                <input class="input" type="password" placeholder="Passord">
                <span class="icon is-small">
                <i class="fa fa-lock"></i>
              </span>
              </p>
              <p class="control has-icon">
                <input class="input" type="password" placeholder="Gjenta passord">
                <span class="icon is-small">
                <i class="fa fa-lock"></i>
              </span>
              </p>
              <p class="control">
                <br/>
                <button class="button is-primary is-medium is-fullwidth">
                  <i class="fa fa-user"></i>
                  &nbsp Lag bruker
                </button>
              </p>
            </div>
          </article>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
    export default {
        name: "register"
    }
</script>

<style scoped>

</style>
