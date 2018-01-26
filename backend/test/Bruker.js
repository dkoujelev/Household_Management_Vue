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

let testuser1_oldpass = 'passord'; // stupid hack

let testuser2 = {
  epost: 'test@test2.com',
  fornavn: 'Test2',
  etternavn: 'Testesen',
  tlf: '12345678',
  adresse: 'Testveien 2',
  hashed_passord: 'passord'
};

let test_kollektiv = {navn: 'testkollektiv', beskrivelse: ''};

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


describe('Bruker',() => {

  // Legg inn et par testusers i basen. Begge testusers er medlem i test_kollektiv som også ligger i basen.
  // Basen tømmes og dette innholdet legges inn på nytt før hver test kjøres.

  beforeEach(() => {
    // OBS: Vi må RETURNERE hele kjeden til testbiblioteket vårt, derfor return før clearDB.
    return clearDB()     // Vi må først nullstille testbasen
    .then((response) => {
      // Legg testuser inn i basen
      return axios.post(restServer + 'bruker', testuser);
    }).then(response => {
      // Finn ut hvilken bruker_id testuser fikk, og legg til i testuser objektet vårt
      testuser.bruker_id = response.data.insertId;
      // Vi bryr oss ikke om å sammenligne passord i denne testen, så passord fjernes før objektene sammenlignes
      delete testuser.hashed_passord;
      // Legg testuser2 inn i basen
      return axios.post(restServer + 'bruker', testuser2);
    }).then(response => {
        // Finn ut hvilken bruker_id testuser2 fikk, og legg til i testuser objektet vårt
      testuser2.bruker_id = response.data.insertId;
      // Vi bryr oss ikke om å sammenligne passord i denne testen, så passord fjernes før objektene sammenlignes
      delete testuser2.hashed_passord;
      // Legg in test_kollektiv i basen. testuser blir admin.
      return axios.post(restServer + 'kollektiv/' + testuser.bruker_id, test_kollektiv);
    }).then(response => {
      test_kollektiv.kollektiv_id = response.data.insertId;


      let data = {
        bruker_id: testuser2.bruker_id,
        kollektiv_id: test_kollektiv.kollektiv_id
      };
        // testuser ligger allerede inne i kollektivet pga han som "oppretta" det over.
        // Trenger kun å legge inn testuser2 i testkollektivet.
      return axios.post(restServer + 'meldBrukerInnIKollektiv', data);
    });
  });

  it('Hent bruker med bestemt id', () => {
    // Hent ut testuser og sammenlign
    return axios.get(restServer + 'bruker/' + testuser.bruker_id).then(response => {

      // Sjekk at passorded ble satt/hashet rett
      expect(bcrypt.compareSync(testuser1_oldpass, response.data.hashed_passord)).to.be.true;

      // Vi bryr oss ikke om å sammenligne passord i denne testen, så passord fjernes før objektene sammenlignes
      delete response.data.hashed_passord;

      // Vi forventer nå at brukerobjektet fra basen er helt likt testuser-objektet vårt som vi la inn tidligere.
      expect(response.data).to.deep.equal(testuser);

    });
  });

  it('Hent bruker med bestemt epost', () => {
    // Hent ut testuser fra basen, ved å oppgi brukerens epost.
    return axios.get(restServer + 'brukerMedEpost/' + testuser.epost).then(response => {
      delete response.data.hashed_passord;

      // Sjekk at brukerobjektet vi fikk ut fra REST er likt det vi putta inn.
      expect(response.data).to.deep.equal(testuser);
    });
  });

  it('Hent alle brukere', () => {

    return axios.get(restServer + 'bruker').then((response) => {
      let users = response.data;

      // Sjekk at vi fikk ut like mange brukere som vi satte inn.
      expect(users.length).to.equal(2);

      // Fjern passord fra brukerlista vi fikk ut, skal ikke sjekkes.
      users.forEach(v => { delete v.hashed_passord });

      // Sjekk at brukerne som kom ut er identiske med de som ble satt inn.
      expect(users).to.have.deep.members([testuser, testuser2]);
    });
  });

  it('Sjekk om en bruker er registrert', () => {

    return axios.get(restServer + 'brukerepost/' + testuser.epost).then(response => {
      delete response.data.hashed_passord;

      expect(response.data).to.deep.equal({exists: true});

      return axios.get(restServer + 'brukerepost/' + 'epost@somikke.finnes');
    })
    .then(response => {
      delete response.data.hashed_passord;

      expect(response.data).to.deep.equal({exists: false});
    });
  });

  it('Hent alle brukere i et bestemt kollektiv', () => {
    return axios.get(restServer + 'brukereIKollektiv/' + test_kollektiv.kollektiv_id).then(response => {

      let users = response.data;

      users.forEach(v => { delete v.hashed_passord });

      expect(users).to.have.deep.members([testuser, testuser2]);
    });
  });

  it('Oppdater bruker', () => {

    let old_user = {
      epost: 'test2@test.com',
      fornavn: 'Test',
      etternavn: 'Testesen',
      tlf: '12345678',
      adresse: 'Testveien 1',
      hashed_passord: 'passord'
    };

    let new_user = {
      epost: 'nyepost@test.com',
      fornavn: 'nyttnavn',
      etternavn: 'nyttetternavn',
      tlf: 'nytt nummer',
      adresse: 'ny adresse'
    };

    return axios.post(restServer + 'bruker', old_user)
    .then(response => {
      new_user.bruker_id = response.data.insertId;
      return axios.put(restServer + 'bruker', new_user);
    }).then(response => {
      return axios.get(restServer + 'bruker/' + new_user.bruker_id);
    }).then(response => {
      delete response.data.hashed_passord;

      expect(response.data).to.deep.equal(new_user);
    });
  });

  //Change password
  it('Endre passord',() => {
    let user = {
      epost: 'test3@test.com',
      fornavn: 'Test',
      etternavn: 'Testesen',
      tlf: '12345678',
      adresse: 'Testveien 1',
      hashed_passord: 'passord'
    };

    return axios.post(restServer + 'bruker', user)
    .then(response => {
      user.bruker_id = response.data.insertId;
    return axios.post(restServer + 'login', {epost: user.epost, passord: user.hashed_passord});
    }).then(response => {
      console.log(response.headers);

      let data = {
        "email": user.epost,
        "newPassword": "nyttpassord"
      };

      headers = {
        cookie: response.headers["set-cookie"]

      };
    return axios.put(restServer + 'changePassword', data);
    }).then(response => {
      return axios.get(restServer + 'bruker/' + user.bruker_id);
    }).then(response => {
      expect(bcrypt.compareSync("nyttpassord", response.data.hashed_passord)).to.be.true;
      expect(bcrypt.compareSync(user.hashed_passord, "blehhhhh")).to.be.false;
    });
  });
});
