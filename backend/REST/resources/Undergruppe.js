let server = require("../server");
let connection = require("../connection");

server.get('rest/undergruppe/:undergruppe_id',function(req, res, next){
  connection.query("SELECT * FROM Undergruppe WHERE undergruppe_id=?", [req.params.undergruppe_id], function(err, rows, fields){
    res.send(err ? err : (rows.length == 1 ? rows[0] : null));
    return next();
  });
});

server.get('rest/undergruppe/',function(req, res, next){
  connection.query("SELECT * FROM Undergruppe", req.body, function(err, rows, fields){
    res.send(err ? err : (rows.length == 1 ? rows[0] : null));
    return next();
  });
});

server.post('rest/undergruppe/',function(req, res, next){
  connection.query("INSERT INTO Undergruppe SET ?", req.body, function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});

server.put('rest/undergruppe/',function(req, res, next){
  connection.query("UPDATE Undergruppe SET ? WHERE undergruppe_id=?", [req.body, req.body.undergruppe_id], function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});
