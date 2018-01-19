let expect = require('chai').expect;
let axios = require('axios');
let clearDB = require('./clearDB');

let testuser = {
  epost: 'test@test.com',
  fornavn: 'Test',
  etternavn: 'Testesen',
  tlf: '12345678',
  adresse: 'Testveien 1',
  hashed_passord: 'passord'
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

describe('Bruker',() => {

  beforeEach(done => {
    clearDB(() => {
      axios.post('http://localhost:9100/rest/bruker', testuser).then(response => {
        testuser.bruker_id = response.data.insertId;
        delete testuser.hashed_passord;
        axios.post('http://localhost:9100/rest/bruker', testuser2).then(response => {
          testuser2.bruker_id = response.data.insertId;
          delete testuser2.hashed_passord;

          axios.post('http://localhost:9100/rest/kollektiv/' + testuser.bruker_id, test_kollektiv).then(response => {
            test_kollektiv.kollektiv_id = response.data.insertId;

            // testuser ligger allerede inne i kollektivet pga han som "oppretta" det i before()
            // Trenger kun å legge inn testuser2.
            axios.post('http://localhost:9100/rest/meldBrukerInnIKollektiv', {
              bruker_id: testuser2.bruker_id,
              kollektiv_id: test_kollektiv.kollektiv_id
            }).then(response => {

              done();

            }).catch(err => { done(new Error("error adding user to collective: " + err.response.data.sqlMessage)); });
          }).catch(err => { done(new Error("error checking if user exists: " + err.response.data.sqlMessage)); });
        }).catch(err => { done(new Error("error reading user from DB: " + err.response.data.sqlMessage)); });
      }).catch(err => { done(new Error("error writing user to DB: " + err.response.data.sqlMessage)); });
    });
  });

  it('Opprett og hent bruker', done => {

    // Hent ut testuser og sammenlign
    axios.get('http://localhost:9100/rest/bruker/' + testuser.bruker_id).then(response => {
      delete response.data.hashed_passord;

      expect(response.data).to.deep.equal(testuser);

      // Vi har testet alt vi skulle teste, si i fra til testbiblioteket om at vi er ferdige. VIKTIG!!
      done();

    }).catch(err => {
      // Om axios gir feilmelding, sørger vi for at testen også feiler.
      done(new Error("error getting user from DB: " + err.response.data.sqlMessage));
    });

  });

  it('Hent bruker med bestemt epost', done => {

    // Hent umiddelbart ut igjen brukeren vi la inn, ved å oppgi brukerens epost.
    axios.get('http://localhost:9100/rest/brukerMedEpost/' + testuser.epost).then(response => {
      delete response.data.hashed_passord;

      // Sjekk at brukerobjektet vi fikk ut fra REST er likt det vi putta inn.
      expect(response.data).to.deep.equal(testuser);

      // Vi har testet alt vi skulle teste, si i fra til testbiblioteket om at vi er ferdige. VIKTIG!!
      done();
    }).catch(err => { done(new Error("error reading user by email from DB: " + err.response.data.sqlMessage)); });

  });

  it('Hent alle brukere', done => {

    axios.get('http://localhost:9100/rest/bruker').then(response => {
      let users = response.data;

      // Sjekk at vi fikk ut like mange brukere som vi satte inn.
      expect(users.length).to.equal(2);

      // Fjern passord fra brukerlista vi fikk ut, skal ikke sjekkes.
      users.forEach(v => { delete v.hashed_passord });

      // Sjekk at brukerne som kom ut er identiske med de som ble satt inn.
      expect(users).to.have.deep.members([testuser, testuser2]);
      done();

    }).catch(err => {
      // Om axios gir feilmelding, sørger vi for at testen også feiler.
      done(new Error("error getting users from DB: " + err.response.data.sqlMessage));
    });
  });

  it('Sjekk om en bruker er registrert', done => {

    axios.get('http://localhost:9100/rest/brukerepost/' + testuser.epost).then(response => {
      delete response.data.hashed_passord;

      expect(response.data).to.deep.equal({exists: true});

      axios.get('http://localhost:9100/rest/brukerepost/' + 'epost@somikke.finnes').then(response => {
        delete response.data.hashed_passord;

        expect(response.data).to.deep.equal({exists: false});

        done();

      }).catch(err => { done(new Error("error checking if user exists: " + err.response.data.sqlMessage)); });;

    }).catch(err => { done(new Error("error checking if user exists: " + err.response.data.sqlMessage)); });

  });

  it('Hent alle brukere i et bestemt kollektiv', done => {

    axios.get('http://localhost:9100/rest/brukereIKollektiv/' + test_kollektiv.kollektiv_id).then(response => {

      let users = response.data;

      users.forEach(v => { delete v.hashed_passord });

      expect(users).to.have.deep.members([testuser, testuser2]);

      done();

    }).catch(err => { console.log("ERR"); done(new Error("error getting all users in collective: " + err.response.data.sqlMessage)); });;

  });

});
