module.exports = function(connection, server){

// Hent en spesifikk undergruppe
  server.get('rest/undergruppe/:undergruppe_id',function(req, res, next){
    console.log('DEBUG - rest/undergruppe/:undergruppe_id');
    connection.connection.query("SELECT * FROM Undergruppe WHERE undergruppe_id=?", [req.params.undergruppe_id], function(err, rows, fields){
      res.send(err ? err : (rows.length == 1 ? rows[0] : null));
      return next();
    });
  });

  // Oppdater medlemsskap i undergruppe
  // Send f.eks. inn dette for å ha brukere 4,5 og 6 meldt inn (og kun dem):
  // {undergruppe_id: 1, brukere: [4,5,6]}
  server.post('rest/oppdaterMedlemsskapIUndergruppe', (req,res,next) => {

    // let brukere_i_basen = rows.map(row => row.bruker_id);
    // let brukere_fra_request = req.body.brukere;
    //
    //
    // let row_slett = [];
    // let row_opprett = [];
    //
    // for(let bruker_i_basen of brukere_i_basen){
    //   if(!req.body.brukere.includes(bruker_i_basen))
    //     row_slett.push([bruker_i_basen, req.body.undergruppe_id]);
    // }
    // for(let bruker_fra_request of brukere_fra_request){
    //   if(!brukere_i_basen.includes(bruker_fra_request))
    //     row_opprett.push([bruker_fra_request, req.body.undergruppe_id]);

    let opprett_brukere = [];
    for(bruker of req.body.brukere)
      opprett_brukere.push([bruker, req.body.undergruppe_id]);

    connection.connection.query('DELETE FROM Bruker_Undergruppe WHERE undergruppe_id=?', [req.body.undergruppe_id], (err,rows,fields) => {
      if(err) //TODO: Transactions
        return next(err);

      connection.connection.query('INSERT INTO Bruker_Undergruppe (bruker_id, undergruppe_id) VALUES ?', [opprett_brukere], (err,rows,fields) => {
        if(err)
          return next(err);

        res.send(rows);
        return next();
      });
    });
  });

  // Hent alle medlemmer i en undergruppe
  server.get('rest/medlemmerIUndergruppe/:undergruppe_id', (req,res,next) => {
    connection.connection.query('SELECT Bruker.* FROM Undergruppe ' +
      'INNER JOIN Bruker_Undergruppe ON Undergruppe.undergruppe_id=Bruker_Undergruppe.undergruppe_id ' +
      'INNER JOIN Bruker ON Bruker_Undergruppe.bruker_id=Bruker.bruker_id ' +
      'WHERE Undergruppe.undergruppe_id = ?', req.params.undergruppe_id, (err,rows,fields) => {
      if(err)
        return next(err);

      res.send(rows);
      return next();
    });
  });

// Hent alle undergrupper
  server.get('rest/undergruppe/',function(req, res, next){
    console.log('DEBUG - rest/undergruppe/');
    connection.connection.query("SELECT * FROM Undergruppe", function(err, rows, fields){
      res.send(err ? err : rows);
      return next();
    });
  });

// Hent undergrupper til ett spesifikt kollektiv
  server.get('rest/undergrupperForKollektiv/:kollektiv_id',function(req, res, next){
    console.log('DEBUG - rest/undergrupperForKollektiv/:kollektiv_id');
    connection.connection.query("SELECT * FROM Undergruppe WHERE kollektiv_id=?", req.params.kollektiv_id, function(err, rows, fields){
      res.send(err ? err : rows);
      return next();
    });
  });

// Hent hovedgruppen til ett spesifikt kollektiv
  server.get('rest/hovedgruppenForKollektiv/:kollektiv_id',function(req, res, next){
    console.log('DEBUG - rest/hovedgruppenForKollektiv/:kollektiv_id');
    connection.connection.query("SELECT * FROM Undergruppe WHERE kollektiv_id=? AND default_gruppe=1", req.params.kollektiv_id, function(err, rows, fields){
      res.send(err ? err : rows);
      return next();
    });
  });

// Hent undergruppene til en bruker
  server.get('rest/undergrupperForBruker/:bruker_id',function(req, res, next){
    console.log('DEBUG - rest/undergruppeForBruker/:bruker_id');
    connection.connection.query("SELECT Undergruppe.*, Kollektiv.navn as kollektiv_navn FROM Undergruppe " +
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
    connection.connection.query('INSERT INTO Bruker_Undergruppe SET bruker_id=?, undergruppe_id=?',[req.params.bruker_id, req.params.undergruppe_id], function(err,rows,fields){
      res.send(err ? err : rows);
      return next();
    });
  });

// Fjern en bruker fra en undergruppe
  server.put('rest/undergruppeFjernBruker/:undergruppe_id',function(req, res, next){
    console.log('DEBUG - rest/undergruppeFjernBruker/:undergruppe_id');
    connection.connection.query('DELETE FROM Bruker_Undergruppe WHERE bruker_id=? AND undergruppe_id=?',[req.params.bruker_id, req.params.undergruppe_id], function(err,rows,fields){
      res.send(err ? err : rows);
      return next();
    });
  });

// Lag en undergruppe (?)
  server.post('rest/undergruppe/:bruker_id',function(req, res, next){
    console.log('DEBUG - rest/undergruppe/:bruker_id');
    connection.connection.query("INSERT INTO Undergruppe SET ?", req.body, function(err, rows1, fields){
      if(err){res.send(err); return next();}

      connection.connection.query('INSERT INTO Bruker_Undergruppe SET bruker_id=?, undergruppe_id=?',[req.params.bruker_id, rows1.insertId], function(err,rows2,fields){
        res.send(err ? err : rows2);
        return next();
      });
    });
  });

// Oppdater en undergruppe
  server.put('rest/undergruppe/',function(req, res, next){
    console.log('DEBUG - rest/undergruppe/');
    connection.connection.query("UPDATE Undergruppe SET ? WHERE undergruppe_id=?", [req.body, req.body.undergruppe_id], function(err, rows, fields){
      res.send(err ? err : rows);
      return next();//
    });
  });
};
