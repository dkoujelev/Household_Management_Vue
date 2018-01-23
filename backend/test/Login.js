let expect = require('chai').expect;
let should = require('chai').should();
let axios = require('axios');
let clearDB = require('./testutil').clearDB;
let server = require('../REST/server');

let testuser = {
  epost: 'test@test.com',
  fornavn: 'Test',
  etternavn: 'Testesen',
  tlf: '12345678',
  adresse: 'Testveien 1',
  hashed_passord: 'passord',
};

describe('Login',() => {

  before(() => {    server.loginEnabled = true;});
  after(() => {    server.loginEnabled = false;});

  beforeEach(() => {
    return clearDB()
    .then(() => {
      return axios.post('http://localhost:9100/rest/bruker', testuser);
    });
  });

  // Not allowed to access data without being logged in.
  it.skip('Sjekk at uautentisert bruker ikke når REST-ressurser',() => {
    return axios.get('http://localhost:9100/rest/bruker').should.be.rejected;
  });

  // it('Sjekk at bruker kan logge inn og aksessere ressurser', () => {
  //
  //   return axios.post('http://localhost:9100/rest/login', {epost: testuser.epost, passord: testuser.hashed_passord})
  //     .then(response => {return axios.get('http://localhost:9100/rest/bruker/1')})
  //     .then(response => {console.log(response.data)});
  //
  // });

});
