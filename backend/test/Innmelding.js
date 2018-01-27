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

let testUser2 = {
    epost: 'test2@test.com',
    fornavn: 'Test2',
    etternavn: 'Testesen2',
    tlf: '12345679',
    adresse: 'Testveien 2',
    hashed_passord: 'passord',
  };

let testKollektiv = {navn: 'testkollektiv', beskrivelse: ''};
let testKollektiv2 = {navn: 'testkollektiv2', beskrivelse: ''};

let testUndergruppe = {
  navn: 'testgruppe',
  beskrivelse: '',
  kollektiv_id: null
};

let testUndergruppe2 = {
    navn: 'testgruppe2',
    beskrivelse: '',
    kollektiv_id: null
};

// Innmelding fra admin (invitasjon)
let testInnmelding1 = {
    kollektiv_id: null,
    bruker_epost: 'invitert@test.com',
    status_admin: 1,
    status_bruker: 2,
    dato_svar_admin: 1516773429000,
    dato_svar_bruker: null,
    aktiv: 1,
    notat_admin: null,
    notat_bruker: null
};

// Innmelding fra ukjent bruker (søknad)
let testInnmelding2 = {
    kollektiv_id: null,
    bruker_epost: 'soker@test.com',
    status_admin: 2,
    status_bruker: 1,
    dato_svar_admin: null,
    dato_svar_bruker: 1516773895000,
    aktiv: 1,
    notat_admin: null,
    notat_bruker: null
};

// Invitasjon til kjent bruker
let testInnmelding3 = {
    kollektiv_id: null,
    bruker_epost: 'test2@test.com',
    status_admin: 1,
    status_bruker: 2,
    dato_svar_admin: 1516773898000,
    dato_svar_bruker: null,
    aktiv: 1,
    notat_admin: null,
    notat_bruker: null
};

// Innmelding fra ukjent bruker (søknad)
let testInnmelding4 = {
    kollektiv_id: null,
    bruker_epost: 'soker2@test.com',
    status_admin: 2,
    status_bruker: 1,
    dato_svar_admin: null,
    dato_svar_bruker: 1516773895000,
    aktiv: 1,
    notat_admin: null,
    notat_bruker: null
};

let userNotExistEmailReply = '<html xmlns=http://www.w3.org/1999/xhtml">   <head>       <title>Registrering</title>       <meta http-equiv="refresh" content="0;URL="http://localhost:8080/#/Register" />   </head>   <body>       <p>Du sendes nå til registreringssiden...</p>   </body></html>'

describe.skip('Innmelding',() => {

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
          
          return axios.post(restServer + 'bruker/', testUser2);
        }).then(response => {
          // Finn ut hvilken bruker_id testuser fikk, og legg til i testuser objektet vårt
          testUser2.bruker_id = response.data.insertId;
          // Legg inn testKollektiv i basen. testUser1 blir admin.
          return axios.post(restServer + 'kollektiv/' + testUser.bruker_id, testKollektiv);
        }).then(response => {
          testKollektiv.kollektiv_id = response.data.insertId;
  
          // Legg inn testUndergruppe i basen.
          testUndergruppe.kollektiv_id = testKollektiv.kollektiv_id;
          return axios.post(restServer + 'undergruppe/' + testUser.bruker_id, testUndergruppe);
        }).then(response => {
          testUndergruppe.undergruppe_id = response.data.insertId;


        // Legg inn testKollektiv2 i basen. testUser blir admin.
            return axios.post(restServer + 'kollektiv/' + testUser.bruker_id, testKollektiv2);
        }).then(response => {
            testKollektiv2.kollektiv_id = response.data.insertId;

        // Legg inn testUndergruppe2 i basen.
            testUndergruppe2.kollektiv_id = testKollektiv2.kollektiv_id;
            return axios.post(restServer + 'undergruppe/' + testUser.bruker_id, testUndergruppe2);
        }).then(response => {
            testUndergruppe2.undergruppe_id = response.data.insertId;

            // Klargjør testInnmeldinger
            testInnmelding1.kollektiv_id = testKollektiv.kollektiv_id;
            testInnmelding2.kollektiv_id = testKollektiv.kollektiv_id;
            testInnmelding3.kollektiv_id = testKollektiv2.kollektiv_id;
            testInnmelding4.kollektiv_id = testKollektiv.kollektiv_id;

            // Legg til testInnmeldingene i databasen.
            return axios.post(restServer + 'innmelding/', testInnmelding1);
                }).then(response => {
            return axios.post(restServer + 'innmelding/', testInnmelding2);
                }).then(response => {
            return axios.post(restServer + 'innmelding/', testInnmelding3);
                }).then(response => {
            return axios.post(restServer + 'innmelding/', testInnmelding4);
                }).then(response => {
                    // Ferdig med oppsett!
                });
            });

    // Hent ut tre spesifikke testInnmeldinger og sammenlign
    it('Hent 3 fullstendige innmeldinger', () => {
        // Hent ut testHandleliste og sammenlign
        //console.log('       Henter #1...');
        return axios.get(restServer + 'innmelding/' + testKollektiv.kollektiv_id + '?bruker_epost=' + 'invitert@test.com').then((response) => {
            // Vi forventer nå at objektet fra basen inneholder test-objektet vårt som vi la inn tidligere.
            expect(response.data).to.containSubset(testInnmelding1);       

            //console.log('       Henter #2...');
            return axios.get(restServer + 'innmelding/' + testKollektiv.kollektiv_id + '?bruker_epost=' + 'soker@test.com').then((response) => {
                // Vi forventer nå at objektet fra basen inneholder test-objektet vårt som vi la inn tidligere.
                expect(response.data).to.containSubset(testInnmelding2);

                //console.log('       Henter #3...');
                return axios.get(restServer + 'innmelding/' + testKollektiv2.kollektiv_id + '?bruker_epost=' + 'test2@test.com').then((response) => {
                    // Vi forventer nå at objektet fra basen inneholder test-objektet vårt som vi la inn tidligere.
                    expect(response.data).to.containSubset(testInnmelding3);
                });
            });
        });
    });
    
    // Hent ut alle for et kollektiv og sammenlign
    it('Hent alle innmeldinger for kollektivet', () => {
        // Hent ut testHandleliste og sammenlign
        return axios.get(restServer + 'innmeldingerForKollektiv/' + testKollektiv.kollektiv_id).then((response) => {
            // Vi forventer nå at objektet fra basen inneholder test-objektene som vi la inn tidligere.
            expect(response.data).to.containSubset([testInnmelding1,testInnmelding2,testInnmelding4]);
        });
    });
    
    // Hent ut alle invitasjoner for et kollektiv og sammenlign
    it('Hent alle invitasjoner for kollektivet', () => {
        // Hent ut testHandleliste og sammenlign
        return axios.get(restServer + 'invitasjonerForKollektiv/' + testKollektiv.kollektiv_id).then((response) => {
            // Vi forventer nå at objektet fra basen inneholder test-objektene som vi la inn tidligere.
            expect(response.data).to.containSubset([testInnmelding1]);
        });
    });

    // Hent ut alle søknader for et kollektiv og sammenlign
    it('Hent alle søknader for kollektivet', () => {
        // Hent ut testHandleliste og sammenlign
        return axios.get(restServer + 'soknaderForKollektiv/' + testKollektiv.kollektiv_id).then((response) => {
            // Vi forventer nå at objektet fra basen inneholder test-objektene som vi la inn tidligere.
            expect(response.data).to.containSubset([testInnmelding2,testInnmelding4]);
        });
    });

    // Hent ut absolutt alle og sammenlign
    it('Hent absolutt alle innmeldinger', () => {
        // Hent ut testHandleliste og sammenlign
        return axios.get(restServer + 'innmelding/').then((response) => {
            // Vi forventer nå at objektet fra basen inneholder test-objektene som vi la inn tidligere.
            expect(response.data).to.containSubset([testInnmelding1,testInnmelding2,testInnmelding3,testInnmelding4]);
        });
    });
    
    // Bruker klikker defekt lenke fra epost:
    it('Klikk lenke med feil i data', () => {
        return axios.get(restServer + 'invitasjon/' + testKollektiv.kollektiv_id + '?bruker_epost=' + 'finnesikke@test.com' +'&bruker_svar=hellno').then((response) => {
            // Vi forventer nå å få tilbake 'null' 
            expect(response.data).to.containSubset(null);
        });
    });

    // Ukjent bruker klikker lenke fra epost:
    it('Klikk lenke fra epost (ukjent bruker)', () => {
        // Hent ut testHandleliste og sammenlign
        return axios.get(restServer + 'invitasjon/' + testKollektiv.kollektiv_id + '?bruker_epost=' + 'invitert@test.com' +'&bruker_svar=jatakk').then((response) => {
            // Vi forventer nå en standard streng som lar brukeren registrere seg
            expect(response.data).to.containSubset(userNotExistEmailReply);
        });
    });

    // Bruker klikker lenke fra epost:
    it('Klikk lenke fra epost (eksisterende bruker)', () => {
        return axios.get(restServer + 'invitasjon/' + testKollektiv2.kollektiv_id + '?bruker_epost=' + 'test2@test.com' +'&bruker_svar=jatakk').then((response) => {
            if(response.data[0] != null){    
                // Vi forventer nå at testInnmelding1 har blitt oppdatert slik:
                let newExpectation = {
                    kollektiv_id: testInnmelding3.kollektiv_id,
                    bruker_epost: testInnmelding3.bruker_epost,
                    status_admin: testInnmelding3.status_admin,
                    status_bruker: 1,
                    dato_svar_admin: testInnmelding3.dato_svar_admin,
                    dato_svar_bruker: testInnmelding3.dato_svar_bruker,
                    aktiv: 0,
                    notat_admin: testInnmelding3.notat_admin,
                    notat_bruker: testInnmelding3.notat_bruker
                };
                
                // This is needed because the timestamp can't be predicted in anvance:
                if(response.data[0].dato_svar_bruker != undefined && response.data[0].dato_svar_bruker > 0){
                    newExpectation.dato_svar_bruker=response.data[0].dato_svar_bruker;
                };
                expect(response.data).to.containSubset([newExpectation]);
            }else{
                console.log('Response.data[0] was null. We expected an updated Innmelding...')
                expect.fail('Response.data[0] was null. We expected an updated Innmelding...');
            };
        });
    });


    it('Sjekk at det er sendt ut notifikasjoner relatert til innmeldinger', () => {
        
    // //  Av en eller annen grunn må det ventes, og kjøres en ekstra spørring for at databasen skal få med seg alle handlingene fra beforeEach()....?
    //     console.log('      ...');
    //     let endTime = (new Date).getTime() + (8 * 1000);
    //     while((new Date).getTime() < endTime){ }; // Do nothing while waiting...
    //     let crappyWorkaround1 = axios.get(restServer + 'notifikasjon/' + testUser.bruker_id + '/alle' );
    //     let crappyWorkaround2 = axios.get(restServer + 'notifikasjon/' + testUser.bruker_id + '/alle' );
        

    //  Den faktiske testen:
        return axios.get(restServer + 'notifikasjon/' + testUser.bruker_id + '/alle' ).then((response) => {
            console.log('      Number of notifications: ' + response.data.length);
            let newNotification2 = {
                opprettet: response.data[0].opprettet, // Her kopieres tidspunktet fordi vi ikke kan forutsi det før testen starter.
                tekst: 'soker@test.com har søkt om tilgang til et kollektiv',
                lest:0,
                id:1,
                bruker_id:testUser.bruker_id
              };

            let newNotification4 = {
                opprettet: response.data[1].opprettet,
                tekst: 'soker2@test.com har søkt om tilgang til et kollektiv',
                lest:0,
                id:2,
                bruker_id:testUser.bruker_id
            };

            expect(response.data).to.containSubset([newNotification2,newNotification4]);
        });
    });
});
