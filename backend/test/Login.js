let expect = require('chai').expect;
let should = require('chai').should();
let axios = require('axios');
let clearDB = require('./testutil').clearDB;
let server = require('../REST/server');
let serverConfig = require('./testutil').serverConfig();
let restServer = 'http://' + serverConfig.serverAddress + ':' + serverConfig.serverPort + '/rest/';

let testuser = {
  epost: 'test@test.com',
  fornavn: 'Test',
  etternavn: 'Testesen',
  tlf: '12345678',
  adresse: 'Testveien 1',
};

let hashed_passord = 'passord';

describe('Login',() => {

  before(() => {    server.loginEnabled = true;});
  after(() => {    server.loginEnabled = false;});

  beforeEach(() => {
    return clearDB()
    .then(() => {
      server.loginEnabled = false;
    }).then(() => {
      testuser.hashed_passord = hashed_passord;
      return axios.post(restServer + 'bruker/', testuser);
    }).then((response) => {
      testuser.bruker_id = response.data.insertId;
      server.loginEnabled = true;
    }).catch(exception => {
      console.log(exception);
    });
  });

  // Not allowed to access data without being logged in.
  it('Sjekk at uautentisert bruker ikke når REST-ressurser',() => {
    return axios.get(restServer + 'bruker').should.be.rejected;
  });

  it('Sjekk at bruker kan logge inn og aksessere ressurser', () => {

    return axios.post(restServer + 'login', {epost: testuser.epost, passord: testuser.hashed_passord
    }).then(response => {
      let header = {
        headers: {
          cookie: response.headers["set-cookie"]
        }
      };
      delete testuser.hashed_passord;
      expect(response.data).to.containSubset(testuser);
      return axios.get(restServer + 'bruker/' + testuser.bruker_id, header)
    }).then(response => {
      expect(response.data).to.containSubset(testuser);
    });
  });

  it('Sjekk at bruker er logget inn',() => {
    return axios.post(restServer + 'login', {epost: testuser.epost, passord: testuser.hashed_passord
    }).then(response => {
      let header = {
        headers: {
          cookie: response.headers["set-cookie"]
        }
      };
      return axios.get(restServer + 'loggedIn', header)
    }).then((response) => {
      delete testuser.hashed_passord;
      expect(response.data).to.containSubset(testuser);
    });
  });

  it('Sjekk at bruker bir logget ut',() => {
    return axios.post(restServer + 'login', {epost: testuser.epost, passord: testuser.hashed_passord
    }).then(response => {
      let header = {
        headers: {
          cookie: response.headers["set-cookie"]
        }
      };
      delete testuser.hashed_passord;
      expect(response.data).to.containSubset(testuser);
      return axios.post(restServer + 'logout', header)
    }).then(() => {
      return axios.get(restServer + 'bruker').should.be.rejected;
    });
  });
});
