let expect = require('chai').expect;
let axios = require('axios');
let bcrypt = require('bcrypt');
let clearDB = require('./testutil').clearDB;
let serverConfig = require('./testutil').serverConfig();
let restServer = 'http://' + serverConfig.serverAddress + ':' + serverConfig.serverPort + '/rest/';

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
  etternavn: 'Testesen',
  tlf: '12345678',
  adresse: 'Testveien 2',
  hashed_passord: 'passord'
};

let testUser3 = {
  epost: 'test3@test.com',
  fornavn: 'Test3',
  etternavn: 'Testesen',
  tlf: '12345678',
  adresse: 'Testveien 3',
  hashed_passord: 'passord'
};

let test_kollektiv = {navn: 'testkollektiv', beskrivelse: ''};

let test_melding = {
  tekst: 'test',
  overskrift: 'Test-overskrift',
  skrevet_av_bruker: 1,
  sendt_til_kollektiv: 1
};

describe('Melding',() => {
  let testCounter = 0;
  beforeEach(() => {

    testCounter++;
    test_melding.tekst=testCounter + ' - test';

    return clearDB().then(() => {
      return axios.post(restServer + 'bruker',testUser);
    }).then(response => {
      testUser.bruker_id = response.data.insertId;

      return axios.post(restServer + 'bruker',testUser2);
    }).then(response => {
      testUser2.bruker_id = response.data.insertId;

      return axios.post(restServer + 'bruker',testUser3);
    }).then(response => {
      testUser3.bruker_id = response.data.insertId;


      return axios.post(restServer + 'kollektiv/' + testUser.bruker_id, test_kollektiv);
    }).then(response => {
      test_kollektiv.kollektiv_id = response.data.insertId;

      return axios.post(restServer + 'meldBrukerInnIKollektiv/', {bruker_id:testUser2.bruker_id,kollektiv_id:test_kollektiv.kollektiv_id,er_admin:0});
    }).then(response => {
      return axios.post(restServer + 'meldBrukerInnIKollektiv/', {bruker_id:testUser3.bruker_id,kollektiv_id:test_kollektiv.kollektiv_id,er_admin:0});
    }).then(response => {
      return axios.post(restServer + 'melding', test_melding);
    }).then(response => {
      test_melding.melding_id = response.data.insertId;
    });
  });

  // Lagring testes implisitt i beforeEach
  it('Hent melding for kollektiv',() => {
    return axios.get(restServer + 'melding/motta/kollektiv/' + test_melding.sendt_til_kollektiv)
      .then(response => {
        expect(response.data[0]).to.containSubset(test_melding);
      });
  });

  it('Hent alle meldinger en bruker skal se', () => {
    return axios.get(restServer + 'melding/motta/brukerAlle/' + testUser.bruker_id)
      .then(response => {
        expect(response.data[0]).to.containSubset(test_melding);
      });
  });

  it('Slette melding', () => {
    return axios.delete(restServer + 'melding/' + test_melding.melding_id)
      .then(response => {
        return axios.get(restServer + 'melding/' + test_melding.melding_id);
      }).should.be.rejected;
      
  });

  it('Sjekk at det er sendt ut notifikasjoner relatert til utsendte meldinger', () => {
        return axios.get(restServer + 'notifikasjon/' + testUser2.bruker_id + '/alle').then((response) => {
          expect(response.data).to.have.length(2);
            let newNotification2 = {
                opprettet: response.data[0].opprettet, // Her kopieres tidspunktet fordi vi ikke kan forutsi det før testen starter.
                tekst: '4 - test',
                lest:0,
                id:1,
                bruker_id:testUser2.bruker_id
              };

            let newNotification4 = {
                opprettet: response.data[1].opprettet,
                tekst: '4 - test',
                lest:0,
                id:2,
                bruker_id:testUser3.bruker_id
            };
            expect(response.data).to.containSubset([newNotification2,newNotification4]);
        });
    });
  
});
