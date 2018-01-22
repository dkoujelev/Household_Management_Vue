module.exports = function(connection, server){

// Hent en spesifikk undergruppe
  server.get('rest/undergruppe/:undergruppe_id',function(req, res, next){
    console.log('DEBUG - rest/undergruppe/:undergruppe_id');
    connection.query("SELECT * FROM Undergruppe WHERE undergruppe_id=?", [req.params.undergruppe_id], function(err, rows, fields){
      res.send(err ? err : (rows.length == 1 ? rows[0] : null));
      return next();
    });
  });

// Hent alle undergrupper
  server.get('rest/undergruppe/',function(req, res, next){
    console.log('DEBUG - rest/undergruppe/');
    connection.query("SELECT * FROM Undergruppe", function(err, rows, fields){
      res.send(err ? err : rows);
      return next();
    });
  });

// Hent undergrupper til ett spesifikt kollektiv
  server.get('rest/undergrupperForKollektiv/:kollektiv_id',function(req, res, next){
    console.log('DEBUG - rest/undergrupperForKollektiv/:kollektiv_id');
    connection.query("SELECT * FROM Undergruppe WHERE kollektiv_id=?", req.params.kollektiv_id, function(err, rows, fields){
      res.send(err ? err : rows);
      return next();
    });
  });

// Hent hovedgruppen til ett spesifikt kollektiv
  server.get('rest/hovedgruppenForKollektiv/:kollektiv_id',function(req, res, next){
    console.log('DEBUG - rest/hovedgruppenForKollektiv/:kollektiv_id');
    connection.query("SELECT * FROM Undergruppe WHERE kollektiv_id=? AND default_gruppe=1", req.params.kollektiv_id, function(err, rows, fields){
      res.send(err ? err : rows);
      return next();
    });
  });

// Hent undergruppene til en bruker
  server.get('rest/undergrupperForBruker/:bruker_id',function(req, res, next){
    console.log('DEBUG - rest/undergruppeForBruker/:bruker_id');
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

// Legg til en bruker i en undergruppe
  server.post('rest/undergruppeLeggTilBruker/:undergruppe_id',function(req, res, next){
    console.log('DEBUG - rest/undergruppeLeggTilBruker/:undergruppe_id');
    connection.query('INSERT INTO Bruker_Undergruppe SET bruker_id=?, undergruppe_id=?',[req.params.bruker_id, req.params.undergruppe_id], function(err,rows,fields){
      res.send(err ? err : rows);
      return next();
    });
  });

// Fjern en bruker fra en undergruppe
  server.put('rest/undergruppeFjernBruker/:undergruppe_id',function(req, res, next){
    console.log('DEBUG - rest/undergruppeFjernBruker/:undergruppe_id');
    connection.query('DELETE FROM Bruker_Undergruppe WHERE bruker_id=? AND undergruppe_id=?',[req.params.bruker_id, req.params.undergruppe_id], function(err,rows,fields){
      res.send(err ? err : rows);
      return next();
    });
  });

// Lag en undergruppe (?)
  server.post('rest/undergruppe/:bruker_id',function(req, res, next){
    console.log('DEBUG - rest/undergruppe/:bruker_id');
    connection.query("INSERT INTO Undergruppe SET ?", req.body, function(err, rows1, fields){
      if(err){res.send(err); return next();}

      connection.query('INSERT INTO Bruker_Undergruppe SET bruker_id=?, undergruppe_id=?',[req.params.bruker_id, rows1.insertId], function(err,rows2,fields){
        res.send(err ? err : rows2);
        return next();
      });
    });
  });

// Oppdater en undergruppe
  server.put('rest/undergruppe/',function(req, res, next){
    console.log('DEBUG - rest/undergruppe/');
    connection.query("UPDATE Undergruppe SET ? WHERE undergruppe_id=?", [req.body, req.body.undergruppe_id], function(err, rows, fields){
      res.send(err ? err : rows);
      return next();//
    });
  });

// Favorittiser en handleliste
  server.put('rest/favorittHandleliste/', function (req, res, next) {
    //console.log(req.body.favoritt + " " + req.body.handleliste_id);
    connection.query('UPDATE Handleliste SET favoritt=? WHERE handleliste_id=?', [req.body.favoritt, req.body.handleliste_id], function (err, rows, fields) {
      if(err)
        return next(err);
      res.send(rows);
      return next();
    });
  });

// Favorittiser en gjoremalsliste
  server.put('rest/favorittGjoremalsliste/', function (req, res, next) {
    connection.query('UPDATE Gjoremalsliste SET favoritt=? WHERE id=?', [req.body.favoritt, req.body.id], function (err, rows, fields) {
      if(err)
        return next(err);
      res.send(rows);
      return next();
    });
  });

};
