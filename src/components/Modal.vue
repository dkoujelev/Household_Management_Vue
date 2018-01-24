<template>
<div>
  <div class="modal" v-bind:class="{'is-active': showModal}" >
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <h1 class="modal-card-title">{{title}}</h1>
        <button class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <slot></slot>
      </section>
    </div>
    <button class="modal-close" @click="showModal = false"></button>
  </div>
</div>
</template>

<script>
  export default {
    name: "modal",
    props: [ 'modalVisible', 'header' ],
    computed:{
      showModal: function () {
        return this.modalVisible === true;
      },
      title: function () {
        return this.header;
      }
    },
    data(){
      return{
        modalVisible: false
      }
    }
  }
</script>

<style scoped>

</style>
