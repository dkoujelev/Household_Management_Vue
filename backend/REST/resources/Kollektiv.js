let server = require("../server");
let connection = require("../connection");

// Hent et bestemt kollektiv
server.get('rest/kollektiv/:kollektiv_id',function(req, res, next){
  connection.query("SELECT * FROM Kollektiv WHERE kollektiv_id=?", [req.params.kollektiv_id], function(err, rows, fields){
    res.send(err ? err : (rows.length == 1 ? rows[0] : null));
    return next();
  });
});

// Hent et bestemt kollektiv via navn
server.get('rest/kollektivMedNavn/:navn',function(req, res, next){
  connection.query("SELECT * FROM Kollektiv WHERE navn=?", [req.params.navn], function(err, rows, fields){
    res.send(err ? err : (rows.length == 1 ? rows[0] : null));
    return next();
  });
});

// Hent alle kollektiv
server.get('rest/kollektiv/',function(req, res, next){
  connection.query("SELECT * FROM Kollektiv", function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});

// Hent alle kollektiv for en spesifikk bruker
server.get('rest/kollektivForBruker/:bruker_id',function(req, res, next){
  connection.query("SELECT Bruker_Kollektiv.*, Kollektiv.Navn AS navn FROM Bruker_Kollektiv " +
  "INNER JOIN Kollektiv ON Bruker_Kollektiv.kollektiv_id=Kollektiv.kollektiv_id " +
  "WHERE bruker_id=?",req.params.bruker_id, function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});

// Hent alle kollektiv hvor en spesifikk bruker er admin
server.get('rest/kollektivForAdmin/:bruker_id',function(req, res, next){
  connection.query("SELECT Bruker_Kollektiv.*, Kollektiv.Navn AS navn FROM Bruker_Kollektiv " +
  "INNER JOIN Kollektiv ON Bruker_Kollektiv.kollektiv_id=Kollektiv.kollektiv_id " +
  "WHERE bruker_id=? AND er_admin=1",req.params.bruker_id, function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});

// Opprett nytt kollektiv
server.post('rest/kollektiv/:bruker_id',function(req, res, next){
  connection.query("INSERT INTO Kollektiv SET ?", req.body, function(err, rows1, fields){
    if(err){res.send(err); return next();}

    connection.query("INSERT INTO Bruker_Kollektiv SET bruker_id=?, kollektiv_id=?, er_admin=1", [req.params.bruker_id, rows1.insertId], function(err,rows2,fields){
      res.send(err ? err : rows1);
      return next();
    });
  });
});

// Oppdater et kollektiv
server.put('rest/kollektiv',function(req,res,next){
  connection.query("UPDATE Kollektiv SET ? WHERE kollektiv_id=?", [req.body, req.body.kollektiv_id], function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});
