let util = require("../util");
let mysql = require("mysql");

module.exports = function(connection, server){

  // Opprett et gjeld-objekt i basen.
  // Send inn belop, beskrivelse, bruker_skylder_id og bruker_innkrever_id
  // Valgfritt: betalt (timestamp), kostnad_id
  server.post('rest/gjeld',(req,res,next) => {

    req.body.opprettet = util.getCurrentTimeAsEpoch();

    if('betalt' in req.body)
      req.body.betalt = new Date(req.body.betalt).getTime();

    connection.query('INSERT INTO Gjeld SET ?', [req.body], (err,rows,fields) => {
      if(err)
        return next(err);

      res.send(rows);
      return next();
    });
  });

  // Hent gjeld-objekt fra basen
  server.get('rest/gjeld/:gjeld_id', (req,res,next) => {
    connection.query('SELECT * FROM Gjeld where gjeld_id=?',[req.params.gjeld_id], (err,rows,fields) => {
      if(err)
        return next(err);

      if(rows.length < 1){
        //console.log("Sending null for id " + req.params.gjeld_id);
        res.send(null);
      }
      else{
        if('betalt' in rows[0])
          rows[0].betalt = new Date(rows[0].betalt);
        res.send(rows[0]);
      }


      return next();
    });
  });

  // Returnerer brukerobjekter med tilhørende sum for hver bruker som skylder penger til bruker_id brukeren
  server.get('rest/gjeldBrukerErSkyldig/:bruker_id',function(req,res,next) {
    connection.query('SELECT SUM(Gjeld.belop) AS sum, Bruker.* FROM Gjeld INNER JOIN Bruker ' +
      'ON Bruker.bruker_id=Gjeld.bruker_innkrever_id WHERE ' +
      'Gjeld.bruker_skylder_id=? GROUP BY Gjeld.bruker_innkrever_id', [req.params.bruker_id],function(err, rows, fields){
      for(row of rows)
        delete row.hashed_passord;

      if(err)
        return next(err);

      res.send(rows);
      return next();
    });
  });

  // Returnerer brukerobjekter med tilhørende sum for hver bruker som bruker_id-brukeren skylder penger
  server.get('rest/gjeldBrukerKreverInn/:bruker_id',function(req,res,next) {
    connection.query('SELECT SUM(Gjeld.belop) AS sum, Bruker.* FROM Gjeld INNER JOIN Bruker ' +
      'ON Bruker.bruker_id=Gjeld.bruker_skylder_id WHERE ' +
      'Gjeld.bruker_innkrever_id=? GROUP BY Gjeld.bruker_skylder_id', [req.params.bruker_id],function(err, rows, fields){
      for(row of rows)
        delete row.hashed_passord;

      if(err)
        return next(err);

      res.send(rows);
      return next();
    });
  });

// Henter all gjeld som er registrert fra en bestemt bruker til en annen bestemt bruker
// For å hente all gjeld fra bruker 1 til bruker 2, send følgende i request body:
// {skylder: 1, innkrever: 2}
  server.post('rest/gjeldSpesifisert', function(req,res,next) {
    connection.query('SELECT * FROM Gjeld WHERE Gjeld.bruker_skylder_id=? ' +
      'AND Gjeld.bruker_innkrever_id=?', [req.body.skylder, req.body.innkrever], function (err, rows, fields) {
      if (err)
        return next(err);

      res.send(rows);
      return next();
    });
  });
  // Sett gjeldsposteringer til betalt
  // Om du ønsker å slette kun en postering, sett i parameter gjeld_id
  // Om du ønsker å slette flere samtidig, sett inn id'er i request body slik:
  //
  // {ids: [13,23,34]}
  server.post('rest/settGjeldSomBetalt/:gjeld_id', (req,res,next) => {
    let now = util.getCurrentTimeAsEpoch();

    connection.query('UPDATE Gjeld SET betalt = ? WHERE gjeld_id=?', [now, req.params.gjeld_id],(err,rows,fields) => {
      if(err)
        return next(err);

      res.send(rows);
      return next();
    });
  });

  // Sett flere gjeldsposter som betalt, sett inn ID'er i body sånn:
  // {ids: [2,3,4]}
  server.post('rest/settFlereGjeldSomBetalt',(req,res,next) => {
    let now = util.getCurrentTimeAsEpoch();

    let sql = "";

    for(id of req.body.ids)
      sql += mysql.format('UPDATE Gjeld SET betalt = ? WHERE gjeld_id=?', [now, id]) + "; ";

    connection.query(sql, (err, rows, fields) => {
      if(err)
        return next(err);

      res.send(rows);
      return next();
    });
  });
};
