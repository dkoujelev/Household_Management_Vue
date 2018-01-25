let expect = require('chai').expect;
let axios = require('axios');
let clearDB = require('./testutil').clearDB;
let serverConfig = require('./testutil').serverConfig();
let restServer = 'http://' + serverConfig.serverAddress + ':' + serverConfig.serverPort + '/rest/';

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


describe('Handeliste',() => {

  // Legg inn et par testusers i basen. Begge testusers er medlem i test_kollektiv som også ligger i basen.
  // Basen tømmes og dette innholdet legges inn på nytt før hver test kjøres

  beforeEach(() => {
    // OBS: Vi må RETURNERE hele kjeden til testbiblioteket vårt, derfor return før clearDB.
    return clearDB()     // Vi må først nullstille testbasen
      .then((response) => {
        // Legg testUser inn i basen
        return axios.post(restServer + 'bruker/', testUser);
      }).then(response => {
        // Finn ut hvilken bruker_id testuser fikk, og legg til i testuser objektet vårt
        testUser.bruker_id = response.data.insertId;

        // Legg in testKollektiv i basen. testUser1 blir admin.
        return axios.post(restServer + 'kollektiv/' + testUser.bruker_id, testKollektiv);
      }).then(response => {
        testKollektiv.kollektiv_id = response.data.insertId;

        // Legg in testUndergruppe i basen.
        testUndergruppe.kollektiv_id = testKollektiv.kollektiv_id;
        return axios.post(restServer + 'undergruppe/' + testUser.bruker_id, testUndergruppe);
      }).then(response => {
        testUndergruppe.undergruppe_id = response.data.insertId;

        // Legg in testHandleliste1 i basen.
        testHandleliste1.undergruppe_id = testUndergruppe.undergruppe_id;
        return axios.post(restServer + 'handleliste/', testHandleliste1);
      }).then(response => {
        testHandleliste1.handleliste_id = response.data.insertId;

        // Legg in testHandleliste2 i basen.
        testHandleliste2.undergruppe_id = testUndergruppe.undergruppe_id;
        return axios.post(restServer + 'handleliste/', testHandleliste2);
      }).then(response => {
        testHandleliste2.handleliste_id = response.data.insertId;

        // Legg in testVare1 i basen.
        testVare1.handleliste_id = testHandleliste1.handleliste_id;
        return axios.post(restServer + 'vare/', testVare1);
      }).then(response => {
        testVare1.vare_id = response.data.insertId;

        // Legg in testVare2 i basen.
        testVare2.handleliste_id = testHandleliste1.handleliste_id;
        return axios.post(restServer + 'vare/', testVare2);
      }).then(response => {
        testVare2.vare_id = response.data.insertId;

        // Legg in testVare3 i basen.
        testVare3.handleliste_id = testHandleliste1.handleliste_id;
        return axios.post(restServer + 'vare/', testVare3);
      }).then(response => {
        testVare3.vare_id = response.data.insertId;

        // Legg in testVare4 i basen.
        testVare4.handleliste_id = testHandleliste2.handleliste_id;
        return axios.post(restServer + 'vare/', testVare4);
      }).then(response => {
        testVare4.vare_id = response.data.insertId;
      }).catch(exception => {
        console.log(exception);
      });
  });

  it('Hent en fullstendig handleliste med id', () => {
    // Hent ut testHandleliste og sammenlign
    return axios.get(restServer + 'handleliste/' + testHandleliste1.handleliste_id).then((response) => {
      // Vi forventer nå at objektet fra basen inneholder test-objektet vårt som vi la inn tidligere.
      expect(response.data).to.containSubset(testHandleliste1);

    });
  });

  it('Hent alle lister til en undergruppe varer i en liste', () => {

    return axios.get(restServer + 'handlelisteForUndergruppe/' + testHandleliste1.undergruppe_id).then((response) => {
      let lister = response.data;
      expect(lister.length).to.equal(2);
      expect(lister).to.containSubset([testHandleliste1, testHandleliste2]);
    });
  });

  it('Hent alle lister som en bruker har tilgang til', () => {

    return axios.get(restServer + 'handlelisteForBruker/' + testUser.bruker_id).then((response) => {
      let lister = response.data;
      expect(lister.length).to.equal(2);
      expect(lister).to.containSubset([testHandleliste1, testHandleliste2]);
    });
  });

  it('Oppdater handleliste', () => {

    let newImfo = {
      handleliste_id: testHandleliste1.handleliste_id,
      navn: "Updated",
      beskrivelse: "Denne listen er oppdatert"
    };

    return axios.put(restServer + 'handleliste/' + newImfo.handleliste_id, newImfo)
      .then(response => {
        return axios.get(restServer + 'handleliste/' + newImfo.handleliste_id).then(response => {
          expect(response.data).to.containSubset(newImfo);
        });
      });
  });

  it('Slett handleliste',() => {

    return axios.delete(restServer + 'handleliste/' + testHandleliste1.handleliste_id)
      .then(response => {
        return axios.get(restServer + 'handleliste/' + testHandleliste1.handleliste_id)
      }).then(response => {
        expect(response.data).to.equal('Shoppinglist not found!');
      });
  });

  it('Favorittiser en handleliste', () => {
    let newImfo = {
      handleliste_id: testHandleliste1.handleliste_id,
      navn: "Updated",
      beskrivelse: "Denne listen er oppdatert",
      favoritt: 1
    };

    return axios.put(restServer + 'favorittHandleliste/', newImfo).then(response => {
      return axios.get(restServer + 'handleliste/' + newImfo.handleliste_id).then(response => {
        expect(response.data.favoritt).to.equal(newImfo.favoritt);
      });
    });
  });
});
