let util = require('../util');

module.exports = function(connection, server){

// Hent en fullstendig handleliste
  server.get('rest/handleliste/:handleliste_id',function(req, res, next){
    connection.query("SELECT * FROM Handleliste WHERE handleliste_id=?", [req.params.handleliste_id], function(err, rows, fields){

      if(err)
        return next(err);
      else if(rows.length != 1) {
        res.send("Shoppinglist not found!");
        return next();
      }

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

      // Trenger ikke å legge inn varer.
      if(!('varer' in req.body) || req.body.varer.length == 0){
        res.send(rows);
        return next();
      }

      let varer = [];
      for(let vare of req.body.varer){
        let varen = [];
        varen.push(vare.navn);
        varen.push(rows.insertId);
        varen.push(vare.antall);
        varer.push(varen);
      }

      //console.log(JSON.stringify(varer));

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

// Oppdater en handleliste
  server.put('res/handleliste/', function (req,res,next) {
    /*
    let varer;
    if('varer' in req){
      varer = req.body.varer;
      req.delete('varer')
    }
    */
    if('opprettet' in req)
      req.opprettet = new Date(req.opprettet).getTime();
    if('frist' in req)
      req.frist = new Date(req.frist).getTime();
    if('handling_utfort' in req)
      req.handling_utfort = new Date(req.handling_utfort).getTime();

    connection.query('UPDATE Handleliste SET ? WHERE handleliste_id=?', [req.body, req.body.handleliste_id], function (err,rows,fields) {
      if(err)
        return next(err);
      res.send(rows);
      return next();
      /*
      connection.query('SELECT * FROM Vare WHERE handleliste_id=?', req.body.handleliste_id, function (err, rows, fields) {
        if(err)
          return next(err);
        let varerDelete = [];
        let varerUpdate = [];
        let varerNew = [];
        let vareId = [];
        for(vare of varer){
          if('vare_id' in vare){
            for(row of rows) {
              if (vare.vare_id === row.vare_id) {
                varerUpdate.push(vare);
                vareId.push(vare.vare_id);
                rows.delete(row);
              }
            }
          } else {
            varerNew.push(vare);
          }
        }
        for(row of rows){
          varerDelete.push(row);
        }
        connection.query('UPDATE Vare SET ? WHERE ?', [varerUpdate, varerId], function (err, rows, fields) {
          if(err)
            return next(err);
          res.send(rows);
          return next();
        });
      });
      */
    });
  });

// Slett en liste
  server.del('rest/handleliste/:handleliste_id', function (req ,res, next) {
    connection.query('DELETE FROM Vare WHERE handleliste_id=?', req.params.handleliste_id, function (err, rows, fields) {
      if(err)
        return next(err);
      connection.query('DELETE FROM Handleliste WHERE handleliste_id=?', req.params.handleliste_id, function (err, rows, fields) {
        if(err)
          return next(err);
        res.send(rows);
        return next();
      });
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
};
