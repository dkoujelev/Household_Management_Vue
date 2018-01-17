let server = require("../server");
let connection = require("../connection");

// Hent et bestemt gjoremal
server.get('rest/gjoremal/:gjoremal_id',function(req, res, next){
  connection.query("SELECT * FROM Gjoremalsliste WHERE id=?", [req.params.gjoremal_id], function(err, rows, fields){
    res.send(err ? err : (rows.length == 1 ? rows[0] : null)); //? = hvis det skjer looper erro igjennom rows.length
    return next();
  });
});

//Hent alle gjoremal i en liste
server.get('rest/gjoremalliste/:id',function(req, res, next){
  connection.query("SELECT * FROM Gjoremalsliste WHERE undergruppe_id=?", [req.params.id], function(err, rows, fields){
    res.send(err ? err : (rows.length == 1 ? rows[0] : null));
    return next();
  });
});

// Opprette nytt gjoremal og sette inn i gjøremålsliste
server.post('rest/gjoremal/:id',function(req, res, next){
  connection.query("INSERT INTO Gjoremalsliste SET ?", req.body, function(err, rows, fields){
    if(err){res.send(err); return next();
    }
  });
});

// Oppdatere et gjoremal
server.put('rest/gjoremal',function(req,res,next){
  connection.query("UPDATE Gjoremal SET ? WHERE id=?", [req.body, req.body.id], function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});

