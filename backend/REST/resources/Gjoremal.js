let server = require("../server");
let connection = require("../connection");

// Hent et bestemt gjoremal
server.get('rest/gjoremal/:gjoremal_id',function(req, res, next){
  connection.query("SELECT * FROM Gjoremalsliste WHERE id=?", [req.params.gjoremal_id], function(err, rows, fields){

    if('start' in rows)
      rows.start = new Date(rows.start);
    if('frist' in rows)
      rows.frist = new Date(rows.frist);
    if('ferdig' in rows)
      rows.ferdig = new Date(rows.ferdig);

    res.send(err ? err : (rows.length == 1 ? rows[0] : null));
    return next();
  });
});

// Opprette nytt gjoremal
server.post('rest/gjoremal/',function(req, res, next){
  if('start' in req.body)
    req.body.start = new Date(req.body.start).getTime();
  if('frist' in req.body)
    req.body.frist = new Date(req.body.frist).getTime();
  if('ferdig' in req.body)
    req.body.ferdig = new Date(req.body.ferdig).getTime();

  connection.query("INSERT INTO Gjoremal SET ?", req.body, function(err, rows1, fields){

    if(err){res.send(err); return next();}
  });
});

// Oppdatere et gjoremal
server.put('rest/gjoremal',function(req,res,next){
  if('start' in req.body)
    req.body.start = new Date(req.body.start).getTime();
  if('frist' in req.body)
    req.body.frist = new Date(req.body.frist).getTime();
  if('ferdig' in req.body)
    req.body.ferdig = new Date(req.body.ferdig).getTime();

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
