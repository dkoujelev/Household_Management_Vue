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
        //console.log('   DEBUG - GET - rest/notifikasjon/:id');
        connection.query("SELECT * FROM Notifikasjon WHERE id=?", req.params.id, function (err, rows, fields) {
          res.send(err ? err : rows);
          return next();
          });
        });

    // Hent alle notifications for bruker
    server.get('rest/notifikasjon/:bruker_id/alle', function (req, res, next) {
        //console.log('   DEBUG - GET - rest/notifikasjon/:bruker_id/alle');
        connection.query("SELECT * FROM Notifikasjon WHERE bruker_id=?", req.params.bruker_id, function (err, rows, fields) {
          res.send(err ? err : rows);
          return next();
          });
        });

    // Hent uleste notifications for bruker
    server.get('rest/notifikasjon/:bruker_id/ulest', function (req, res, next) {
        //console.log('   DEBUG - GET - rest/notifikasjon/:bruker_id/ulest');
        connection.query("SELECT * FROM Notifikasjon WHERE lest=0 AND bruker_id=?", req.params.bruker_id, function (err, rows, fields) {
          //(err ? console.log(err) : console.log('It works!'));
            res.send(err ? err : rows);
          return next();
          });
        });

    // Opprett en notification for en bruker
    server.post('rest/notifikasjon/', function (req, res, next) {
        //console.log('   DEBUG - POST - rest/notifikasjon/');
        connection.query("INSERT INTO Notifikasjon SET ?", req.body, function (err, rows, fields) {
            if(err){
                console.log(err);
                return next(err);
            }else{
                res.send(rows);
                return next();
            };
        });
     });

    // Oppdater en notification
    server.put('rest/notifikasjon/', function (req, res, next) {
        //console.log('   DEBUG - PUT - rest/notifikasjon/');
        connection.query("UPDATE Notifikasjon SET ? WHERE id=?", [req.body,req.body.id], function (err, rows, fields) {
            if(err){
                console.log(err);
                return next(err);
            }else{
                res.send(rows);
                return next();
            };
        });
     });


     // Sett en notifikasjon som lest
    server.put('rest/notifikasjon/:id/les', function (req, res, next) {
        //console.log('   DEBUG - PUT - rest/notifikasjon/:id/les');   
        connection.query("UPDATE Notifikasjon SET lest=1 WHERE id=?", req.body.id, function (err, rows, fields) {
            if(err){
                console.log(err);
                return next(err);
            }else{
                res.send(rows);
                return next();
            };
        });
     });

    
    // Sett alle notifications som lest
    server.put('rest/notifikasjon/:bruker_id/lesalle', function (req, res, next) {
        //console.log('   DEBUG - PUT - rest/notifikasjon/:id/lesalle');
        connection.query("UPDATE Notifikasjon SET lest=1 WHERE lest=0 AND bruker_id=?", req.body.bruker_id, function (err, rows, fields) {
            if(err){
                console.log(err);
                return next(err);
            }else{
                res.send(rows);
                return next();
            };
        });
     });
};