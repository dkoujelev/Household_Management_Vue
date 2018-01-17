let server = require("../server");
let connection = require("../connection");

// Hente en kostnad
server.get('rest/kostnad/:kostnad_id', function (req,res,next) {
  connection.query('SELECT * FROM Kostnad WHERE kostnad_id=?', req.params.kostnad_id , function (err,rows,fields) {
    if(err || rows.length != 1)
      return next(err);

    let kostnad = rows[0];

    if('opprettet' in kostnad)
      kostnad.opprettet = new Date(kostnad.opprettet);

    kostnad = JSON.parse(JSON.stringify(kostnad));

    res.send(kostnad);
    return next();
  });
});

// Hent kostnader ti ei handleliste
server.get('rest/kostnaderForHandleliste/:handleliste_id', function (req,res,next) {
  connection.query('SELECT * FROM Kostnad WHERE handleliste_id=?', req.params.handleliste_id, function (err, rows, field) {
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

// Leg til en kostnad
server.post('rest/kostnad/', function (req, res, next) {
  let kostnad = Object.assign({}, req.body);

  if('opprettet' in kostnad)
    kostnad.opprettet = new Date(kostnad.opprettet).getTime();

  connection.query('INSERT INTO Kostnad SET ?', [kostnad], function (err, rows, fields) {
    if(err)
      return next(err);

    connection.query('SELECT bruker_id FROM Bruker_Undergruppe WHERE undergruppe_id=?', req.body.undergruppe_id, function (err, rows, field) {
      if(err)
        return next(err);

      let sum = kostnad.sum / rows.length;
      let gjeld = [];

      for(let bruker of rows){
        if(!('bruker_id' in bruker.equals(req.body.bruker_id))){
          gjeld.push(sum);
          gjeld.push(kostnad.opprettet);
          gjeld.push(kostnad.tittel);
          gjeld.push(bruker.bruker_id);
          gjeld.push(kostnad.bruker_id);
          gjeld.push(kostnad.kostnad_id);
        }
      }

      connection.query('INSERT INTO Gjeld (belop, opprettet, beskrivelse, bruker_skylder_id, bruker_innkrever_id, kostnad_id)VALUE ?', [gjeld], function (err, rows, field) {
        if(err)
          return next(err);
        res.send(rows);
      });
    });
  });
});
