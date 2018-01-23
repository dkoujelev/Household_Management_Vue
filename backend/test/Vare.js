let expect = require('chai').expect;
let axios = require('axios');
let clearDB = require('./testutil').clearDB;


let testUser = {
  epost: 'test@test.com',
  fornavn: 'Test',
  etternavn: 'Testesen',
  tlf: '12345678',
  adresse: 'Testveien 1',
  hashed_passord: 'passord',
};

let testKollektiv = {navn: 'testkollektiv', beskrivelse: ''};

let testUndergruppe = {
  navn: 'testgruppe',
  beskrivelse: '',
  kollektiv_id: null
};

let testHandleliste1 = {
  navn: "TestListe",
  beskrivelse: "Test"
};

let testHandleliste2 = {
  navn: "AnnenListe",
  beskrivelse: ""
};

let testVare1 = {
  navn: "Melk",
  antall: 3
};

let testVare2 = {
  navn: "Egg",
  antall: 12
};

let testVare3 = {
  navn: "Ost",
  antall: 1
};

let testVare4 = {
  navn: "Kjøtt",
  antall: 24
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


describe.skip('Vare',() => {

  // Legg inn et par testusers i basen. Begge testusers er medlem i test_kollektiv som også ligger i basen.
  // Basen tømmes og dette innholdet legges inn på nytt før hver test kjøres

  beforeEach(() => {
    // OBS: Vi må RETURNERE hele kjeden til testbiblioteket vårt, derfor return før clearDB.
    return clearDB()     // Vi må først nullstille testbasen
      .then((response) => {
        // Legg testUser inn i basen
        return axios.post('http://localhost:9100/rest/bruker/', testUser);
      }).then(response => {
        // Finn ut hvilken bruker_id testuser fikk, og legg til i testuser objektet vårt
        testUser.bruker_id = response.data.insertId;

        // Legg in testKollektiv i basen. testUser1 blir admin.
        return axios.post('http://localhost:9100/rest/kollektiv/' + testUser.bruker_id, testKollektiv);
      }).then(response => {
        testKollektiv.kollektiv_id = response.data.insertId;

        // Legg in testUndergruppe i basen.
        testUndergruppe.kollektiv_id = testKollektiv.kollektiv_id;
        return axios.post('http://localhost:9100/rest/undergruppe/' + testUser.bruker_id, testUndergruppe);
      }).then(response => {
        testUndergruppe.undergruppe_id = response.data.insertId;

        // Legg in testHandleliste1 i basen.
        testHandleliste1.undergruppe_id = testUndergruppe.undergruppe_id;
        return axios.post('http://localhost:9100/rest/handleliste/', testHandleliste1);
      }).then(response => {
        testHandleliste1.handleliste_id = response.data.insertId;

        // Legg in testHandleliste2 i basen.
        testHandleliste2.undergruppe_id = testUndergruppe.undergruppe_id;
        return axios.post('http://localhost:9100/rest/handleliste/', testHandleliste2);
      }).then(response => {
        testHandleliste2.handleliste_id = response.data.insertId;

        // Legg in testVare1 i basen.
        testVare1.handleliste_id = testHandleliste1.handleliste_id;
        return axios.post('http://localhost:9100/rest/vare/', testVare1);
      }).then(response => {
        testVare1.vare_id = response.data.insertId;

        // Legg in testVare2 i basen.
        testVare2.handleliste_id = testHandleliste1.handleliste_id;
        return axios.post('http://localhost:9100/rest/vare/', testVare2);
      }).then(response => {
        testVare2.vare_id = response.data.insertId;

        // Legg in testVare3 i basen.
        testVare3.handleliste_id = testHandleliste1.handleliste_id;
        return axios.post('http://localhost:9100/rest/vare/', testVare3);
      }).then(response => {
        testVare3.vare_id = response.data.insertId;

        // Legg in testVare4 i basen.
        testVare4.handleliste_id = testHandleliste2.handleliste_id;
        return axios.post('http://localhost:9100/rest/vare/', testVare4);
      }).then(response => {
        testVare4.vare_id = response.data.insertId;
      }).catch(exception => {
          console.log(exception);
      });
  });

  it('Hent en vare med id', () => {
    // Hent ut testuser og sammenlign
    return axios.get('http://localhost:9100/rest/vare/' + testVare1.vare_id).then((response) => {
      console.log(response.data.length);
      // Vi forventer nå at brukerobjektet fra basen er helt likt testuser-objektet vårt som vi la inn tidligere.
      expect(response.data).to.containSubset([testVare1]);

    });
  });

  it('Hent alle varer i en liste', () => {

    return axios.get('http://localhost:9100/rest/varer/' + testHandleliste1.handleliste_id).then((response) => {
      let varer = response.data;
      expect(varer.length).to.equal(3);
      expect(varer).to.containSubset([testVare1, testVare2, testVare3]);
    }).then(response => {
      return axios.get('http://localhost:9100/rest/varer/' + testHandleliste2.handleliste_id).then((response) => {
        let varer = response.data;
        expect(varer.length).to.equal(1);
        expect(varer).to.containSubset([testVare4]);
      });
    });
  });

  it('Oppdater vare', () => {

    let newImfo = {
      vare_id: testVare1.vare_id,
      navn: "Updated",
      antall: 9001
    };

    return axios.put('http://localhost:9100/rest/vare/', newImfo)
      .then(response => {
        return axios.get('http://localhost:9100/rest/vare/' + newImfo.vare_id).then(response => {
          expect(response.data).to.containSubset([newImfo]);
        });
      });
  });

  it.skip('Slett vare',() => {

    return axios.delete('http://localhost:9100/rest/vare/' + testVare1.vare_id)
      .then(response => {
        return axios.get('http://localhost:9100/rest/vare/' + testVare1.vare_id)
      }).then(response => {
        expect(response.data).to.equal('Item not found!');
      });
  });
});
