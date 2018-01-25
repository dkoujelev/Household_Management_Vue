let expect = require('chai').expect;
let axios = require('axios');
let clearDB = require('./testutil').clearDB;
let serverConfig = require('./testutil').serverConfig();
let restServer = 'http://' + serverConfig.serverAddress + ':' + serverConfig.serverPort + '/rest/';

let testuser = {
  epost: 'test@test.com',
  fornavn: 'Test',
  etternavn: 'Testesen',
  tlf: '12345678',
  adresse: 'Testveien 1',
  hashed_passord: 'passord',
};

let testuser2 = {
  epost: 'test2@test.com',
  fornavn: 'Test',
  etternavn: 'Testesen',
  tlf: '12345678',
  adresse: 'Testveien 1',
  hashed_passord: 'passord',
};

let test_handleliste = {
  navn: 'Testliste',
  beskrivelse: 'En test',
  undergruppe_id: 1,
  varer: []
};

let test_kollektiv = {navn: 'testkollektiv', beskrivelse: ''};

let test_kostnad = {
  tittel: 'test kostnad',
  sum: 100,
  bruker_id: 1,
  undergruppe_id: 1,
  handleliste_id: 1
};

let test_kostnad2 = {
  tittel: 'test kostnad2',
  sum: 200,
  bruker_id: 1,
  undergruppe_id: 1,
  handleliste_id: 1,
  kostnad_id: 1
};

describe('Kostnad', () => {

  beforeEach(() => {
    // OBS: Vi må RETURNERE hele kjeden til testbiblioteket vårt, derfor return før clearDB.
    return clearDB()     // Vi må først nullstille testbasen
      .then(response => {
        return axios.post(restServer + 'bruker', testuser);
      }).then(response => {
        return axios.post(restServer + 'kollektiv/1', test_kollektiv);
      }).then(response => {
        return axios.post(restServer + 'bruker', testuser2);
      }).then(response => {
        return axios.post(restServer + 'oppdaterMedlemsskapIUndergruppe', {undergruppe_id: 1, brukere: [1,2]});
      }).then(response => {
        return axios.post(restServer + 'handleliste', test_handleliste);
      }).then(response => {
        return axios.post(restServer + 'kostnad', test_kostnad);
      }).catch(err => console.log(err));
  });

  it('Hente en kostnad', () => {
    return axios.get(restServer + 'kostnad/1')
      .then(response => {
        expect(response.data).to.containSubset(test_kostnad);
      });
  });

  it('Hente kostnader til en handleliste', () => {
    return axios.get(restServer + 'kostnaderForHandleliste/1')
      .then(response => {
        expect(response.data.length).to.equal(1);
        expect(response.data[0]).to.containSubset(test_kostnad);
      });
  });

  it('Hente kostnader til en undergruppe', () => {
    return axios.get(restServer + 'kostnaderForUndergruppe/1')
      .then(response => {
        expect(response.data.length).to.equal(1);
        expect(response.data[0]).to.containSubset(test_kostnad);
      });
  });

  it('Oppdater en kostnad', () => {
    return axios.put(restServer + 'kostnad', test_kostnad2)
      .then(response => {
        return axios.get(restServer + 'kostnad/1');
      }).then(response => {
        expect(response.data).to.containSubset(test_kostnad2);
      });
  });

  // Vi forventer ett gjeld-objekt i basen
  // 50kr skal betales fra bruker 2 til bruker 1
  it('Sjekk at gjeld fordeles rett fra kostnad', () => {
    return axios.get(restServer + 'gjeld/1')
      .then(response => {
        expect(response.data).to.containSubset({
          gjeld_id: 1,
          belop: 50,
          beskrivelse: 'test kostnad',
          bruker_innkrever_id: 1,
          bruker_skylder_id: 2
        });
      });
  });


});
