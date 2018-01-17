let server = require("../server");
let connection = require("../connection");

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
