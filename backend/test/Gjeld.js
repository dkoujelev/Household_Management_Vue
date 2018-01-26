let expect = require('chai').expect;
let axios = require('axios');
let bcrypt = require('bcrypt');
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

describe('Gjeld',() => {

  beforeEach(() => {
    // OBS: Vi må RETURNERE hele kjeden til testbiblioteket vårt, derfor return før clearDB.
    return clearDB()     // Vi må først nullstille testbasen
      .then((response) => {
        // Legg testuser inn i basen
        return axios.post(restServer + 'bruker', testuser);
      }).then(response => {
        // Finn ut hvilken bruker_id testuser fikk, og legg til i testuser objektet vårt
        testuser.bruker_id = response.data.insertId;
        delete testuser.hashed_passord;
        // Legg testuser2 inn i basen
        return axios.post(restServer + 'bruker', testuser2);
      }).then(response => {
        // Finn ut hvilken bruker_id testuser2 fikk, og legg til i testuser objektet vårt
        testuser2.bruker_id = response.data.insertId;
        delete testuser2.hashed_passord;
        return axios.post(restServer + 'gjeld', testgjeld1);
      }).then(response => {
        testgjeld1.gjeld_id = response.data.insertId;
        return axios.post(restServer + 'gjeld', testgjeld2);
      }).then(response => {
        testgjeld2.gjeld_id = response.data.insertId;
      });
  });

  it('Opprett og les ut gjeld', () => {

    let testgjeld = {
      belop: 100,
      beskrivelse: "Test-gjeld lokal",
      bruker_skylder_id: 1,
      bruker_innkrever_id: 2
    };

    return axios.post(restServer + 'gjeld', testgjeld)
      .then(response => {
        return axios.get(restServer + 'gjeld/' + response.data.insertId);
      }).then(response => {
        expect(response.data).to.containSubset(testgjeld);
      });
  });

  it('Hent all gjeld som bruker skylder andre', () => {
    return axios.get(restServer + 'gjeldBrukerErSkyldig/1')
      .then(response => {
        expect(response.data.length).to.equal(1);
        expect(response.data[0].sum).to.equal(200);
        expect(response.data[0]).to.containSubset(testuser2);
      });
  });

  it('Hent all gjeld som bruker skyldes av andre', () => {
    return axios.get(restServer + 'gjeldBrukerKreverInn/2')
      .then(response => {
        expect(response.data.length).to.equal(1);
        expect(response.data[0].sum).to.equal(200);
        expect(response.data[0]).to.containSubset(testuser);
      });
  });

  it('Hent spesifisert gjeld', () => {
    return axios.post(restServer + 'gjeldSpesifisert', { skylder: 1, innkrever: 2 })
      .then(response => {

        expect(response.data.length).to.equal(2);
        expect(response.data[0]).to.containSubset(testgjeld1);
        expect(response.data[1]).to.containSubset(testgjeld2);
      });
  });

  it('Sett gjeld som betalt', () => {

    return axios.post(restServer + 'settGjeldSomBetalt/1')
      .then(response => {
        return axios.get(restServer + 'gjeld/1');
      }).then(response => {
        expect(response.data.betalt).to.be.a.dateString();
      });
  });

  it('Sett flere gjeld som betalt', () => {
    return axios.post(restServer + 'settFlereGjeldSomBetalt',{ids:[1,2]})
      .then(response => {
        return axios.get(restServer + 'gjeld')
      }).then(response => {
        expect(response.data[0].betalt).to.be.a.dateString();
        expect(response.data[1].betalt).to.be.a.dateString();
      });
  });

});
