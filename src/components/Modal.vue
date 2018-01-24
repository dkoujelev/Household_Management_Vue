<template>
<div>
  <div class="modal" v-bind:class="{'is-active': showModal}" >
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <h1 class="modal-card-title">{{title}}</h1>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <slot></slot>
      </section>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    name: "modal",
    props: [ 'modalVisible', 'header' ],
    data(){
      return{
        showModal: this.modalVisible,
        title: this.header
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
      },
      header(){
        this.title = this.header;
      }
    }
  }
</script>

<style scoped>

</style>
