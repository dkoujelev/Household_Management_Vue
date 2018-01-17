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


// Post et fullstendig gjøremål
server.post('rest/gjoremal/',function(req,res,next) {

  let gjoremal = Object.assign({}, req.body);
  if ('start' in gjoremal)
    gjoremal.start = new Date(gjoremal.start).getTime();
  if ('frist' in gjoremal)
    gjoremal.frist = new Date(gjoremal.frist).getTime();
  if ('ferdig' in gjoremal)
    gjoremal.ferdig = new Date(gjoremal.ferdig).getTime();

//Legg inn i gjoremal
  connection.query('INSERT INTO Gjoremal SET ?', [gjoremal], function (err, rows, fields) {
    if (err)
      return next(err);
  });
});

  // Hent alle gjoremal som en bestemt bruker har tilgang til
  server.get('rest/gjoremalForBruker/:bruker_id', function (req, res, next) {
    connection.query("SELECT Gjoremal.* FROM Handleliste " +
      "INNER JOIN Undergruppe ON Gjoremal.undergruppe_id=Undergruppe.undergruppe_id " +
      "INNER JOIN Bruker_Undergruppe ON Undergruppe.undergruppe_id=Bruker_Undergruppe.undergruppe_id " +
      "WHERE bruker_id=?", [req.params.bruker_id], function (err, rows, fields) {
      res.send(err ? err : rows);
      return next();
    });
  });


// Hent gjoremål for en bestemt undergruppe
server.get('rest/gjoremalForUndergruppe/:undergruppe_id',function(req, res, next) {
  connection.query("SELECT * FROM Gjoremal WHERE undergruppe_id=?", [req.params.undergruppe_id], function (err, rows, fields) {
    res.send(err ? err : rows);
    return next();
  });
});


