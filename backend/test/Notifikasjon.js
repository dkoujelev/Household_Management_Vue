import { util } from 'chai/lib/chai';
import { request } from 'https';

let expect = require('chai').expect;
let axios = require('axios');
let clearDB = require('./testutil').clearDB;
let myUtil = require('../REST/util');

let restServer = 'http://localhost:9001/rest/';

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
    tekst:'Psst! You\'ve got stuff to do!',
    lest:0,
    id:null,
    bruker_id:0
};

let testNotification2 = {
    opprettet: myUtil.getCurrentTimeAsEpoch(),
    tekst:'Psst! You\'ve got unread stuff!',
    lest:0,
    id:null,
    bruker_id:0
};

let testNotification3 = {
    opprettet: myUtil.getCurrentTimeAsEpoch(),
    tekst:'This one has been read...',
    lest:1,
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

describe('Innmelding',() => {
    beforeEach(() => {
        // OBS: Vi må RETURNERE hele kjeden til testbiblioteket vårt, derfor return før clearDB.
        return clearDB()     // Vi må først nullstille testbasen
            .then((response) => {
            // Legg testUser inn i basen
            return axios.post(restServer + 'bruker/', testUser);
        }).then(response => {
            // Finn ut hvilken bruker_id testuser fikk, og legg til i testuser objektet vårt
            testUser.bruker_id = response.data.insertId;

            testNotification1.bruker_id=testUser.bruker_id;
            testNotification2.bruker_id=testUser.bruker_id;
            testNotification3.bruker_id=testUser.bruker_id;
            
            return axios.post(restServer + 'bruker/', testUser2);
        }).then(response => {
            testUser2.bruker_id = response.data.insertId;

            testNotification4.bruker_id=testUser2.bruker_id;

            return axios.post(restServer + 'notifikasjon/', testNotification1);
        }).then(response => {
            testNotification1.id=response.data.id;
            return axios.post(restServer + 'notifikasjon/', testNotification2);
        }).then(response => {
            testNotification2.id=response.data.id;
            return axios.post(restServer + 'notifikasjon/', testNotification3);
        }).then(response => {
            testNotification3.id=response.data.id;
            return axios.post(restServer + 'notifikasjon/', testNotification4);
        }).then(response => {
            testNotification4.id=response.data.id;
            // Database is primed and ready!
        });
    });

    it('Hent en spesifikk notifikasjon', () => {
        return axios.get(restServer + 'notifikasjon/' + testUser.bruker_id).then((response) => {
            // Vi forventer nå at objektet fra basen inneholder test-objektene som vi la inn tidligere.
            expect(response.data).to.containSubset([testNotification1,testNotification2,testNotification3]);
        });
    });

    it('Hent alle notifikasjoner for en bruker', () => {
        return axios.get(restServer + 'notifikasjon/' + testUser.bruker_id).then((response) => {
            // Vi forventer nå at objektet fra basen inneholder test-objektene som vi la inn tidligere.
            expect(response.data).to.containSubset([testNotification1,testNotification2,testNotification3]);
            expect(response.data).to.not.containSubset([testNotification4]);
        });
    });

    it('Hent alle uleste notifikasjoner for en bruker', () => {
        return axios.get(restServer + 'notifikasjon/' + testUser.bruker_id + '/ulest').then((response) => {
            // Vi forventer nå at objektet fra basen inneholder test-objektene som vi la inn tidligere.
            expect(response.data).to.containSubset([testNotification1,testNotification2]);
            expect(response.data).to.not.containSubset([testNotification3]);
            expect(response.data).to.not.containSubset([testNotification4]);
        });
    });

    

});

