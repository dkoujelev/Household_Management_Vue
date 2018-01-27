
module.exports = function(connection, server){

// Hent et bestemt kollektiv
  server.get('rest/kollektiv/:kollektiv_id',function(req, res, next){
    //console.log('DEBUG - rest/kollektiv/:kollektiv_id');
    connection.query("SELECT * FROM Kollektiv WHERE kollektiv_id=?", [req.params.kollektiv_id], function(err, rows, fields){
      res.send(err ? err : (rows.length == 1 ? rows[0] : 'Kollektiv not found!'));
      return next();
    });
  });

// Hent et bestemt kollektiv via navn
  server.get('rest/kollektivMedNavn/:navn',function(req, res, next){
    //console.log('DEBUG - rest/kollektivMedNavn/:navn');
    connection.query("SELECT * FROM Kollektiv WHERE navn=? AND deleted=FALSE", [req.params.navn], function(err, rows, fields){
      res.send(err ? err : (rows.length == 1 ? rows[0] : null));
      return next();
    });
  });

// Hent alle kollektiv
  server.get('rest/kollektiv',function(req, res, next){
    //console.log('DEBUG - rest/kollektiv/');
    connection.query("SELECT * FROM Kollektiv", function(err, rows, fields){
      if(err)
        return next(err);
      res.send(rows);
      return next();
    });
  });

// Hent alle kollektiv for en spesifikk bruker
  server.get('rest/kollektivForBruker/:bruker_id',function(req, res, next){
    //console.log('DEBUG - rest/kollektivForBruker/:bruker_id');
    connection.query("SELECT Kollektiv.* FROM Bruker_Kollektiv " +
      "INNER JOIN Kollektiv ON Bruker_Kollektiv.kollektiv_id=Kollektiv.kollektiv_id " +
      "WHERE bruker_id=? AND deleted=FALSE",req.params.bruker_id, function(err, rows, fields){
      //console.log('DEBUG - rest/kollektivForBruker/:bruker_id/YELLO!');
      res.send(err ? err : rows);
      return next();
    });
  });

// Hent alle kollektiv hvor en spesifikk bruker er admin
  server.get('rest/kollektivForAdmin/:bruker_id',function(req, res, next){
    //console.log('DEBUG - rest/kollektivForAdmin/:bruker_id');
    connection.query("SELECT Kollektiv.* FROM Bruker_Kollektiv " +
    "INNER JOIN Kollektiv ON Bruker_Kollektiv.kollektiv_id = Kollektiv.kollektiv_id " +
    "WHERE bruker_id=? AND er_admin=1 AND deleted=FALSE",req.params.bruker_id, function(err, rows, fields){
      res.send(err ? err : rows);
      return next();
    });
  });

// Opprett nytt kollektiv
  server.post('rest/kollektiv/:bruker_id',function(req, res, next){
    //console.log('DEBUG - rest/kollektiv/:bruker_id');
    connection.query("INSERT INTO Kollektiv SET ?", [req.body], function(err, rows1, fields){
      if(err) return next(err);

      connection.query("INSERT INTO Bruker_Kollektiv SET bruker_id=?, kollektiv_id=?, er_admin=1", [req.params.bruker_id, rows1.insertId], function(err,rows2,fields){
        if(err) return next(err);

        connection.query("INSERT INTO Undergruppe SET navn=?, beskrivelse=?, kollektiv_id=?, default_gruppe=1",[req.body.navn, req.body.beskrivelse, rows1.insertId],function(err,rows3,fields){
          if(err) return next(err);

          connection.query("INSERT INTO Bruker_Undergruppe SET bruker_id=?, undergruppe_id=?",[req.params.bruker_id, rows3.insertId], function(err, rows4, fields){
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
    connection.query("UPDATE Kollektiv SET ? WHERE kollektiv_id=?", [req.body, req.body.kollektiv_id], function(err, rows, fields){
      res.send(err ? err : rows);
      return next();
    });
  });

  // Meld bruker inn i kollektiv
  server.post('/rest/meldBrukerInnIKollektiv/', (req,res,next) => {
    //console.log('DEBUG - rest/meldBrukerInnIKollektiv');
    connection.query('INSERT INTO Bruker_Kollektiv SET ?', [req.body], (err,rows,fields) => {
      if(err){
          console.log('SQL Error:   ' + err.code + ': ' + err.sqlMessage);
          console.log('SQL query:   ' + err.sql);
      }else{
        //console.log(rows[0]);
        res.send(rows);
        return next();
      };
    });
  });

  server.del('rest/kollektiv/:kollektiv_id', function (req, res, next) {
    let id = req.params.kollektiv_id;
    connection.query('UPDATE Kollektiv, Undergruppe SET Kollektiv.deleted = TRUE, Undergruppe.deleted = TRUE WHERE Kollektiv.kollektiv_id=? AND Undergruppe.kollektiv_id=?', [id,id], function (err, rows, fields) {
      if(err)
        return next(err);
      connection.query('SELECT undergruppe_id FROM Undergruppe WHERE kollektiv_id=?', req.params.kollektiv_id, function (err, rows, fields) {
        if(err)
          return next(err);
        connection.query('DELETE FROM Bruker_Undergruppe WHERE ?', rows, function (err, rows, fields) {
          if(err)
            return next(err);
          connection.query('DELETE FROM Bruker_Kollektiv WHERE kollektiv_id=?', req.params.kollektiv_id, function (err, rows, fields) {
            res.send(err ? err : rows);
            return next();
          });
        });
      });
    });
  });
};
