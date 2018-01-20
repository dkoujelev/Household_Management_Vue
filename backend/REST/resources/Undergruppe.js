module.exports = function(connection, server){

// Hent en spesifikk undergruppe
  server.get('rest/undergruppe/:undergruppe_id',function(req, res, next){
    connection.query("SELECT * FROM Undergruppe WHERE undergruppe_id=?", [req.params.undergruppe_id], function(err, rows, fields){
      res.send(err ? err : (rows.length == 1 ? rows[0] : null));
      return next();
    });
  });

// Hent alle undergrupper
  server.get('rest/undergruppe/',function(req, res, next){
    connection.query("SELECT * FROM Undergruppe", function(err, rows, fields){
      res.send(err ? err : rows);
      return next();
    });
  });

// Hent undergrupper til ett spesifikt kollektiv
  server.get('rest/undergrupperForKollektiv/:kollektiv_id',function(req, res, next){
    connection.query("SELECT * FROM Undergruppe WHERE kollektiv_id=?", req.params.kollektiv_id, function(err, rows, fields){
      res.send(err ? err : rows);
      return next();
    });
  });

// Hent hovedgruppen til ett spesifikt kollektiv
  server.get('rest/hovedgruppenForKollektiv/:kollektiv_id',function(req, res, next){
    connection.query("SELECT * FROM Undergruppe WHERE kollektiv_id=? AND default_gruppe=1", req.params.kollektiv_id, function(err, rows, fields){
      res.send(err ? err : rows);
      return next();
    });
  });


  server.get('rest/undergrupperForBruker/:bruker_id',function(req, res, next){
    connection.query("SELECT Undergruppe.*, Kollektiv.navn as kollektiv_navn FROM Undergruppe " +
      "INNER JOIN Bruker_Undergruppe ON Undergruppe.undergruppe_id=Bruker_Undergruppe.undergruppe_id " +
      "INNER JOIN Bruker ON Bruker_Undergruppe.bruker_id=Bruker.bruker_id " +
      "INNER JOIN Kollektiv ON Undergruppe.kollektiv_id = Kollektiv.kollektiv_id " +
      "WHERE Bruker.bruker_id=? " +
      "ORDER BY Undergruppe.kollektiv_id, Undergruppe.default_gruppe DESC", req.params.bruker_id, function(err, rows, fields){
      res.send(err ? err : rows);
      return next();
    });
  });

  server.post('rest/undergruppe/:bruker_id',function(req, res, next){
    connection.query("INSERT INTO Undergruppe SET ?", req.body, function(err, rows1, fields){
      if(err){res.send(err); return next();}

      connection.query('INSERT INTO Bruker_Undergruppe SET bruker_id=?, undergruppe_id=?',[req.params.bruker_id, rows1.insertId], function(err,rows2,fields){
        res.send(err ? err : rows1);
        return next();
      });
    });
  });

  server.put('rest/undergruppe/',function(req, res, next){
    connection.query("UPDATE Undergruppe SET ? WHERE undergruppe_id=?", [req.body, req.body.undergruppe_id], function(err, rows, fields){
      res.send(err ? err : rows);
      return next();
    });
  });

};
