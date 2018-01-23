let util = require("../util");

module.exports = function(connection, server) {

  // Hent alle innmeldinger
  server.get('rest/innmelding/', function (req, res, next) {
    console.log('DEBUG - rest/innmelding/');
    //[{"bruker_id":1,"kollektiv_id":1,"status_admin":1,"status_bruker":9,"dato_svar_admin":"2018-01-15T11:12:12.000Z","dato_svar_bruker":null,"aktiv":1,"notat_admin":"Kommer flyttende i mars.","notat_bruker":null},
    // {"bruker_id":2,"kollektiv_id":1,"status_admin":1,"status_bruker":1,"dato_svar_admin":"2018-01-12T09:21:00.000Z","dato_svar_bruker":"2018-01-12T13:22:20.000Z","aktiv":0,"notat_admin":null,"notat_bruker":null}]
    connection.query("SELECT * FROM Innmelding", function (err, rows, fields) {
      res.send(err ? err : rows);
      return next();
    });
  });

// Hent alle innmeldinger
  server.get('rest/innmeldingerForKollektiv/:kollektiv_id', function (req, res, next) {
    console.log('DEBUG - rest/innmeldingerForKollektiv/:kollektiv_id');
    //[{"bruker_id":1,"kollektiv_id":1,"status_admin":1,"status_bruker":9,"dato_svar_admin":"2018-01-15T11:12:12.000Z","dato_svar_bruker":null,"aktiv":1,"notat_admin":"Kommer flyttende i mars.","notat_bruker":null},
    // {"bruker_id":2,"kollektiv_id":1,"status_admin":1,"status_bruker":1,"dato_svar_admin":"2018-01-12T09:21:00.000Z","dato_svar_bruker":"2018-01-12T13:22:20.000Z","aktiv":0,"notat_admin":null,"notat_bruker":null}]
    connection.query("SELECT * FROM Innmelding WHERE aktiv=true AND status_bruker=1 AND kollektiv_id=?", req.params.kollektiv_id, function (err, rows, fields) {
      res.send(err ? err : rows);
      return next();
    });
  });


// Hent en bestemt innmelding
  server.get('rest/innmelding/:kollektiv_id', function (req, res, next) {
    console.log('DEBUG - rest/innmelding/:kollektiv_id');
    if (req.params.kollektiv_id) {
      connection.query("SELECT * FROM Innmelding WHERE bruker_id=? AND kollektiv_id=?", [req.params.bruker_id, req.params.kollektiv_id], function (err, rows, fields) {
        res.send(err ? err : (rows.length == 1 ? rows[0] : null));
        return next();
      });
    } else {
      //console.log('Fant ingen innmelding for bruker ' + req.params.bruker_id + ' til kollektiv ' + req.params.kollektiv_id + '...');
      res.send(null);
      return next();
    }
    ;
  });


// Legg til innmelding
  server.post('rest/innmelding/', function (req, res, next) {
    console.log('DEBUG - rest/innmelding/');
    connection.query("INSERT INTO Innmelding SET ?", req.body, function (err, rows, fields) {
      res.send(err ? err : rows);
      return next();
    });
  });

// Oppdater en innmelding
  server.put('rest/innmelding/', function (req, res, next) {
    console.log('DEBUG - rest/innmelding/');
// console.log('Processing the PUT...');
// console.log(req.params);

    let minInnmelding = null;
    if (req.params.kollektiv_id) {
      connection.query("SELECT bruker_id FROM Bruker WHERE epost=?", [req.params.bruker_epost], function (err, rows, fields) {
        req.params.bruker_id = rows[0].bruker_id;
        connection.query("SELECT * FROM Innmelding WHERE bruker_epost=? AND kollektiv_id=?", [req.params.bruker_epost, req.params.kollektiv_id], function (err, rows1, fields) {
          minInnmelding = rows1[0];

          if (req.params.kollektiv_id != null) {
            minInnmelding.kollektiv_id = req.params.kollektiv_id
          }
          ;
          if (req.params.bruker_epost != null) {
            minInnmelding.bruker_epost = req.params.bruker_epost
          }
          ;
          if (req.params.status_admin != null) {
            minInnmelding.status_admin = req.params.status_admin
          }
          ;
          if (req.params.status_bruker != null) {
            minInnmelding.status_bruker = req.params.status_bruker
          }
          ;
          if (req.params.dato_svar_admin != null) {
            minInnmelding.dato_svar_admin = req.params.dato_svar_admin
          } else {
            minInnmelding.dato_svar_admin = util.getCurrentTimeAsEpoch();
          }
          ;
          if (req.params.dato_svar_bruker != null) {
            minInnmelding.dato_svar_bruker = req.params.dato_svar_bruker
          }
          ;
          if (req.params.aktiv != null) {
            minInnmelding.aktiv = req.params.aktiv
          }
          ;
          if (req.params.notat_admin != null) {
            minInnmelding.notat_admin = req.params.notat_admin
          }
          ;
          if (req.params.notat_bruker != null) {
            minInnmelding.notat_bruker = req.params.notat_bruker
          }
          ;

          if (req.params.kollektiv_id) {
            connection.query("UPDATE Innmelding SET ? WHERE kollektiv_id=? AND bruker_epost=?", [minInnmelding, req.body.kollektiv_id, minInnmelding.bruker_epost], function (err, rows2, fields) {
              connection.query("INSERT INTO Bruker_Kollektiv SET kollektiv_id=?, bruker_id=?, er_admin=0", [req.body.kollektiv_id, req.params.bruker_id], function (err, rows3, fields) {
                res.send(err ? err : rows3);
                return next();
              })
            });
          } else {
            res.send(null);
            return next();
          }
          ;
        });
      });
    } else {
      console.log('Fant ingen innmelding for bruker ' + req.params.bruker_id + ' til kollektiv ' + req.params.kollektiv_id + '...');
      res.send(null);
      return next();
    }
    ;
  });

// Oppdatere en innmelding via GET (for å kunne motta svar via klikk fra epost)
  server.get('rest/invitasjon/:kollektiv_id', function (req, res, next) {
    console.log('DEBUG - rest/invitasjon/:kollektiv_id');
    console.log('Someone wants to reply to an invite!');
    if (req.params.bruker_epost && req.params.bruker_svar == 'jatakk') {
      console.log('They said yes!');
      //These are the variables we need to add a user to group and sub group:
      let myKollektiv_id = req.params.kollektiv_id;
      let myBruker_epost = req.params.bruker_epost;
      let myUndergruppe_id = ''; //                   SELECT undergruppe_id WHERE kollektiv_id=? AND default_gruppe=1
      let myBruker_id = ''; //                        SELECT bruker_id WHERE bruker_epost=? (OR CREATE THE USER IF MISSING FROM THE DATABASE!!!)
      let currentDateAsEpoch = util.getCurrentTimeAsEpoch();

      console.log(myKollektiv_id + ', ' + myBruker_epost + ', ' + myBruker_id + ', ' + myUndergruppe_id + ', ' + currentDateAsEpoch);

      connection.query("SELECT undergruppe_id FROM Undergruppe WHERE kollektiv_id=? AND default_gruppe=1", [myKollektiv_id], function (err, rows0, fields) {
        console.log('undergruppe_id - Rows0: ' + rows0);
        if (rows0.length == 1) {
          myUndergruppe_id = rows0[0].undergruppe_id;
        } else {
          //No good, return null
          res.send(null);
          return next();
        }
        console.log(myKollektiv_id + ', ' + myBruker_epost + ', ' + myBruker_id + ', ' + myUndergruppe_id + ', ' + currentDateAsEpoch);
      });

      connection.query("SELECT bruker_id FROM Bruker WHERE epost=?", [myBruker_epost], function (err, rows, fields) {
        if (rows != '') {
          console.log("ROWS: " + rows);
          if (rows.length == 1) {
            myBruker_id = rows[0].bruker_id;
          } else {
            //No good, return null
            res.send(null);
            return next();
          }
          console.log(myKollektiv_id + ', ' + myBruker_epost + ', ' + myBruker_id + ', ' + myUndergruppe_id + ', ' + currentDateAsEpoch);

          //First; select the correct one
          connection.query("SELECT * FROM Innmelding WHERE epost=? AND kollektiv_id=?", [myBruker_epost, myKollektiv_id], function (err, rows, fields) {
            console.log('* - Rows: ' + rows);
            if (rows.length == 1) {
              //We have the invite. Update it and add the user!
              connection.query("UPDATE Innmelding SET status_bruker=1, dato_svar_bruker=? WHERE bruker_epost=? AND kollektiv_id=?", [currentDateAsEpoch, myBruker_epost, myKollektiv_id], function (err, rows1, fields) {
                console.log('Rows1: ' + rows1);
                connection.query('INSERT INTO Bruker_Kollektiv SET bruker_id=?, kollektiv_id=?', [myBruker_id, myKollektiv_id], function (err, rows2, fields) {
                  console.log('Rows2: ' + rows2);
                  connection.query('INSERT INTO Bruker_Undergruppe SET bruker_id=?, undergruppe_id=?', [myBruker_id, myUndergruppe_id], function (err, rows3, fields) {
                    console.log('Rows3: ' + rows3);
                    console.log('Bruker #' + myBruker_id + ' (' + myBruker_epost + ') har blitt meldt inn i Kollektiv #' + myKollektiv_id + ' med hovedgruppe #' + myUndergruppe_id);
                    res.send(1);
                    return next();
                  });
                });
              });
            } else {
              //No good, return null
              res.send(null);
              return next();
            }
          });

        } else {
          //There was no user with this email, redirect to register page
          let redirectString =
            '<html xmlns=http://www.w3.org/1999/xhtml">' +
            '   <head>' +
            '       <title>Registrering</title>' +
            '       <meta http-equiv="refresh" content="0;URL="http://localhost:8080/#/Register" />' +
            '   </head>' +
            '   <body>' +
            '       <p>Du sendes nå til registreringssiden...</p>' +
            '   </body>' +
            '</html>'
          res.send(redirectString);
          return next();
        }
      });


    } else {
      //console.log('Fant ingen innmelding for bruker ' + req.params.bruker_id + ' til kollektiv ' + req.params.kollektiv_id + '...');
      res.send(null);
      return next();
    }
  });
};
