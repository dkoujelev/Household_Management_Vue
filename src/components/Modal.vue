<template>
<div>
  <div class="modal" :class="{'is-active': showModal}" >
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title"><slot name="title"></slot></p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <slot name="content"></slot>
      </section>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    name: "modal",
    props: [ 'modalVisible' ],
    data(){
      return{
        showModal: this.modalVisible
      }
    },
    methods: {
      closeModal(){
        this.$emit('modalClosing');
      }
    },
    watch: {
      modalVisible(){
        this.showModal = this.modalVisible;
      }
    }
  }
</script>

<style scoped>
  .modal-card-head{
    background-color: lightblue;
  }
</style>
