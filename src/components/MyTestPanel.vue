<template>


  <section>
    <div class="is-ancestor">
      <div class="is-parent tile">
        <div class="is-child tile notification is-info">
          <div v-if="showUsersGroups===true">
            <h2 class="subtitle">Dine kollektiv og grupper</h2>
            <div class="content">
              <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                <thead>
                <th>Navn</th>
                <th>Beskrivelse</th>
                <th>Medlemmer</th>
                <th>Handling</th>
                </thead>
                <tr v-for="option in options_epic"  v-bind:key="option.uid">
                  <td>{{ option.text }} {{ option.isDef }}</td>
                  <!-- Her kan vel egentlig variabelen isDef brukes til å bedre skille mellom gruppe og kollektiv, om ønskelig...
                       F.eks ved å kjøre fet skrift eller annen (bakgrunns)farge på kollektiv or whatever. Opp til stylistene! -->
                  <td>
                    {{ option.beskrivelse }}
                  </td>
                  <td>
                    <button class="button is-link is-small is-hidden-desktop" @click="showMembers(option)">Vis medlemmer</button>
                    <button class="button is-link is-hidden-mobile" @click="showMembers(option)">Vis medlemmer</button>
                  </td>
                  <td v-if="option.canLeave===true">
                    <button class="button is-link is-hidden-mobile" v-on:click="leaveSubGroup(option.uid)">Forlat</button>
                    <button class="button is-link is-small is-hidden-desktop" v-on:click="leaveSubGroup(option.uid)">Forlat</button>
                  </td>
                  <td v-if="option.canJoin===true">
                    <button class="button is-link is-hidden-mobile" v-on:click="joinSubGroup(option.uid)">Bli med</button>
                    <button class="button is-link is-small is-hidden-desktop" v-on:click="joinSubGroup(option.uid)">Bli med</button>

                  </td>
                </tr>
              </table>
            </div>
            {{ leaveJoinSubResult }}
          </div>
        </div>
        <div class="is-child tile notification is-7 is-info">
          <div v-if="showGroupSelect===true">
            <div class="field">
              <h2 class="subtitle">Du er administrator for flere kollektiv.
                Nå administreres:
              </h2>
              <p class="is-hidden-desktop">Trykk på kolonnen under for å få opp kollektiver</p>
              <div>
                <select class="dropdown" v-model="selected_maingroup" v-on:change="makeMainGrpObj(selected_maingroup)" style="background-color: royalblue">
                  <option disabled value="">Velg kollektiv</option>
                  <option v-for="option in options_maingroup" v-bind:value="option.value" v-bind:key="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <br>
          <div v-if="showInviteSection===true">
            Her kan du invitere nye medlemmer til {{ selected_maingroup_object.navn }}
            <div class="field-body">
              <div class="field">
                <input class="input" type="email" placeholder="Email" v-model="innmelding.epost">
                <button class="button is-link is-inverted" v-on:click="doInvite">Send invitasjon</button>
              </div>
            </div>
            {{ mailResult }}
          </div>
          <br>
          <div v-if="showApproveSection===true">
            Disse ønsker å bli med i {{ selected_maingroup_object.navn }}. Du kan godkjenne eller avvise søknaden(e).
            <dl id="approvalsList">
              <dt v-for="item in approvals"  v-bind:key="item.tid">
                {{ item.bruker }}
              </dt>
              <dd v-for="item in approvals" v-bind:key="item.tid">
                <button class="button is-link" v-on:click="approve(item.kollektiv, item.bruker,1)"><span class="icon"><i class="fa fa-thumbs-o-up" /></span></button>
                <button class="button is-link" v-on:click="approve(item.kollektiv, item.bruker,0)"><span class="icon"><i class="fa fa-thumbs-o-down" /></span></button>
              </dd>
            </dl>
          </div>
          <br>
          <div v-if="showAvailableSubgroups===true">
            Dette er alle gruppene som hører inn under {{ selected_maingroup_object.navn }}:
            <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
              <thead>
              <th>Grupper</th>
              <th></th>
              </thead>
              <tr v-for="option in options_subgroup"  v-bind:key="option.uid">
                <td>{{ option.navn }}</td>
                <td> <button class="button is-link is-hidden-touch" v-on:click="joinSubGroup(option.uid)">Bli med</button>
                  <button class="button is-link is-small is-hidden-desktop" v-on:click="joinSubGroup(option.uid)">Bli med</button>
                </td>
              </tr>
            </table>
            {{ joinSubResult }}
          </div>
        </div>
      </div>
    </div>
    <Modal :modalVisible.sync="showingMembers" @modalClosing="showingMembers=false;">
      <h2 slot="title">Medlemmer</h2>
      <p>{{selectedGroup.text}}</p>
      <table slot="content" class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
        <th>Epost</th>
        <th>Navn</th>
        </thead>
        <tr v-for="member in groupMembers">
          <td>{{member.epost}}</td>
          <td>{{member.fornavn + " " + member.etternavn}}</td>
        </tr>
      </table>
    </Modal>
  </section>




</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .FixedHeightContainer
  {
    float:right;
    height: 250px;
    width:250px;
    padding:3px;
    background:#f00;
  }
  .Content
  {
    height:200px;
    overflow:auto;
    /**background:#fff;*/
  }

   .myClass {

    /** Trancparancy filter */
    opacity: 0.5;
    filter: alpha(opacity=50); /* For IE8 and earlier */


    /** Blured filter */
     -webkit-filter: blur(5px);
     -moz-filter: blur(5px);
     -o-filter: blur(5px);
     -ms-filter: blur(5px);
     filter: blur(5px);
  }





  /** syntax for picking spsific class: */
  div.tile.is-ancestor. {
    /** Trancparancy filter: */
    opacity: 1;
    filter: alpha(opacity=50); /* For IE8 and earlier */
  }

  .container {
    width: 100%;
    height: 100%;
    background-size: cover;

  }

  div.content1 {
    height:150px;
    overflow:auto;
    /**background:#fff;*/
  }

  .content
  {
    height: inherit;
    overflow:auto;
    /**background:#fff;*/
  }



</style>
