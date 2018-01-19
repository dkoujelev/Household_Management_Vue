<template>
  <div>
    <p>Velkoment til vår nettside!</p>
    <p>Du er ikke med i noe kolletiv enda</p>
    <br/>
    <p>Hvis kollektivet ditt allerede er opprettet kan du søke om å bli med i det her:</p>
    <router-link class="button" to="Innmelding">Finn kollektiv</router-link>
    <br/>
    <p>Hvis du ønsker å opprette ett nytt kollektiv kan du gjøre det her:</p>
    <router-link class="button" to="">Opprett kollektiv</router-link> //To create new collectiv page when ready
  </div>
</template>

<script>
    export default {
        name: "new-user"
    }
</script>

<style scoped>

</style>
