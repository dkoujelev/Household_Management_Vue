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

let testKollektiv1 = {navn: 'testkollektiv', beskrivelse: ''};

let testKollektiv2 = {navn: 'kollektivtesten', beskrivelse: 'tester'};

let testUndergruppe = {
  navn: 'testgruppe',
  beskrivelse: '',
  kollektiv_id: null
};

let testListe = {
  navn: "TestVask"
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


describe('Kollektiv',() => {

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

        // Legg testUser2 inn i basen
        return axios.post('http://localhost:9100/rest/bruker/', testUser2);
      }).then(response => {
        // Finn ut hvilken bruker_id testuser fikk, og legg til i testuser objektet vårt
        testUser2.bruker_id = response.data.insertId;

        // Legg in testKollektiv1 i basen. testUser1 blir admin.
        return axios.post('http://localhost:9100/rest/kollektiv/' + testUser1.bruker_id, testKollektiv1);
      }).then(response => {
        testKollektiv1.kollektiv_id = response.data.insertId;

        // Legg in testKollektiv2 i basen. testUser2 blir admin.
        return axios.post('http://localhost:9100/rest/kollektiv/' + testUser2.bruker_id, testKollektiv2);
      }).then(response => {
        testKollektiv2.kollektiv_id = response.data.insertId;

        // Legg in testUndergruppe i basen.
        testUndergruppe.kollektiv_id = testKollektiv1.kollektiv_id;
        return axios.post('http://localhost:9100/rest/undergruppe/' + testUser1.bruker_id, testUndergruppe);
      }).then(response => {
        testUndergruppe.undergruppe_id = response.data.insertId;

        // Legg in testListe i basen.
        testListe.undergruppe_id = testUndergruppe.undergruppe_id;
        return axios.post('http://localhost:9100/rest/gjoremalsliste/' + testUndergruppe.undergruppe_id, testListe);
      }).then(response => {
        testListe.id = response.data.insertId;
      });
  });

  it('Hent et kollletiv med bestemt id', () => {
    // Hent ut testuser og sammenlign
    return axios.get('http://localhost:9100/rest/kollektiv/' + testKollektiv2.kollektiv_id).then(response => {

      // Vi forventer nå at brukerobjektet fra basen er helt likt testuser-objektet vårt som vi la inn tidligere.
      expect(response.data).to.containSubset(testKollektiv2);

    });
  });

  it('Hent et kollektiv med navn', () => {

    return axios.get('http://localhost:9100/rest/kollektivMedNavn/' + testKollektiv1.navn).then((response) => {
      let kollektiver = response.data;

      // Sjekk at brukerne som kom ut er identiske med de som ble satt inn.
      expect(kollektiver).to.containSubset(testKollektiv1);
    });
  });

  it('Hent alle kollektiv', () => {
    return axios.get('http://localhost:9100/rest/kollektiv').then((response) => {
      let kollektiver = response.data;
      // Sjekk at vi fikk ut like mange kollektiver som vi satte inn.
      expect(kollektiver.length).to.equal(2);

      // Sjekk at kollektivene som kom ut er identiske med de som ble satt inn.
      expect(kollektiver).to.containSubset([testKollektiv1, testKollektiv2]);
    });
  });

  it('Meld bruker inn i kollektiv', () => {
    let data = {
      bruker_id: testUser1.bruker_id,
      kollektiv_id: testKollektiv2.kollektiv_id
    };
    return axios.post('http://localhost:9100/rest/meldBrukerInnIKollektiv/', data).then(response => {
        return axios.get('http://localhost:9100/rest/kollektivForBruker/' + testUser1.bruker_id).then((response) => {
          let kollektiver = response.data;

          // Sjekk at vi fikk ut like mange gjoremal som vi satte inn.
          expect(kollektiver.length).to.equal(2);
          });
      });
  });

  it('Hent alle kollektiv til en bruker', () => {

    return axios.get('http://localhost:9100/rest/kollektivForBruker/' + testUser1.bruker_id).then((response) => {
      let kollektiver = response.data;

      // Sjekk at vi fikk ut like mange gjoremal som vi satte inn.
      expect(kollektiver.length).to.equal(1);

      // Sjekk at brukerne som kom ut er identiske med de som ble satt inn.
      expect(kollektiver).to.containSubset([testKollektiv1]);
    });
  });

  it('Hent alle kollektiv til en bruker hvor han er admin', () => {

    return axios.get('http://localhost:9100/rest/kollektivForAdmin/' + testUser1.bruker_id).then((response) => {
      let gjoremaler = response.data;

      // Sjekk at vi fikk ut like mange gjoremal som vi satte inn.
      expect(gjoremaler.length).to.equal(1);

      // Sjekk at brukerne som kom ut er identiske med de som ble satt inn.
      expect(gjoremaler).to.containSubset([testKollektiv1]);
    });
  });

  it('Oppdater kollektiv', () => {

    let newImfo = {
      kollektiv_id: testKollektiv1.kollektiv_id,
      navn: "Updated"
    };

    return axios.put('http://localhost:9100/rest/kollektiv', newImfo)
      .then(response => {
        return axios.get('http://localhost:9100/rest/kollektiv/' + newImfo.kollektiv_id).then(response => {
          expect(response.data).to.containSubset(newImfo);
        });
      });
  });

  it.skip('Slett kollektiv',() => {

    return axios.delete('http://localhost:9100/rest/kollektiv/' + testListe.id)
      .then(response => {
        return axios.get('http://localhost:9100/rest/kollektiv/' + testListe.id)
      }).then(response => {
        expect(response.data).to.equal('Kollektiv not found!');
      });
  });
});
