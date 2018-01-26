let expect = require('chai').expect;
let axios = require('axios');
let clearDB = require('./testutil').clearDB;
let myUtil = require('../REST/util');
let serverConfig = require('./testutil').serverConfig();
let restServer = 'http://' + serverConfig.serverAddress + ':' + serverConfig.serverPort + '/rest/';


/*
                Notifikasjon
    opprettet               bigint(20) 
    tekst                   varchar(255) 
    lest                    tinyint(1) 
    id                      int(11) AI PK 
    bruker_id               int(11)
*/

let testUser = {
    epost: 'test@test.com',
    fornavn: 'Test',
    etternavn: 'Testesen',
    tlf: '12345678',
    adresse: 'Testveien 1',
    hashed_passord: 'passord',
};

let testUser2 = {
    epost: 'test2@test.com',
    fornavn: 'Test2',
    etternavn: 'Testesen2',
    tlf: '12345679',
    adresse: 'Testveien 2',
    hashed_passord: 'passord',
};

let testNotification1 = {
    opprettet: myUtil.getCurrentTimeAsEpoch(),
    tekst:'Psst! You\'ve got stuff to do!!!',
    lest:0,
    id:null,
    bruker_id:0
};

let testNotification2 = {
    opprettet: myUtil.getCurrentTimeAsEpoch(),
    tekst:'Psst! You\'ve got unread stuff!!!',
    lest:0,
    id:null,
    bruker_id:0
};

let testNotification3 = {
    opprettet: myUtil.getCurrentTimeAsEpoch(),
    tekst:'This one has been read...',
    lest:0,
    id:null,
    bruker_id:0
};

let testNotification4 = {
    opprettet: myUtil.getCurrentTimeAsEpoch(),
    tekst:'Psst! You\'ve also got unread stuff!',
    lest:0,
    id:null,
    bruker_id:0
};

describe.skip('Notifikasjon',() => {
    beforeEach(() => {
        // OBS: Vi må RETURNERE hele kjeden til testbiblioteket vårt, derfor return før clearDB.
        //let ignoreThis = axios.get(restServer + 'notifikasjondump/');
        //let ignoreThat = axios.get(restServer + 'notifikasjondumpandtrunk/');
        //let ignoreMore = axios.get(restServer + 'notifikasjondump/');//.then((response) => {
        //     console.log('======================================================');
        //     console.log(response);
        //     console.log('======================================================');
        // });

        return clearDB()     // Vi må først nullstille testbasen
            .then((response) => {
                
            // Legg testUser inn i basen
            return axios.post(restServer + 'bruker/', testUser);
        }).then(response => {

            // Finn ut hvilken bruker_id testuser fikk, og legg til i testuser objektet vårt
            testUser.bruker_id = response.data.insertId;
            testNotification1.bruker_id = testUser.bruker_id;
            testNotification2.bruker_id = testUser.bruker_id;
            testNotification3.bruker_id = testUser.bruker_id;

            return axios.post(restServer + 'bruker/', testUser2);
        }).then(response => {
            testUser2.bruker_id = response.data.insertId;
            testNotification4.bruker_id=testUser2.bruker_id;
            return axios.post(restServer + 'notifikasjon/', testNotification1);
        }).then(response => {
            testNotification1.id = response.data.insertId;
            return axios.post(restServer + 'notifikasjon/', testNotification2);
        }).then(response => {
            testNotification2.id = response.data.insertId;
            return axios.post(restServer + 'notifikasjon/', testNotification3);
        }).then(response => {
            testNotification3.id = response.data.insertId;
            return axios.post(restServer + 'notifikasjon/', testNotification4);
        }).then(response => {
            testNotification4.id = response.data.insertId;

            testNotification1.lest=0;
            testNotification2.lest=0;
            testNotification3.lest=1;
            testNotification4.lest=0;
        });
    });

    it('Hent en spesifikk notifikasjon', () => {
        return axios.get(restServer + 'notifikasjon/' + testNotification2.id).then((response) => {
            // Vi forventer nå at objektet fra basen inneholder test-objektene som vi la inn tidligere.
            expect(response.data).to.containSubset([testNotification2]);
        });
    });

    it('Marker en notifikasjon som lest', () => {
        return axios.put(restServer + 'notifikasjon/' + testNotification4.id + '/les', testNotification4).then((response) => {
            // Vi forventer nå at objektet fra basen inneholder test-objektene som vi la inn tidligere.
            expect(response.data.affectedRows).to.equal(1);
            return axios.get(restServer + 'notifikasjon/' + testNotification4.id).then((response) => {
                testNotification4.lest=1;
                expect(response.data).to.containSubset([testNotification4]);
            });
        });
    });   

    it('Hent alle notifikasjoner for en bruker', () => {
        return axios.get(restServer + 'notifikasjon/' + testUser.bruker_id + '/alle').then((response) => {
            // Vi forventer nå at objektet fra basen inneholder test-objektene som vi la inn tidligere.
            expect(response.data).to.containSubset([testNotification1,testNotification2,testNotification3]);
            expect(response.data).to.not.containSubset([testNotification4]);
        });
    });

    it('Hent alle ULESTE notifikasjoner for en bruker', () => {
        return axios.get(restServer + 'notifikasjon/' + testUser.bruker_id + '/ulest').then((response) => {
            // Vi forventer nå at objektet fra basen inneholder test-objektene som vi la inn tidligere.
            expect(response.data).to.containSubset([testNotification1,testNotification2]);
            expect(response.data).to.not.containSubset([testNotification3]);
            expect(response.data).to.not.containSubset([testNotification4]);
        });
    });   

    it('Marker alle brukerens notifikasjoner som lest', () => {
        return axios.put(restServer + 'notifikasjon/' + testUser.bruker_id + '/lesalle', testUser).then((response) => {
            // Vi forventer nå at to linjer skal være endret
            expect(response.data.affectedRows).to.equal(2);
            
            return axios.get(restServer + 'notifikasjon/' + testUser.bruker_id + '/alle').then((response) => {
                testNotification1.lest=1;
                testNotification2.lest=1;
                expect(response.data).to.containSubset([testNotification1,testNotification2,testNotification3]);
            });
        });
    });

    it('Oppdater en notifikasjon', () => {
        let tmpNotification = {
            opprettet: myUtil.getCurrentTimeAsEpoch(),
            tekst:'I\'m completely changed!',
            lest:0,
            id:testNotification1.id,
            bruker_id:testNotification1.bruker_id
        }
        return axios.put(restServer + 'notifikasjon/', tmpNotification).then((response) => {
            // Vi forventer nå at objektet fra basen er lik den endrede oppføringen
            expect(response.data.affectedRows).to.equal(1);
            return axios.get(restServer + 'notifikasjon/' + testNotification1.id).then((response) => {
                expect(response.data).to.containSubset([tmpNotification]);
            });
        });
    });   

});

// it('x----- WORKAROUND for truncating notifications ------x',() => {
//     let ignoreMe= axios.get(restServer + 'notifikasjontrunk/');
//   });