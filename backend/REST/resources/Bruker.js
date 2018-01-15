let server = require("../server");
let connection = require("../connection");

// Hent en bestemt bruker
server.get('rest/bruker/:bruker_id',function(req, res, next){
  connection.query("SELECT * FROM Bruker WHERE bruker_id=?", [req.params.bruker_id], function(err, rows, fields){
    res.send(err ? err : (rows.length == 1 ? rows[0] : null));
    return next();
  });
});

// Legg til bruker
server.post('rest/bruker/',function(req,res,next){
  connection.query("INSERT INTO Bruker SET ?", req.body, function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});

// Hent alle brukere
server.get('rest/bruker/',function(req, res, next){
  connection.query("SELECT * FROM Bruker", function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});

// Hent alle brukere i et bestemt kollektiv
server.get('rest/brukereIKollektiv/:kollektiv_id',function(req,res,next){
  connection.query("SELECT Bruker.* FROM Bruker " +
    "INNER JOIN Bruker_Kollektiv ON Bruker.bruker_id = Bruker_Kollektiv.bruker_id " +
    "INNER JOIN Kollektiv ON Bruker_Kollektiv.kollektiv_id = Kollektiv.kollektiv_id " +
    "WHERE Kollektiv.kollektiv_id = ?", req.params.kollektiv_id , function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});

// Oppdater en bruker
server.put('rest/bruker',function(req,res,next){
  connection.query("UPDATE Bruker SET ? WHERE bruker_id=?", [req.body, req.body.bruker_id], function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});
