let server = require("../server");
let connection = require("../connection");

// Hent et bestemt gjoremal
server.get('rest/gjoremal/:gjoremal_id',function(req, res, next){
  connection.query("SELECT * FROM Gjoremalsliste WHERE id=?", [req.params.gjoremal_id], function(err, rows, fields){
    res.send(err ? err : (rows.length == 1 ? rows[0] : null));
    return next();
  });
});

// Opprette nytt gjoremal
server.post('rest/gjoremal/:id',function(req, res, next){
  connection.query("INSERT INTO Gjoremalsliste SET ?", req.body, function(err, rows1, fields){
    if(err){res.send(err); return next();}
  });
});

// Oppdatere et gjoremal
server.put('rest/gjoremal',function(req,res,next){
  connection.query("UPDATE Gjoremal SET ? WHERE id=?", [req.body, req.body.id], function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});

//Slett et gjøremål
server.del('rest/gjoremal/:gjoremal_id',function(req,res,next){
  connection.query("DELETE FROM Gjoremal WHERE id=?", [req.params.gjoremal_id], function(err,rows,fields){
    res.send(err ? err : rows);
    return next();
  });
});
