let util = require('../util');

module.exports = function(connection, server){

// Hente en kostnad
  server.get('rest/kostnad/:kostnad_id', function (req,res,next) {
    connection.query('SELECT * FROM Kostnad WHERE kostnad_id=?', req.params.kostnad_id , function (err,rows,fields) {
      if(err)
        return next(err);
      else if(rows.length !== 1){
        res.send(null);
        return next();
      }

      let kostnad = rows[0];

      if('opprettet' in kostnad)
        kostnad.opprettet = new Date(kostnad.opprettet);

      kostnad = JSON.parse(JSON.stringify(kostnad));

      res.send(kostnad);
      return next();
    });
  });

// Hent kostnader til ei handleliste
  server.get('rest/kostnaderForHandleliste/:handleliste_id', function (req,res,next) {
    connection.query('SELECT * FROM Kostnad WHERE handleliste_id=?', req.params.handleliste_id, function (err, rows, field) {
      if(err)
        return next(err);

      for(let kostnad of rows){
          kostnad.opprettet = new Date(kostnad.opprettet);
      }

      JSON.parse(JSON.stringify(rows));

      res.send(rows);
      return next();
    });
  });

// Hent kostnader til en undergruppe
  server.get('rest/kostnaderForUndergruppe/:undergruppe_id', function (req,res,next) {
    connection.query('SELECT * FROM Kostnad WHERE undergruppe_id=?', req.params.undergruppe_id , function (err, rows, field) {
      if(err)
        return next(err);

      for(let kostnad of rows){
        if('opprettet' in kostnad)
          kostnad.opprettet = new Date(kostnad.opprettet);
      }

      JSON.parse(JSON.stringify(rows));

      res.send(rows);
      return next();
    });
  });

// Legg til en kostnad
  server.post('rest/kostnad/', function (req, res, next) {
    let kostnad = req.body;

    kostnad.opprettet = util.getCurrentTimeAsEpoch();

    connection.query('INSERT INTO Kostnad SET?', [kostnad], function (err, rows, fields) {
      if(err)
        return next(err);
      kostnad.kostnad_id = rows.insertId;
      connection.query('SELECT bruker_id FROM Bruker_Undergruppe WHERE undergruppe_id=?', req.body.undergruppe_id, function (err, rows, field) {
        if(err)
          return next(err);

        // Only self in group, no reason to share costs
        if(rows.length <= 1){
          res.send(null);
          return null;
        }

        let sum = Math.round(kostnad.sum / rows.length);
        let gjelder = [];

        for(let bruker of rows){
          if(!(bruker.bruker_id === req.body.bruker_id)){
            let gjeld = [];
            gjeld.push(sum);
            gjeld.push(kostnad.opprettet);
            gjeld.push(kostnad.tittel);
            gjeld.push(bruker.bruker_id);
            gjeld.push(kostnad.bruker_id);
            gjeld.push(kostnad.kostnad_id);
            gjelder.push(gjeld);
          }
        }

        connection.query('INSERT INTO Gjeld (belop, opprettet, beskrivelse, bruker_skylder_id, bruker_innkrever_id, kostnad_id) VALUES ?', [gjelder], function (err, rows, field) {
          if(err)
            return next(err);
          res.send(rows);
        });
      });
    });
  });

  //Slett en kostnad
  // NEI! Er kobla for tett sammen med gjeld til å slette.


  server.put('rest/kostnad/',(req,res,next) => {
    // Ingen grunn for at klient skal ønske å endre denne.
    if('opprettet' in req.body)
      delete req.body.opprettet;

    connection.query('UPDATE Kostnad SET ? WHERE kostnad_id=?',[req.body, req.body.kostnad_id],(err,rows,fields) => {
      if(err)
        return next(err);

      res.send(rows);
      return next();
    });
  });
};
