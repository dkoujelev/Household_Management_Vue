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

    // Legg inn testbrukeren via REST
    axios.post('http://localhost:9100/rest/bruker', testuser).then(response => {
      // Hent umiddelbart ut igjen brukeren vi la inn.
      axios.get('http://localhost:9100/rest/bruker/' + response.data.insertId).then(response => {

        let user2 = response.data;

        // Sjekk at brukerobjektet vi fikk ut fra REST er likt det vi putta inn.
        expect(testuser.epost).to.equal(user2.epost);
        expect(testuser.fornavn).to.equal(user2.fornavn);
        expect(testuser.etternavn).to.equal(user2.etternavn);
        expect(testuser.tlf).to.equal(user2.tlf);
        expect(testuser.adresse).to.equal(user2.adresse);

        // Vi har testet alt vi skulle teste, si i fra til testbiblioteket om at vi er ferdige. VIKTIG!!
        done();

      }).catch(err => {
        // Om axios gir feilmelding, sørger vi for at testen også feiler.
        done(new Error("error getting user from DB: " + err.message));
      });
    }).catch(err => {
      // Om axios gir feilmelding, sørger vi for at testen også feiler.
      done(new Error("error writing user to DB: " + err.message));
    });
  });

  it('Hent bruker med bestemt epost', done => {
    // Legg inn testbrukeren via REST
    axios.post('http://localhost:9100/rest/bruker', testuser).then(response => {
      let id = response.data.insertId;
      // Hent umiddelbart ut igjen brukeren vi la inn, ved å oppgi brukerens epost.
      axios.get('http://localhost:9100/rest/brukerMedEpost/' + testuser.epost).then(response => {
        let user2 = response.data;

        // Sjekk at brukerobjektet vi fikk ut fra REST er likt det vi putta inn.
        expect(testuser.epost).to.equal(user2.epost);
        expect(testuser.fornavn).to.equal(user2.fornavn);
        expect(testuser.etternavn).to.equal(user2.etternavn);
        expect(testuser.tlf).to.equal(user2.tlf);
        expect(testuser.adresse).to.equal(user2.adresse);
        // Sjekk også at ID'en som ble generert når brukeren ble satt inn, er samme som på brukeren vi får ut.
        expect(id).to.equal(user2.bruker_id);

        // Vi har testet alt vi skulle teste, si i fra til testbiblioteket om at vi er ferdige. VIKTIG!!
        done();
      }).catch(err => {
        // Om axios gir feilmelding, sørger vi for at testen også feiler.
        done(new Error("error reading user from DB: " + err.message));
      });
    }).catch(err => {
      // Om axios gir feilmelding, sørger vi for at testen også feiler.
      done(new Error("error writing user to DB: " + err.message));
    });
  });
});
