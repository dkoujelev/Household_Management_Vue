let util = require("../util");

/*
                Notifikasjon
    opprettet               bigint(20) 
    tekst                   varchar(255) 
    lest                    tinyint(1) 
    id                      int(11) AI PK 
    bruker_id               int(11)
*/

module.exports = function(connection, server) {

    // Hent enkel notification
    server.get('rest/notifikasjon/:id', function (req, res, next) {
        console.log('DEBUG - GET - rest/notifikasjon/:id');
        connection.query("SELECT * FROM Notifikasjon WHERE id=?", req.params.id, function (err, rows, fields) {
          res.send(err ? err : rows);
          return next();
          });
        });

    // Hent alle notifications for bruker
    server.get('rest/notifikasjon/:bruker_id', function (req, res, next) {
        console.log('DEBUG - GET - rest/notifikasjon/:bruker_id');
        connection.query("SELECT * FROM Notifikasjon WHERE bruker_id=?", req.params.bruker_id, function (err, rows, fields) {
          res.send(err ? err : rows);
          return next();
          });
        });

    // Hent uleste notifications for bruker
    server.get('rest/notifikasjon/:bruker_id/ulest', function (req, res, next) {
        console.log('DEBUG - GET - rest/notifikasjon/:bruker_id/ulest');
        connection.query("SELECT * FROM Notifikasjon WHERE lest=0 AND bruker_id=?", req.params.bruker_id, function (err, rows, fields) {
          res.send(err ? err : rows);
          return next();
          });
        });

    // Sett en notification som lest

    // Sett alle notifications som lest
    
    // Opprett en notification for en bruker

};