module.exports = function(connection, server){

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
};
