let expect = require('chai').expect;
let axios = require('axios');

let testuser = {
  epost: 'test@test.com',
  fornavn: 'Test',
  etternavn: 'Testesen',
  tlf: '12345678',
  adresse: 'Testveien 1',
  hashed_passord: 'passord'
};

describe('Bruker',() => {
  it('Opprett og hent bruker', done => {

    axios.post('http://localhost:9100/rest/bruker', testuser).then(response => {
      axios.get('http://localhost:9100/rest/bruker/' + response.data.insertId).then(response => {

        let user2 = response.data;

        expect(testuser.epost).to.equal(user2.epost);
        expect(testuser.fornavn).to.equal(user2.fornavn);
        expect(testuser.etternavn).to.equal(user2.etternavn);
        expect(testuser.tlf).to.equal(user2.tlf);
        expect(testuser.adresse).to.equal(user2.adresse);

        done();

      }).catch(err => {
        done(new Error("error getting user from DB: " + err.message));
      });
    }).catch(err => {
      done(new Error("error writing user to DB: " + err.message));
    });
  });

  it('Hent bruker med bestemt epost', done => {
    axios.post('http://localhost:9100/rest/bruker', testuser).then(response => {
      let id = response.data.insertId;
      axios.get('http://localhost:9100/rest/brukerMedEpost/' + testuser.epost).then(response => {
        let user2 = response.data;

        expect(testuser.epost).to.equal(user2.epost);
        expect(testuser.fornavn).to.equal(user2.fornavn);
        expect(testuser.etternavn).to.equal(user2.etternavn);
        expect(testuser.tlf).to.equal(user2.tlf);
        expect(testuser.adresse).to.equal(user2.adresse);
        expect(id).to.equal(user2.bruker_id);

        done();
      }).catch(err => {
        done(new Error("error reading user from DB: " + err.message));
      });
    }).catch(err => {
      done(new Error("error writing user to DB: " + err.message));
    });
  });
});
