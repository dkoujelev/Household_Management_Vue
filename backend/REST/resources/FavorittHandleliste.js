let server = require("../server");


/*
BRUKES IKKE


// Get favorite shoppinglist list
server.get('rest/favoritthandleliste/:bruker_id', function (req,res,next) {
  connection.connection.query('SELECT Handleliste.* FROM Handleliste ' +
    'INNER JOIN Bruker_Handleliste WHERE bruker_id=?', req.params.bruker_id, function (err, rows, fields) {
    if(err)
      return next(err);

    for(let liste of rows){
      if('opprettet' in liste)
        liste.opprettet = new Date(liste.opprettet);
      if('frist' in liste)
        liste.frist = new Date(liste.frist);
      if('handling_utfort' in liste)
        liste.handling_utfort = new Date(liste.handling_utfort);
    }
    res.send(JSON.parse(JSON.stringify(rows)));
    return next();
  });
});

// Post favorite shoppinglist
server.post('rest/favoritthandleliste/', function (req,res,next) {
  let liste = req.body;

  if('opprettet' in liste)
    liste.opprettet = new Date(liste.opprettet)f.getTime();
  if('frist' in liste)
    liste.frist = new Date(liste.frist).getTime();
  if('handling_utfort' in liste)
    liste.handling_utfort = new Date(liste.handling_utfort).getTime();

  connection.connection.query('INSERT INTO Bruker_Handleliste SET ?', req.body, function (err,rows,fields) {
    if(err)
      return next(err);
    res.send(rows);
    return next();
  });
});

// Update favorite shoppinglist
server.put('rest/favoritthandleliste/', function (req,res,next) {
  // Not needed
});


// Delete favorite shoppinglist
server.del('rest/favoritthandleliste/', function (req,res,next) {
  connection.connection.query('DELETE FROM Bruker_Handleliste WHERE VALUE=?', req.body, function (err,rows,fields) {
    if(err)
      return next(err);
    res.send(rows);
    return next();
  });
});
*/
