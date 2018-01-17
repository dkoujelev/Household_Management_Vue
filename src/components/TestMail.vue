<template>
    <div>
        <h1>{{ testHeadline }}</h1>
<!--
        <input v-model="to" placeholder="harald@geving.no">
        <input v-model="from" placeholder="testy@mctest.face">
        <input v-model="subject" placeholder="Subject McSubjectface">
        <input v-model="body" placeholder="This is a nice">
-->

        <button id="btnSendMail" name="btnSendMail" @click="doSendMailStuff">Send en mail</button>
        <div id="resultFromPOST">{{ sendResult }}</div>
    </div>
</template>

<script>
import axios from 'axios';
//let sendResult = 'Ukjent';

export default {
    name: 'TestMail',
    data () {
        return{
            testHeadline: 'Testing av SMTP',
            sendResult: ''
        }
    },
    methods: {
  	    doSendMailStuff () {
    	     axios.post('http://localhost:9000/rest/epost/', {
                 to: 'harald@geving.no',
                 from: 'test@team1.zzz',
                 subject: 'Test mail',
                 body: 'This is a nice body!'
             }).then(response => {
                console.log('GUI got: ' + response.data); // response.data is seemingly empty, but how can we check?
                this.sendResult = 'Epost sendt!';
            }).catch(err => {
                console.log(err); // We assume that this suffers from the same issue(s) as response.data
                this.sendResult = 'Epost IKKE sendt!';
            });
        }
    }
}
</script>
