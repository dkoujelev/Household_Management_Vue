<template>
  <div :class="{'container' : !isHome}">
    <div :class="{'is-centered' : !isHome,'columns' : !isHome}">
      <div :class="{'column is-8' : !isHome}">
        <div class="is-ancestor box" style="background-color:hsl(217, 71%, 53%)	">
          <Modal :modalVisible.sync="showShoppingList" @modalClosing="closeShoppingList">
            <h2 slot="title" style="color:white">{{list.name}}</h2>
            <ViewShoppingList :id.sync="list.id" slot="content" @closingShoppingList="closeShoppingList" @deleteShoppingList="update" @listCompleted="update"/>
          </Modal>
          <Modal :modalVisible.sync="showAddShoppingList" @modalClosing="closeAddShoppingList">
            <h2 slot="title" style="color:white">Ny handleliste</h2>
            <ShoppingList slot="content" @closingAddShoppingList="closeAddShoppingList" @addedShoppingList="update"/>
          </Modal>
          <div class="is-parent">
            <div class="is-child">
              <p class="title">Handlelister</p>
              <div :class="{'content1' : !isHome}">
                <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                  <thead>
                  <th>Handleliste</th>
                  <th>Frist</th>
                  <th></th>
                  </thead>
                  <ConfirmModal :modalVisible.sync="showConfirmModal" :rowData.sync="list" :message="confirmText" @cancel="showConfirmModal = false" @confirm="changeFavorite"/>
                  <tr v-for="row in rows">
                    <td>{{row.navn}}</td>
                    <td>{{row.frist}}</td>
                    <td>
                      <button class="button is-link" @click="selectList(row)">Se handleliste</button>
                      <button class="button is-success" v-if="!isHome && !row.favorite" @click="changeFavorite(row)">
                        <i class="fa fa-star" aria-hidden="true"></i><p>&nbsp; Legg til favoritt</p>
                      </button>
                      <button class="button is-danger" v-else-if="!isHome && row.favorite" @click="confirmation(row)">
                        <i class="fa fa-star" aria-hidden="true"></i><p>&nbsp; Fjern fra favoritt</p>
                      </button>
                    </td>
                  </tr>
                </table>
              </div>
              <br v-if="!isHome">
              <button class="button" @click="openAddShoppingList" v-if="!isHome">Ny handleliste</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import axios from 'axios';
  import router from '@/router'
  import {store} from '@/store'
  import Modal from '@/components/Modal'
  import ViewShoppingList from '@/components/ShoppingList/ViewShoppingList'
  import ShoppingList from '@/components/ShoppingList/ShoppingList'
  import ConfirmModal from '@/components/ConfirmModal'

  export default {
    name: 'Shoppinglists',
    props: [ 'value' ],
    components: { Modal, ViewShoppingList, ShoppingList, ConfirmModal },
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
          let rest = "http://localhost:9000/rest/handlelisteForUndergruppe/" + store.state.current_group.undergruppe_id;
          if(cap > 0) rest = "http://localhost:9000/rest/handlelisteForBruker/" + store.state.current_user.bruker_id;
          return axios.get(rest).then(response => {
            let resRows = response.data;
            for(let i = 0; i < resRows.length; i++){
              if(resRows[i].handling_utfort === "1970-01-01T00:00:00.000Z" || resRows[i].favoritt || resRows[i].handling_utfort === null) {
                let date = this.formateDate(resRows[i].frist);
                let obj = {handleliste_id: resRows[i].handleliste_id, navn: resRows[i].navn, frist: date, favorite: resRows[i].favoritt};
                rows.push(obj);

                if(cap > 0){
                  cap -= 1;
                }
                if(cap === 0){
                  break;
                }
              }
            }
            return rows;
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
        list: {},
        showShoppingList: false,
        showAddShoppingList: false,
        updated: false,
        showConfirmModal: false,
        confirmText: 'Vil du fjerne denne lista fra favoritter?'
      };
    },
    mounted(){
      this.update();
    },
    methods: {
      confirmation(row){
        this.list = row;
        this.showConfirmModal = true;
      },
      update(){
        this.closeAddShoppingList();
        this.closeShoppingList();
        this.updated = !this.updated;
      },
      openShoppingList(){
        this.showShoppingList = true;
      },
      closeShoppingList(){
        this.showShoppingList = false;
      },
      openAddShoppingList(){
        this.showAddShoppingList = true;
      },
      closeAddShoppingList(){
        this.showAddShoppingList = false;
      },
      changeFavorite(row){
        let obj = {favoritt: !row.favorite};
        axios.put('http://localhost:9000/rest/handleliste/' + row.handleliste_id, obj).then(response => {
          this.$emit('favoriteUpdated');
          this.showConfirmModal = false;
          this.updated = !this.updated;
        });
      },
      selectList(row){
        this.list.name =  row.navn;
        this.list.id = row.handleliste_id;
        this.openShoppingList();
      },
      formateDate(raw){
        if(raw === null) return '';
        return raw.substring(8, 10) + "." + raw.substring(5, 7) + "." + raw.substring(2,4);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }

  div.content1 {
    height: 450px;
  }
  p.title{
    color: white;
  }
  button{
    background-color: orange;
  }
  thead th:nth-child(1){
    width: 40%;
  }
  thead th:nth-child(2){
    width: 20%;
  }
  thead th:nth-child(3){
    width: 40%;
  }

</style>
