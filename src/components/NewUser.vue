<template>
  <div class="is-ancestor">
    <div class="is-parent tile is-vertical box" style="background-color: azure">
      <div class="is-child tile is is-vertical">
        <h1 class="tittle is-3">Velkommen til vår nettside!</h1>
        <p class="content is-medium">Du er ikke med i noe kolletiv enda</p>
      </div>
      <div class="is-child tile">
        <p>Hvis kollektivet ditt allerede er opprettet kan du søke om å bli med i det her:</p>
        <router-link class="button is-dark" to="Innmelding">Finn kollektiv</router-link>
      </div>
      <div class="is-child tile">
        <p>Hvis kollektivet ditt allerede er opprettet kan du søke om å bli med i det her:</p>
        <router-link class="button is-dark" to="">Opprett kollektiv</router-link> <!--To create new collectiv page when ready-->
      </div>
    </div>
    <div></div>
  </div>




</template>

<script>
    export default {
        name: "new-user"
    }
</script>

<style scoped>

</style>
