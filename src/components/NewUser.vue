<template>
  <div class="container">
    <div class="columns is-centered">
      <div class="column is-8">
        <div class="card is-rounded is-centered">
          <div class="is-ancestor box" style="background-color: hsl(217, 71%, 53%)">
            <div class="is-parent">
              <div class="is-child">
                <h1 class="tittle" style="color:white">Velkommen til Household Management!</h1>
                <br>
                <p class="subtitle" style="color:white">Du er ikke med i noe kolletiv enda</p>
              </div>
              <br>
              <div class="is-child tile" style="color:white">
                <p style="color:white">Trykk på start knappen for å opprette eller søke medlemskap i et kollektiv</p>
                <router-link class="button" style="background-color: orange" to="Innmelding">Start</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "new-user"
    }
</script>

<style scoped>

</style>
