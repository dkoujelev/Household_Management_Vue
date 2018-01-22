<template>
    <section>
        Her kan du administrere grupper.
        Dette innebærer:
            Se dine undergrupper
            Opprette nye undergrupper
            Slette undergrupper
            Legge til andre i en undergruppe

<br>
        <div v-if="showMainGroupSelect===true">
            Du er med i flere kollektiv, administrer grupper for
            <select v-model="selected_maingroup" v-on:change="selectMainGroup(selected_maingroup)">
                <option disabled value="">Velg kollektiv</option>
                <option v-for="option in options_maingroup" v-bind:value="option.value" v-bind:key="option.value">
                {{ option.text }}
                </option>
            </select>
        </div>

        <div v-if="showSubGroupSelect===true">
            Dette er dine grupper
            <select multiple v-model="options_subgroup" v-on:change="selectSubGroup(selected_subgroup)" >
                <option v-for="option in options_subgroup" v-bind:value="option.value" v-bind:key="option.value">
                {{ option.text }}
                </option>
            </select>            
        </div>

    </section>
</template>

<script>

    import axios from 'axios';
    import router from '../router/index'

    export default {
        name: 'Innmelding',
        data(){
            return {
                current_user:this.$parent.current_user,
                showMainGroupSelect: true,
                showSubGroupSelect: true,
                selected_maingroup: '',
                selected_subgroup: '',

                options_maingroup: [
                    { text: 'Kollektivnavn', value: 0 }
                ],
                options_subgroup: [
                    { text: 'Gruppenavn 1', value: 1 },
                    { text: 'Gruppenavn 2', value: 2 },
                ],
                                
                selected_maingroup_name: '',
                selected_subgroup_name: '',
            }
        },
        created: function() {
            //this.getGroupsFor(this.current_user.bruker_id);
        },

        methods: {
            getGroupsFor(bruker_id){
                console.log('Getting main group(s) for user ' + bruker_id);
                axios.get('http://localhost:9000/rest/undergrupperForBruker/' + bruker_id).then(response => {
                    this.options_maingroup = response.data.map((item) => {
                        return {
                            text: item.navn,
                            value: item.kollektiv_id
                        };
                    });
                    this.selected_maingroup = '';

                    if(response.data.length==0){ //User is admin of 0 groups. Inviting not allowed!
                        this.showInviteSection=false;
                        this.showApproveSection=false;
                    }else if(response.data.length==1){ //User is admin of exactly 1 group. That group is automatically selected.
                        this.selected_maingroup = response.data[0].kollektiv_id;
                        this.selected_maingroup_name = response.data[0].navn;
                        this.showInviteSection=true;
                        this.showGroupSelect=false;
                        this.showApproveSection=true;
                    }else{ //User is admin of several groups. Group must be selected in order to invite.
                        this.showInviteSection=true;
                        this.showGroupSelect=true;
                        this.showApproveSection=true;
                    };
                }).catch(err => {
                    console.log(err);
                    console.log("Error!");
                });
            },
            selectMainGroup(groupID){
                console.log('selectMainGroup');
            },
            selectSubGroup(groupID){
                console.log('selectSubGroup');
            },
        }
    }
</script>

<style scoped>
</style>