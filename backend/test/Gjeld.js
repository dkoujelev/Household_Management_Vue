let expect = require('chai').expect;
let axios = require('axios');
let bcrypt = require('bcrypt');
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
  epost: 'test@test2.com',
  fornavn: 'Test2',
  etternavn: 'Testesen',
  tlf: '12345678',
  adresse: 'Testveien 2',
  hashed_passord: 'passord'
};

let testgjeld1 = {
  belop: 100,
  beskrivelse: "Test-gjeld 1",
  bruker_skylder_id: 1,
  bruker_innkrever_id: 2
};

let testgjeld2 = {
  belop: 100,
  beskrivelse: "Test-gjeld 2",
  bruker_skylder_id: 1,
  bruker_innkrever_id: 2
};

let testgjeld3 = {
  belop: 100,
  beskrivelse: "Test-gjeld 3",
  bruker_skylder_id: 1,
  bruker_innkrever_id: 2
};

describe('Bruker',() => {

  beforeEach(() => {
    // OBS: Vi må RETURNERE hele kjeden til testbiblioteket vårt, derfor return før clearDB.
    return clearDB()     // Vi må først nullstille testbasen
      .then((response) => {
        // Legg testuser inn i basen
        return axios.post('http://localhost:9100/rest/bruker', testuser);
      }).then(response => {
        // Finn ut hvilken bruker_id testuser fikk, og legg til i testuser objektet vårt
        testuser.bruker_id = response.data.insertId;
        // Legg testuser2 inn i basen
        return axios.post('http://localhost:9100/rest/bruker', testuser2);
      }).then(response => {
        // Finn ut hvilken bruker_id testuser2 fikk, og legg til i testuser objektet vårt
        testuser2.bruker_id = response.data.insertId;
        return axios.post('http://localhost:9100/rest/gjeld', testgjeld1);
      }).then(response => {
        testgjeld1.gjeld_id = response.data.insertId;
      });
  });

  it('Opprett og les ut gjeld', () => {

    let testgjeld = {
      belop: 100,
      beskrivelse: "Test-gjeld lokal",
      bruker_skylder_id: 1,
      bruker_innkrever_id: 2
    };

    return axios.post('http://localhost:9100/rest/gjeld', testgjeld)
      .then(response => {
        return axios.get('http://localhost:9100/rest/gjeld/' + response.data.insertId);
      }).then(response => {
        expect(response.data).to.containSubset(testgjeld);
      });
  });

});
