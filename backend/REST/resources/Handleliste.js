let util = require('../util');

module.exports = function(connection, server){

// Hent en fullstendig handleliste
  server.get('rest/handleliste/:handleliste_id',function(req, res, next){
    connection.query("SELECT * FROM Handleliste WHERE handleliste_id=?", [req.params.handleliste_id], function(err, rows, fields){
      if(err || rows.length != 1)
        return next(err);

      let handleliste = rows[0];

      if('opprettet' in handleliste)
        handleliste.opprettet = new Date(handleliste.opprettet);
      if('frist' in handleliste)
        handleliste.frist = new Date(handleliste.frist);
      if('handling_utfort' in handleliste)
        handleliste.handling_utfort = new Date(handleliste.handling_utfort);

      connection.query("SELECT Vare.* FROM Vare " +
        "INNER JOIN Handleliste ON Vare.handleliste_Id=Handleliste.handleliste_id WHERE Handleliste.handleliste_id=?", req.params.handleliste_id, function(err, rows, fields){
        if(err)
          return next(err);

        handleliste.varer = JSON.parse(JSON.stringify(rows));

        res.send(handleliste);
        return next();

      });
    });
  });

// Post en fullstendig handleliste
  server.post('rest/handleliste/',function(req,res,next){

    let handleliste = Object.assign({}, req.body);
    if('varer' in handleliste)
      delete handleliste.varer;

      handleliste.opprettet = util.getCurrentTimeAsEpoch();
    if('frist' in handleliste)
      handleliste.frist = new Date(handleliste.frist).getTime();
    if('handling_utfort' in handleliste)
      handleliste.handling_utfort = new Date(handleliste.handling_utfort).getTime();

    connection.query('INSERT INTO Handleliste SET ?', [handleliste], function(err,rows,fields){
      if(err)
        return next(err);

      let varer = [];
      for(let vare of req.body.varer){
        let varen = [];
        varen.push(vare.navn);
        varen.push(rows.insertId);
        varen.push(vare.antall);
        varer.push(varen);
      }

      console.log(JSON.stringify(varer));

      connection.query('INSERT INTO Vare (navn, handleliste_id, antall) VALUES ?', [varer], function(err,rows,fields){
        if(err)
          return next(err);
        res.send(rows);
      });
    });
  });


// Hent handlelister for en bestemt undergruppe
  server.get('rest/handlelisteForUndergruppe/:undergruppe_id',function(req, res, next) {
    connection.query("SELECT * FROM Handleliste WHERE undergruppe_id=?", [req.params.undergruppe_id], function (err, rows, fields) {

      for(let handleliste of rows){
        if('opprettet' in handleliste)
          handleliste.opprettet = new Date(handleliste.opprettet);
        if('frist' in handleliste)
          handleliste.frist = new Date(handleliste.frist);
        if('handling_utfort' in handleliste)
          handleliste.handling_utfort = new Date(handleliste.handling_utfort);
      }

      res.send(err ? err : rows);
      return next();
    });
  });

// Hent alle handlelister som en bestemt bruker har tilgang til
  server.get('rest/handlelisteForBruker/:bruker_id',function(req, res, next){
    connection.query("SELECT Handleliste.* FROM Handleliste " +
      "INNER JOIN Undergruppe ON Handleliste.undergruppe_id=Undergruppe.undergruppe_id " +
      "INNER JOIN Bruker_Undergruppe ON Undergruppe.undergruppe_id=Bruker_Undergruppe.undergruppe_id " +
      "WHERE bruker_id=?", [req.params.bruker_id], function(err, rows, fields){

      for(let handleliste of rows){
        if('opprettet' in handleliste)
          handleliste.opprettet = new Date(handleliste.opprettet);
        if('frist' in handleliste)
          handleliste.frist = new Date(handleliste.frist);
        if('handling_utfort' in handleliste)
          handleliste.handling_utfort = new Date(handleliste.handling_utfort);
      }

      res.send(err ? err : rows);
      return next();
    });
  });
};
