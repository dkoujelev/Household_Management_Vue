let server = require("../server");
let connection = require("../connection");

// Hent en bestemt liste
server.get('rest/gjoremalsliste/:id',function(req, res, next){
  connection.query("SELECT * FROM Gjoremalsliste WHERE id=?", [req.params.id], function(err, rows, fields){
    if(err || rows.length != 1)
      return next(err);

    let liste = rows[0];

    if('start' in liste)
      liste.start = new Date(liste.start);
    if('frist' in liste)
      liste.frist = new Date(liste.frist);
    if('ferdig' in liste)
      liste.ferdig = new Date(liste.ferdig);

    connection.query("SELECT Gjoremal.* FROM Gjoremal " +
      "INNER JOIN Gjoremalsliste ON Gjoremalsliste.id = Gjoremal.liste_id WHERE Gjoremalsliste.id=?", [req.params.id], function(err, rows, filds){
      if(err)
        return next(err);

      liste.gjoremal = JSON.parse(JSON.stringify(rows));

      res.send(liste);
      return next();
    });
  });
});

//Hent alle lister i en undergruppe
server.get('rest/gjoremalsliste/:undergruppe_id',function(req, res, next){
  connection.query("SELECT * FROM Gjoremalsliste WHERE undergruppe_id=?", [req.params.undergruppe_id], function(err, rows, fields){
    res.send(err ? err : (rows.length == 1 ? rows[0] : null));
    return next();



    connection.query("SELECT Gjoremalsliste.*, Gjoremal.navn as gjoremal, Gjoremal.start, Gjoremal.frist, Gjoremal.ferdig," +
      "Bruker.fornavn, Bruker.etternavn FROM Gjoremalsliste " +
      "INNER JOIN Gjoremal ON Gjoremalsliste.id = Gjoremal.liste_id" +
      "INNER JOIN Bruker", req.params.undergruppe_id, function(err, rows, fields){
      if(err)
        return next(err);
      return next();
    });
  });
});
/*
// Hent alle lister
server.get('rest/gjoremalsliste/:kollektiv_id',function(req, res, next){
  connection.query("SELECT * FROM Gjoremalsliste WHERE ", function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});
*/
// Opprett ny liste
server.post('rest/gjoremalsliste/:undergruppe_id',function(req, res, next){
  connection.query("INSERT INTO Gjoremalsliste SET ?", req.body, function(err, rows, fields){
    if(err){res.send(err); return next();}

  });
  let liste = Object.assign({}, req.body);
  /*
  if('varer' in liste)
    delete handleliste.varer;
  */
  if('opprettet' in liste)
    liste.opprettet = new Date(liste.opprettet).getTime();

  connection.query('INSERT INTO Gjoremalsliste SET ?', [liste], function(err,rows,fields){
    if(err)
      return next(err);

    let gjoremaler = [];
    for(let gjoremal of req.body.gjoremaler){
      let gjoremalen = [];

      gjoremalen.push(gjoremal.navn);
      gjoremalen.push(gjoremal.start);
      gjoremalen.push(gjoremal.frist);
      gjoremalen.push(gjoremal.ferdig);
      gjoremalen.push(gjoremal.beskrivelse);
      gjoremalen.push(gjoremal.bruker_id);
      gjoremalen.push(rows.insertId);
      gjoremaler.push(gjoremalen);
      if('start' in gjoremal)
        liste.start = new Date(liste.start).getTime();
      if('frist' in gjoremal)
        liste.frist = new Date(liste.frist).getTime();
      if('ferdig' in gjoremal)
        liste.ferdig = new Date(liste.ferdig).getTime();
    }

    console.log(JSON.stringify(varer));

    connection.query('INSERT INTO Vare (navn, start, frist, ferdig, beskrivelse, bruker_id, liste_id) VALUES ?', [gjoremaler], function(err,rows,fields){
      if(err)
        return next(err);
      res.send(rows);
    });
  });
});

// Oppdater en liste
server.put('rest/gjoremalsliste',function(req,res,next){
  connection.query("UPDATE Gjoremalsliste SET ? WHERE id=?", [req.body, req.body.id], function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});
