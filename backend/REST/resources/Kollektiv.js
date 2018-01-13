let server = require("../server");
let connection = require("../connection");

// Hent et bestemt kollektiv
server.get('rest/kollektiv/:kollektiv_id',function(req, res, next){
  connection.query("SELECT * FROM Kollektiv WHERE kollektiv_id=?", [req.params.kollektiv_id], function(err, rows, fields){
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

// Opprett nytt kollektiv
server.post('rest/kollektiv/',function(req, res, next){
  connection.query("INSERT INTO Kollektiv SET ?", req.body, function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});

// Oppdater et kollektiv
server.put('rest/kollektiv',function(req,res,next){
  connection.query("UPDATE Kollektiv SET ? WHERE kollektiv_id=?", [req.body, req.body.kollektiv_id], function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});
