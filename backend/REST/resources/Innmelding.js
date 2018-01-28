let util = require("../util");

module.exports = function(connection, server) {

  // Hent alle innmeldinger
  server.get('rest/innmelding/', function (req, res, next) {
    //console.log('DEBUG - GET - rest/innmelding/');
    connection.query("SELECT * FROM Innmelding", function (err, rows, fields) {
      res.send(err ? err : rows);
      return next();
      });
    });

  // Hent alle aktive innmeldinger (søknader) for et kollektiv
  server.get('rest/soknaderForKollektiv/:kollektiv_id', function (req, res, next) {
    //console.log('DEBUG - rest/soknaderForKollektiv/:kollektiv_id');
    connection.query("SELECT * FROM Innmelding WHERE aktiv=true AND status_bruker=1 AND kollektiv_id=?", req.params.kollektiv_id, function (err, rows, fields) {
      res.send(err ? err : rows);
      return next();
      });
    });

  // Hent alle aktive innmeldinger (søknad + invitasjon) for et kollektiv
  server.get('rest/innmeldingerForKollektiv/:kollektiv_id', function (req, res, next) {
    //console.log('DEBUG - rest/innmeldingerForKollektiv/:kollektiv_id');
    connection.query("SELECT * FROM Innmelding WHERE aktiv=true AND kollektiv_id=?", req.params.kollektiv_id, function (err, rows, fields) {
      res.send(err ? err : rows);
      return next();
      });
    });

    // Hent alle aktive innmeldinger (invitasjoner) for et kollektiv
    server.get('rest/invitasjonerForKollektiv/:kollektiv_id', function (req, res, next) {
      //console.log('DEBUG - rest/invitasjonerForKollektiv/:kollektiv_id');
      connection.query("SELECT * FROM Innmelding WHERE aktiv=true AND status_admin=1 AND kollektiv_id=?", req.params.kollektiv_id, function (err, rows, fields) {
        res.send(err ? err : rows);
        return next();
      });
    });

  // Hent en bestemt innmelding
  server.get('rest/innmelding/:kollektiv_id', function (req, res, next) {
    //console.log('DEBUG - GET - rest/innmelding/:kollektiv_id');
    if (req.params.kollektiv_id) {
      connection.query("SELECT * FROM Innmelding WHERE bruker_epost=? AND kollektiv_id=?", [req.params.bruker_epost, req.params.kollektiv_id], function (err, rows, fields) {
        res.send(err ? err : (rows.length == 1 ? rows[0] : null));
        return next();
      });
    } else {
      //console.log('Fant ingen innmelding for bruker ' + req.params.bruker_id + ' til kollektiv ' + req.params.kollektiv_id + '...');
      res.send(null);
      return next();
      };
    });


// Legg til innmelding
  server.post('rest/innmelding/', function (req, res, next) {
    //console.log('DEBUG - POST - rest/innmelding/');
    connection.query("INSERT INTO Innmelding SET ?", req.body, function (err, rows, fields) {
      if(err){
        res.send(err);
      }else{
        // We know it's good, add notification if it's not an invite
        if(req.body.status_admin==2){
          //console.log('This Innmelding is a request for membership! status_admin:' + req.body.status_admin);
          let myTime = util.getCurrentTimeAsEpoch();
          let msg = req.body.bruker_epost + ' har søkt om tilgang til et kollektiv';
          let newNotification = {
            opprettet:myTime,
            tekst: msg,
            lest:0,
            id:null,
            bruker_id:0
          };
          let groupAdmins = [];
          connection.query("SELECT bruker_id FROM Bruker_Kollektiv WHERE kollektiv_id=? AND er_admin=1", req.body.kollektiv_id, function (err, rows0, fields) {
            groupAdmins = rows0;
            for(i=0;i<groupAdmins.length;i++){
              newNotification.bruker_id=groupAdmins[i].bruker_id;
              //console.log(newNotification);
              connection.query("INSERT INTO Notifikasjon SET ?", newNotification, function (err, rows1, fields) {
                //Do nothing?
                if(err){
                  console.log(err.code);
                  console.log(err.sqlMessage);
                  console.log(err.sql);
                }else{
                  // console.log('------ OK ------');
                  // console.log(rows1);
                  // console.log('----------------');
                };
              });
            };
          });
        }else{
          //console.log('This Innmelding is NOT a request for membership! status_admin:' + req.body.status_admin);
        }
        res.send(rows);
      };
      return next();
    });
  });

// Oppdater en innmelding
  server.put('rest/innmelding/', function (req, res, next) {
    console.log('DEBUG - PUT - rest/innmelding/');
    // console.log('Processing the PUT...');
    // console.log(req.params);

    let minInnmelding = null;
    let theUserID = 0;
    if (req.params.kollektiv_id) {
      connection.query("SELECT bruker_id FROM Bruker WHERE epost=?", [req.params.bruker_epost], function (err, rows, fields) {
        //req.params.bruker_id = rows[0].bruker_id;
        theUserID = rows[0].bruker_id;
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
              connection.query("INSERT INTO Bruker_Kollektiv SET kollektiv_id=?, bruker_id=?, er_admin=0", [req.body.kollektiv_id, theUserID], function (err, rows3, fields) {
                connection.query("SELECT * FROM Undergruppe WHERE kollektiv_id=? AND default_gruppe=1", [req.body.kollektiv_id], function (err, rows4, fields) {
                  connection.query("INSERT INTO Bruker_Undergruppe SET undergruppe_id=?, bruker_id=?", [rows4[0].undergruppe_id, theUserID], function (err, rows5, fields) {
                    res.send(err ? err : rows5);
                    return next();
                  });
                });
              });
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
    //console.log('DEBUG - rest/invitasjon/:kollektiv_id');
    if (req.params.bruker_epost && req.params.bruker_svar == 'jatakk') {

      //These are the variables we need to add a user to group and sub group:
      let myKollektiv_id = req.params.kollektiv_id;
      let myBruker_epost = req.params.bruker_epost;
      let myUndergruppe_id = ''; //                   SELECT undergruppe_id WHERE kollektiv_id=? AND default_gruppe=1
      let myBruker_id = ''; //                        SELECT bruker_id WHERE bruker_epost=? (OR CREATE THE USER IF MISSING FROM THE DATABASE!!!)
      let currentDateAsEpoch = util.getCurrentTimeAsEpoch();

      connection.query("SELECT undergruppe_id FROM Undergruppe WHERE kollektiv_id=? AND default_gruppe=1", [myKollektiv_id], function (err, rows0, fields) {
        if (rows0.length == 1) {
            myUndergruppe_id = rows0[0].undergruppe_id;
          } else {
            //No good, return null
            res.send(null);
            return next();
          }

        connection.query("SELECT bruker_id FROM Bruker WHERE epost=?", myBruker_epost, function (err, rows, fields) {
          if (rows != '') {
            if (rows.length == 1) {
              myBruker_id = rows[0].bruker_id;
            } else {
              //No good, return null
              res.send(null);
              return next();
            }

            //First; select the correct invite
            connection.query("SELECT * FROM Innmelding WHERE aktiv=1 AND bruker_epost=? AND kollektiv_id=?", [myBruker_epost, myKollektiv_id], function (err, rows, fields) {
              if (rows.length == 1) {
                //We have the invite. Update it and add the user!
                connection.query("UPDATE Innmelding SET aktiv=0, status_bruker=1, dato_svar_bruker=? WHERE bruker_epost=? AND kollektiv_id=?", [currentDateAsEpoch, myBruker_epost, myKollektiv_id], function (err, rows1, fields) {
                  connection.query('INSERT INTO Bruker_Kollektiv SET bruker_id=?, kollektiv_id=?', [myBruker_id, myKollektiv_id], function (err, rows2, fields) {
                    connection.query('INSERT INTO Bruker_Undergruppe SET bruker_id=?, undergruppe_id=?', [myBruker_id, myUndergruppe_id], function (err, rows3, fields) {
                      // If we've made it this far, the user has been added to the group!
                      connection.query("SELECT * FROM Innmelding WHERE bruker_epost=? AND kollektiv_id=?", [myBruker_epost, myKollektiv_id], function (err, rows4, fields) {
                        res.send(rows4);
                        return next();
                      });
                    });
                  });
                });
              } else {
                //No good, return null
                console.log('There was no active invite matching the supplied data...');
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
      });

    } else {
      //console.log('Fant ingen innmelding for bruker ' + req.params.bruker_id + ' til kollektiv ' + req.params.kollektiv_id + '...');
      res.send(null);
      return next();
    }
  });
};