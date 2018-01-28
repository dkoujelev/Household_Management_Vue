<template>
    <div>
      <div class="modal" :class="{'is-active': showModal}" >
        <div class="modal-background"></div>
        <div class="modal-card">
          <section class="modal-card-body">
            <p>{{text}}</p>
          </section>
          <section class="modal-card-foot" style="justify-content: space-between;">
            <button class="button is-info" @click="confirm">Ok</button>
            <button class="button is-danger" @click="cancel">Avbryt</button>
          </section>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: "ConfirmModal",
    props: [ 'modalVisible', 'message', 'rowData' ],
    data(){
      return{
        showModal: this.modalVisible,
        text: this.message,
        d: this.rowData
      }
    },
    methods: {
      confirm(){
        if(this.d === {}) this.$emit('confirm');
        else this.$emit('confirm', this.d);
      },
      cancel(){
        this.$emit('cancel');
      }
    },
    watch: {
      modalVisible(){
        this.showModal = this.modalVisible;
      },
      message(){
        this.text = this.message;
      },
      rowData(){
        this.d = this.rowData;
      }
    }
  }
</script>

<style scoped>

</style>
