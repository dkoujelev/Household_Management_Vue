
module.exports = function(connection, server){

// Hent et bestemt kollektiv
  server.get('rest/kollektiv/:kollektiv_id',function(req, res, next){
    //console.log('DEBUG - rest/kollektiv/:kollektiv_id');
    connection.connection.query("SELECT * FROM Kollektiv WHERE kollektiv_id=?", [req.params.kollektiv_id], function(err, rows, fields){
      res.send(err ? err : (rows.length == 1 ? rows[0] : null));
      return next();
    });
  });

// Hent et bestemt kollektiv via navn
  server.get('rest/kollektivMedNavn/:navn',function(req, res, next){
    //console.log('DEBUG - rest/kollektivMedNavn/:navn');
    connection.connection.query("SELECT * FROM Kollektiv WHERE navn=?", [req.params.navn], function(err, rows, fields){
      res.send(err ? err : (rows.length == 1 ? rows[0] : null));
      return next();
    });
  });

// Hent alle kollektiv
  server.get('rest/kollektiv/',function(req, res, next){
    //console.log('DEBUG - rest/kollektiv/');
    connection.connection.query("SELECT * FROM Kollektiv", function(err, rows, fields){
      res.send(err ? err : rows);
      return next();
    });
  });

// Hent alle kollektiv for en spesifikk bruker
  server.get('rest/kollektivForBruker/:bruker_id',function(req, res, next){
    //console.log('DEBUG - rest/kollektivForBruker/:bruker_id');
    connection.connection.query("SELECT Bruker_Kollektiv.*, Kollektiv.Navn AS navn FROM Bruker_Kollektiv " +
      "INNER JOIN Kollektiv ON Bruker_Kollektiv.kollektiv_id=Kollektiv.kollektiv_id " +
      "WHERE bruker_id=?",req.params.bruker_id, function(err, rows, fields){
      res.send(err ? err : rows);
      return next();
    });
  });

// Hent alle kollektiv hvor en spesifikk bruker er admin
  server.get('rest/kollektivForAdmin/:bruker_id',function(req, res, next){
    //console.log('DEBUG - rest/kollektivForAdmin/:bruker_id');
    connection.connection.query("SELECT Bruker_Kollektiv.*, Kollektiv.Navn AS navn FROM Bruker_Kollektiv " +
      "INNER JOIN Kollektiv ON Bruker_Kollektiv.kollektiv_id=Kollektiv.kollektiv_id " +
      "WHERE bruker_id=? AND er_admin=1",req.params.bruker_id, function(err, rows, fields){
      res.send(err ? err : rows);
      return next();
    });
  });

// Opprett nytt kollektiv
  server.post('rest/kollektiv/:bruker_id',function(req, res, next){
    //console.log('DEBUG - rest/kollektiv/:bruker_id');
    connection.connection.query("INSERT INTO Kollektiv SET ?", req.body, function(err, rows1, fields){
      if(err) return next(err);

      connection.connection.query("INSERT INTO Bruker_Kollektiv SET bruker_id=?, kollektiv_id=?, er_admin=1", [req.params.bruker_id, rows1.insertId], function(err,rows2,fields){
        if(err) return next(err);

        connection.connection.query("INSERT INTO Undergruppe SET navn=?, beskrivelse=?, kollektiv_id=?, default_gruppe=1",[req.body.navn, req.body.beskrivelse, rows1.insertId],function(err,rows3,fields){
          if(err) return next(err);

          connection.connection.query("INSERT INTO Bruker_Undergruppe SET bruker_id=?, undergruppe_id=?",[req.params.bruker_id, rows3.insertId], function(err, rows4, fields){
            if(err) return next(err);

            res.send(rows1);
            return next();

          });
        });
      });
    });
  });

// Oppdater et kollektiv
  server.put('rest/kollektiv',function(req,res,next){
    //console.log('DEBUG - rest/kollektiv');
    connection.connection.query("UPDATE Kollektiv SET ? WHERE kollektiv_id=?", [req.body, req.body.kollektiv_id], function(err, rows, fields){
      res.send(err ? err : rows);
      return next();
    });
  });

  // Meld bruker inn i kollektiv
  server.post('/rest/meldBrukerInnIKollektiv/', (req,res,next) => {
    //console.log('DEBUG - rest/meldBrukerInnIKollektiv');
    connection.connection.query('INSERT INTO Bruker_Kollektiv SET ?', [req.body], (err,rows,fields) => {

      if(err)
        return next(err);

      res.send(rows);
      return next();
    });
  });
};
