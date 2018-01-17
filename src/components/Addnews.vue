<template>
  <div>
    <div class="field">
      <label class="label">Tittel</label>
      <input type="text" class="input" placeholder="Skriv tittel her">
    </div>
    <div class="block">
      <div class="field">
        <label class="label">Nyhet</label>
          <p class="control">
            <textarea class="textarea" placeholder="Skriv nyhet her"></textarea>
          </p>


        <div class="block">
          <nav class="level">
            <!-- left side -->
            <div class="level-left">
              <p class="level-item"><a class="button is-primary">Post nyhet</a></p>
            </div>

            <!-- right side -->
            <div class="level-right">
              <div class="level-item">
                <p class="level-item"><a class="button is-danger">Avbryt</a></p>
              </div>
            </div>
          </nav>
        </div>





      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'Addnews',
    components: {}

  }
</script>

<style scoped>

</style>
