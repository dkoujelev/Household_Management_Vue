let expect = require('chai').expect;
let axios = require('axios');
let clearDB = require('./testutil').clearDB;

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

describe.skip('Kostnad', () => {

  beforeEach(() => {
    // OBS: Vi må RETURNERE hele kjeden til testbiblioteket vårt, derfor return før clearDB.
    return clearDB()     // Vi må først nullstille testbasen
      .then(response => {
        return axios.post('http://localhost:9100/rest/bruker', testuser);
      }).then(response => {
        return axios.post('http://localhost:9100/rest/kollektiv/1', test_kollektiv);
      }).then(response => {
        return axios.post('http://localhost:9100/rest/bruker', testuser2);
      }).then(response => {
        return axios.post('http://localhost:9100/rest/oppdaterMedlemsskapIUndergruppe', {undergruppe_id: 1, brukere: [1,2]});
      }).then(response => {
        return axios.post('http://localhost:9100/rest/handleliste', test_handleliste);
      }).then(response => {
        return axios.post('http://localhost:9100/rest/kostnad', test_kostnad);
      }).catch(err => console.log(err));
  });

  it('Hente en kostnad', () => {
    return axios.get('http://localhost:9100/rest/kostnad/1')
      .then(response => {
        expect(response.data).to.containSubset(test_kostnad);
      });
  });

  it('Hente kostnader til en handleliste', () => {
    return axios.get('http://localhost:9100/rest/kostnaderForHandleliste/1')
      .then(response => {
        expect(response.data.length).to.equal(1);
        expect(response.data[0]).to.containSubset(test_kostnad);
      });
  });

  it('Hente kostnader til en undergruppe', () => {
    return axios.get('http://localhost:9100/rest/kostnaderForUndergruppe/1')
      .then(response => {
        expect(response.data.length).to.equal(1);
        expect(response.data[0]).to.containSubset(test_kostnad);
      });
  });

  it('Oppdater en kostnad', () => {
    return axios.put('http://localhost:9100/rest/kostnad', test_kostnad2)
      .then(response => {
        return axios.get('http://localhost:9100/rest/kostnad/1');
      }).then(response => {
        expect(response.data).to.containSubset(test_kostnad2);
      });
  });

  // Vi forventer ett gjeld-objekt i basen
  // 50kr skal betales fra bruker 2 til bruker 1
  it('Sjekk at gjeld fordeles rett fra kostnad', () => {
    return axios.get('http://localhost:9100/rest/gjeld/1')
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
