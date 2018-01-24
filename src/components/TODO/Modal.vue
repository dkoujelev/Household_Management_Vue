<template>
  <div class="modal">
  <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-content">

        <slot></slot>

      </div>
      <button class="modal-close is-large" aria-label="close"></button>
    </div>
    <button class="modal-close" @click="$emit('close')"> </button>
  </div>
</template>

<script>
    export default {
        name: "modal",

      methods: {
        data() {
          return {
            showModal: false,
          };
        },

      }
    }
</script>

<style scoped>

</style>
