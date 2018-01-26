<template>
  <div :class="{'container' : !isHome}">
    <div :class="{'is-centered' : !isHome,'columns' : !isHome}">
      <div :class="{'column is-7' : !isHome}">
        <div class="card is-rounded is-centered">
          <div class="is-ancestor box" style="background-color:hsl(171, 100%, 41%)">
            <Modal :modalVisible.sync="showShoppingList" @modalClosing="closeShoppingList">
              <h2 slot="title">{{list.name}}</h2>
              <ViewShoppingList :id.sync="list.id" slot="content" @closingShoppingList="closeShoppingList" @deleteShoppingList="update" @listCompleted="update"/>
            </Modal>
            <Modal :modalVisible.sync="showAddShoppingList" @modalClosing="closeAddShoppingList">
              <h2 slot="title">Lag ny handleliste</h2>
              <ShoppingList slot="content" @closingAddShoppingList="closeAddShoppingList" @addedShoppingList="update"/>
            </Modal>
            <div class="is-parent">
              <div class="is-child">
                <div class="title">Handlelister</div>
                <div :class="{'content1' : !isHome}">
                  <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                    <thead>
                    <th>Handleliste</th>
                    <th>Frist</th>
                    <th></th>
                    </thead>
                    <tr v-for="row in rows">
                      <td>{{row.navn}}</td>
                      <td>{{row.frist}}</td>
                      <td>
                        <button class="button is-warning" @click="selectList(row)">Se handleliste</button>
                        <button class="button" :class="{ 'is-success': !row.favorite, 'is-danger': row.favorite}" v-if="!isHome" @click="addFavorite(row)">
                          <i class="fa fa-star" aria-hidden="true"></i><p v-if="row.favorite">&nbsp; Fjern fra favoritt</p><p v-else>&nbsp; Legg til favoritt</p>
                        </button>
                      </td>
                    </tr>
                  </table>
                </div>
                <br v-if="len === -1">
                <button class="button is-link" @click="openAddShoppingList" v-if="!isHome">Lag handleliste</button>
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
  import router from '@/router'
  import {store} from '@/store'
  import Modal from '@/components/Modal'
  import ViewShoppingList from '@/components/ShoppingList/ViewShoppingList'
  import ShoppingList from '@/components/ShoppingList/ShoppingList'

  export default {
    name: 'Shoppinglists',
    props: [ 'value' ],
    components: { Modal, ViewShoppingList, ShoppingList },
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
              if(resRows[i].handling_utfort === "1970-01-01T00:00:00.000Z") {
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
      };
    },
    mounted(){
      this.update();
    },
    methods: {
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
      addFavorite(row){
        let obj = {favoritt: !row.favorite};
        axios.put('http://localhost:9000/rest/handleliste/' + row.handleliste_id, obj).then(response => {
          this.$emit('favoriteUpdated');
          this.updated = !this.updated;
        });
      },
      selectList(row){
        this.list.name =  row.navn;
        this.list.id = row.handleliste_id;
        this.openShoppingList();
      },
      formateDate(raw){
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

</style>
