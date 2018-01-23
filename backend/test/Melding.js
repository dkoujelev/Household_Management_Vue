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

let test_kollektiv = {navn: 'testkollektiv', beskrivelse: ''};

let test_melding = {
  tekst: 'Test-melding',
  overskrift: 'Test-overskrift',
  skrevet_av_bruker: 1,
  sendt_til_kollektiv: 1
};

describe('Melding',() => {
  beforeEach(() => {
    return clearDB().then(() => {
      return axios.post('http://localhost:9100/rest/bruker',testuser);
    }).then(response => {
      testuser.bruker_id = response.data.insertId;
      return axios.post('http://localhost:9100/rest/kollektiv/'+testuser.bruker_id, test_kollektiv);
    }).then(response => {
      test_kollektiv.kollektiv_id = response.insertId;
      return axios.post('http://localhost:9100/rest/melding', test_melding);
    }).then(response => {
      test_melding.melding_id = response.data.insertId;
    });
  });

  // Lagring testes implisitt i beforeEach
  it('Hent melding for kollektiv',() => {
    return axios.get('http://localhost:9100/rest/melding/motta/kollektiv/' + test_melding.sendt_til_kollektiv)
      .then(response => {
        expect(response.data[0]).to.containSubset(test_melding);
      });
  });

  it('Slette melding', () => {
    return axios.delete('http://localhost:9100/rest/melding/' + test_melding.melding_id)
      .then(response => {
        return axios.get('http://localhost:9100/rest/melding/' + test_melding.melding_id);
      }).should.be.rejected;
  });

// Oppdatere melding - TRENGER IKKE

});
