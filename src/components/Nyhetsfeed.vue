<template>
  <div :class="{'container' : !isHome}">
    <div :class="{'is-centered' : !isHome,'columns' : !isHome}">
      <div :class="{'column is-8' : !isHome}">
          <div class="is-ancestor box"   style="background-color:  hsl(217, 71%, 53%);">
            <Modal :modalVisible.sync="showModal" @modalClosing="closeModal" v-if="!isHome">
              <h2 slot="title" style="color:white">Lag nyhet</h2>
              <Addnews slot="content" @addedNews="update" @closeAddNews="closeModal" />
            </Modal>
            <ConfirmModal :modalVisible.sync="showConfirm" :rowData.sync="selectedNews" :message="confirmText" @cancel="showConfirm = false" @confirm="deleteNews" v-if="!isHome"/>
            <div class="is-parent">
              <div class="is-child">
                <p class="title">Nyheter</p>
                <div :class="{'content1' : !isHome}">
                  <article class="message is-white" v-for="row in rows">
                    <div class="message-header">
                      <h2>{{row.overskrift}}</h2>
                      <a v-if="row.knapper && !isHome" @click="showConfirmDialog(row)">Slett</a>
                    </div>
                    <div class="message-body">
                      <h4>{{row.nyhet}}</h4>

                      <div class="block">
                        <nav class="level">
                          <!-- left side -->
                          <div class="level-left">
                            <p class="has-text-grey">{{row.hvem.fornavn}} {{row.hvem.etternavn}}</p>
                          </div>
                          <!-- right side -->
                          <div class="level-right">
                            <div class="level-item">
                              <p class="has-text-grey">{{row.nar}}</p>
                            </div>
                          </div>
                        </nav>
                      </div>
                    </div>
                  </article>
                </div>
                <br>
                <div class="child" v-if="!isHome">
                  <button class="button" @click="openModal">Lag nyhet</button>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import {store} from '@/store'
  import Addnews from '@/components/Addnews'
  import Modal from '@/components/Modal'
  import ConfirmModal from '@/components/ConfirmModal'

  export default {
    name: 'Nyhetsfeed',
    props: [ 'value' ],
    components: { Modal, Addnews, ConfirmModal },
    computed: {
      len: function () {
        return (isNaN(Number.parseInt(this.value)) ? -1 : this.value);
      },
      isHome: function () {
        return ((isNaN(Number.parseInt(this.value)) ? -1 : this.value) !== -1);
      }
    },
    asyncComputed:{
      rows: {
        get(){
          let rows = [];

          let cap = this.len;
          let rest = "http://localhost:9000/rest/melding/motta/kollektiv/" + store.state.current_group.kollektiv_id;
          if(cap > 0) rest = "http://localhost:9000/rest/melding/motta/brukerAlle/" + store.state.current_user.bruker_id;

          return axios.get(rest).then(response => {
            let resRows = response.data;
            let brukere;
            return axios.get('http://localhost:9000/rest/bruker').then(res => {
              brukere = res.data;
              for (let i = 0; i < resRows.length; i++) {
                let date = this.formateDate(resRows[i].sendt);
                let obj = {
                  hvem: '',
                  melding_id: resRows[i].melding_id,
                  overskrift: resRows[i].overskrift,
                  nyhet: resRows[i].tekst,
                  nar: date,
                  knapper: (resRows[i].skrevet_av_bruker === store.state.current_user.bruker_id)
                };
                for(let j = 0; j < brukere.length; j++){
                  if(brukere[j].bruker_id === resRows[i].skrevet_av_bruker){
                    obj.hvem = brukere[j];
                    break;
                  }
                }
                rows.push(obj);
                if (cap > 0) {
                  cap -= 1;
                }
                if (cap === 0) {
                  break;
                }
              }
              return rows;
            }).catch(err => {
              console.log(err);
            });
          }).catch(err => {
            console.log(err);
          });
        },
        watch(){
          this.updated;
        }
      }
    },
    data(){
      return {
        updated: false,
        showModal: false,

        showConfirm: false,
        selectedNews: {},
        confirmText: 'Er du sikker på at du vil slette denne nyheten?'
      };
    },
    mounted(){
      this.update();
    },
    methods: {
      showConfirmDialog(row){
        this.selectedNews = row;
        this.showConfirm = true;
      },
      openModal(){
        this.showModal = true;
      },
      closeModal(){
        this.showModal = false;
      },
      update(){
        this.updated = !this.updated;
        this.closeModal();
      },
      formateDate(raw){
        return raw.substring(8, 10) + " " + raw.substring(5, 7) + " " + raw.substring(0,4)
          + " kl: " + raw.substring(11, 16);
      },
      deleteNews(row){
        let id = row.melding_id;
        axios.delete('http://localhost:9000/rest/melding/' + id).then(response => {
          this.updated = !this.updated;
          this.showConfirm = false;
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


  div.content1 {
    height: 450px;
    overflow: auto;
  }
  div.is-ancestor {
    /**background-color: #ffffff;

    opacity: 1;
    filter: alpha(opacity=60); /* For IE8 and earlier */
  }

  p.title{
    color: white;
  }
  button.button{
  background-color: orange;
  }


</style>
