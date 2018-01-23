let expect = require('chai').expect;
let axios = require('axios');
let clearDB = require('./testutil').clearDB;


let testUser1 = {
  epost: 'test@test.com',
  fornavn: 'Test',
  etternavn: 'Testesen',
  tlf: '12345678',
  adresse: 'Testveien 1',
  hashed_passord: 'passord',
};

let testUser2 = {
  epost: 'test2@test.com',
  fornavn: 'TestName',
  etternavn: 'Testenstad',
  tlf: '87654321',
  adresse: 'Testveien 2',
  hashed_passord: 'qwerty',
};

let testUser3 = {
  epost: 'testing@test.com',
  fornavn: 'The',
  etternavn: 'Tester',
  tlf: '95148726',
  adresse: 'Testveien 33',
  hashed_passord: 'cheese',
};

let testKollektiv1 = {navn: 'testkollektiv', beskrivelse: ''};

let testKollektiv2 = {navn: 'kollektivtesten', beskrivelse: 'tester'};

let testUndergruppe1 = {
  navn: 'testgruppe',
  beskrivelse: '',
  kollektiv_id: null
};

let testUndergruppe2 = {
  navn: 'testgruppe2',
  beskrivelse: 'Den andre',
  kollektiv_id: null
};

let testUndergruppe3 = {
  navn: 'testgrupppppe',
  beskrivelse: 'The 3rd',
  kollektiv_id: null
};

// Innholdet i denne funksjonen brukes ikke, men er her for å
// demonstrere hvordan man chainer axios requests på en oversiktelig måte
let axios_eksempel = function(){

  return axios.get(url)
    .then(response => {
      // kode
      return axios.get(url);
    }).then(response => {
      // kode
      return axios.post(url, data);
    }).then(response => {
      // kode
      return axios.get(url);
    }).then(response => {
      //koden her kjører kun etter alle axios requests er utført.
      //Selve testingen legges typisk her, men kan komme tidligere.
    });
};


describe.skip('Undergruppe',() => {

  // Legg inn et par testusers i basen. Begge testusers er medlem i test_kollektiv som også ligger i basen.
  // Basen tømmes og dette innholdet legges inn på nytt før hver test kjøres

  beforeEach(() => {
    // OBS: Vi må RETURNERE hele kjeden til testbiblioteket vårt, derfor return før clearDB.
    return clearDB()     // Vi må først nullstille testbasen
      .then((response) => {
        // Legg testUser1 inn i basen
        return axios.post('http://localhost:9100/rest/bruker/', testUser1);
      }).then(response => {
        // Finn ut hvilken bruker_id testuser fikk, og legg til i testuser objektet vårt
        testUser1.bruker_id = response.data.insertId;
        delete testUser1.hashed_passord;

        // Legg testUser2 inn i basen
        return axios.post('http://localhost:9100/rest/bruker/', testUser2);
      }).then(response => {
        // Finn ut hvilken bruker_id testuser fikk, og legg til i testuser objektet vårt
        testUser2.bruker_id = response.data.insertId;
        delete testUser2.hashed_passord;

        // Legg testUser3 inn i basen
        return axios.post('http://localhost:9100/rest/bruker/', testUser3);
      }).then(response => {
        // Finn ut hvilken bruker_id testuser fikk, og legg til i testuser objektet vårt
        testUser3.bruker_id = response.data.insertId;
        delete testUser3.hashed_passord;

        // Legg in testKollektiv1 i basen. testUser1 blir admin.
        return axios.post('http://localhost:9100/rest/kollektiv/' + testUser1.bruker_id, testKollektiv1);
      }).then(response => {
        testKollektiv1.kollektiv_id = response.data.insertId;

        // Legg in testKollektiv2 i basen. testUser2 blir admin.
        return axios.post('http://localhost:9100/rest/kollektiv/' + testUser2.bruker_id, testKollektiv2);
      }).then(response => {
        testKollektiv2.kollektiv_id = response.data.insertId;

        // Legg in testUndergruppe1 i basen.
        testUndergruppe1.kollektiv_id = testKollektiv1.kollektiv_id;
        return axios.post('http://localhost:9100/rest/undergruppe/' + testUser1.bruker_id, testUndergruppe1);
      }).then(response => {
        testUndergruppe1.undergruppe_id = response.data.insertId;

        // Legg testUser3 inn i testUndergruppe1.
        return axios.post('http://localhost:9100/rest/undergruppeLeggTilBruker/' + testUndergruppe1.undergruppe_id, testUser3);
      }).then(response => {

        // Legg in testUndergruppe2 i basen.
        testUndergruppe2.kollektiv_id = testKollektiv1.kollektiv_id;
        return axios.post('http://localhost:9100/rest/undergruppe/' + testUser1.bruker_id, testUndergruppe2);
      }).then(response => {
        testUndergruppe2.undergruppe_id = response.data.insertId;

        // Legg in testUndergruppe3 i basen.
        testUndergruppe3.kollektiv_id = testKollektiv2.kollektiv_id;
        return axios.post('http://localhost:9100/rest/undergruppe/' + testUser2.bruker_id, testUndergruppe3);
      }).then(response => {
        testUndergruppe3.undergruppe_id = response.data.insertId;
      }).catch(exception => {
        console.log(exception);
      });
  });

  it('Hent en undergruppe med bestemt id', () => {
    // Hent ut testUndergruppe1 og sammenlign
    return axios.get('http://localhost:9100/rest/undergruppe/' + testUndergruppe1.undergruppe_id).then(response => {
      // Vi forventer nå at objektet fra basen inneholder objektet vårt som vi la inn tidligere.
      expect(response.data).to.containSubset(testUndergruppe1);
    });
  });

  it('Hent alle brukere i en undergruppe', () => {

    return axios.get('http://localhost:9100/rest/medlemmerIUndergruppe/' + testUndergruppe1.undergruppe_id).then((response) => {
      let brukere = response.data;
      expect(brukere.length).to.equal(2);
      // Sjekk at brukeren som kom ut inneholder den som ble satt inn.
      expect(brukere).to.containSubset([testUser1, testUser3]);
    });
  });

  it('Hent alle undergrupper', () => {
    return axios.get('http://localhost:9100/rest/undergruppe/').then((response) => {
      let undergrupper = response.data;
      // Sjekk at vi fikk ut like mange undergrupper som vi satte inn.
      // expect(undergrupper.length).to.equal(3);

      // Sjekk at undergruppene som kom ut er identiske med de som ble satt inn.
      expect(undergrupper).to.containSubset([testUndergruppe1, testUndergruppe2, testUndergruppe3]);
    });
  });

  it('Hent alle undergruppene til et kollektiv', () => {

    return axios.post('http://localhost:9100/rest/undergrupperForKollektiv/' + testKollektiv1.kollektiv_id).then(response => {
      let undergrupper = response.data;
      // Sjekk at vi fikk ut like mange undergrupper som vi satte inn.
      expect(undergrupper.length).to.equal(2);

      // Sjekk at undergruppene som kom ut er identiske med de som ble satt inn.
      expect(undergrupper).to.containSubset([testUndergruppe1, testUndergruppe2]);
    });
  });

  it('Hent hovedgruppen til et kollektiv', () => {

    return axios.post('http://localhost:9100/rest/hovedgruppenForKollektiv/' + testKollektiv1.kollektiv_id).then(response => {
      let undergrupper = response.data;
      // Sjekk at vi fikk ut en undergruppe.
      expect(undergrupper.length).to.equal(1);

      // Sjekk at undergruppen som kom ut er identiske med de som ble satt inn.
      //expect(undergrupper).to.containSubset([testUndergruppe1]);
    });
  });

  it('Hent hovedgruppen til et kollektiv', () => {

    return axios.post('http://localhost:9100/rest/undergrupperForBruker/' + testUser1.bruker_id).then(response => {
      let undergrupper = response.data;
      // Sjekk at vi fikk ut like mange undergrupper som vi satte inn.
      expect(undergrupper.length).to.equal(4);

      // Sjekk at undergruppene som kom ut er identiske med de som ble satt inn.
      expect(undergrupper).to.containSubset([testUndergruppe1, testUndergruppe2]);
    });
  });

  it('Legg til en bruker i en undergruppe', () => {

    return axios.post('http://localhost:9100/rest/undergruppeLeggTilBruker/' +  testUndergruppe1.undergruppe_id, testUser2).then(response => {
      return axios.get('http://localhost:9100/rest/medlemmerIUndergruppe/' + testUndergruppe1.undergruppe_id).then(response => {
        let brukere = response.data;
        expect(brukere.length).to.equal(3);
        // Sjekk at brukeren som kom ut inneholder den som ble satt inn.
        expect(brukere).to.containSubset([testUser1, testUser2, testUser3]);
      });
    });
  });

  it('Fjern en bruker fra en undergruppe', () => {

    return axios.put('http://localhost:9100/rest/undergruppeFjernBruker/' +  testUndergruppe1.undergruppe_id, testUser3).then(response => {
      return axios.get('http://localhost:9100/rest/medlemmerIUndergruppe/' + testUndergruppe1.undergruppe_id).then(response => {
        let brukere = response.data;
        expect(brukere.length).to.equal(1);
        // Sjekk at brukeren som kom ut inneholder den som ble satt inn.
        expect(brukere).to.containSubset([testUser1]);
      });
    });
  });

  it('Oppdater kollektiv', () => {

    let newImfo = {
      undergruppe_id: testUndergruppe1.undergruppe_id,
      navn: "Updated",
      beskrivelse: "Denne gruppen er oppdatert"
    };

    return axios.put('http://localhost:9100/rest/undergruppe/', newImfo)
      .then(response => {
        return axios.get('http://localhost:9100/rest/undergruppe/' + newImfo.undergruppe_id).then(response => {
          expect(response.data).to.containSubset(newImfo);
        });
      });
  });

  it.skip('Slett undergruppe',() => {

    return axios.delete('http://localhost:9100/rest/undergruppe/' + testUndergruppe1.undergruppe_id)
      .then(response => {
        return axios.get('http://localhost:9100/rest/undergruppe/' + testUndergruppe1.undergruppe_id)
      }).then(response => {
        expect(response.data).to.equal('Undergruppe not found!');
      });
  });
});
