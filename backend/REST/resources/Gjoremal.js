let util = require('../util');

module.exports = function(connection, server){

  // Hent et bestemt gjoremal
  server.get('rest/gjoremal/:gjoremal_id',function(req, res, next){
    connection.query("SELECT * FROM Gjoremal WHERE gjoremal_id=?", req.params.gjoremal_id, function(err, rows, field){
      if(err)
        return next(err);
      if(rows.length !== 1){
        res.send('Gjoremal not found!');
        return next();
      }
      let gjoremal = rows[0];
      if(typeof gjoremal !== 'undefined') {
        if ('start' in gjoremal && gjoremal.start !== null)
          gjoremal.start = new Date(gjoremal.start);
        if ('frist' in gjoremal && gjoremal.frist !== null)
          gjoremal.frist = new Date(gjoremal.frist);
        if ('ferdig' in gjoremal && gjoremal.ferdig !== null)
          gjoremal.ferdig = new Date(gjoremal.ferdig);
      }
      res.send(gjoremal);
      return next();
    });
  });

  // Hent alle gjoremal i en liste
  server.get('rest/gjoremaler/:id', function (req,res,next) {
    connection.query('SELECT * FROM Gjoremal WHERE liste_id=? AND deleted=FALSE ' +
      'ORDER BY (frist IS NULL) , (frist) , start ASC', req.params.id, function (err,rows,field) {
      if(err)
        return next(err);
      for(let gjoremal of rows){
        if ('start' in gjoremal && gjoremal.start !== null)
          gjoremal.start = new Date(gjoremal.start);
        if ('frist' in gjoremal && gjoremal.frist !== null)
          gjoremal.frist = new Date(gjoremal.frist);
        if ('ferdig' in gjoremal && gjoremal.ferdig !== null)
          gjoremal.ferdig = new Date(gjoremal.ferdig);
      }
      res.send(rows);
      return next(rows);
    })
  });

  // Opprette nytt gjoremal
  server.post('rest/gjoremal/',function(req, res, next){

    req.body.start = util.getCurrentTimeAsEpoch();
    if('frist' in req.body && req.body.frist !== null)
      req.body.frist = new Date(req.body.frist).getTime();
    if('ferdig' in req.body && req.body.ferdig !== null)
      req.body.ferdig = new Date(req.body.ferdig).getTime();

    connection.query("INSERT INTO Gjoremal SET ?", req.body, function(err, rows, field){
      if(err)
        return next(err);
      res.send(rows);
      return next();
    });
  });

  // Oppdatere et gjoremal
  server.put('rest/gjoremal/',function(req,res,next){
    let id = req.body.gjoremal_id;
    //console.log(id);
    if('start' in req.body && req.body.start !== null)
      req.body.start = new Date(req.body.start).getTime();
    if('frist' in req.body && req.body.frist !== null)
      req.body.frist = new Date(req.body.frist).getTime();
    if('ferdig' in req.body && req.body.ferdig !== null)
      req.body.ferdig = new Date(req.body.ferdig).getTime();

    connection.query("UPDATE Gjoremal SET ? WHERE gjoremal_id=?", [req.body, id], function(err, rows, fields){

      res.send(err ? err : rows);
      return next();
    });
  });

  //Slett et gjøremål
  server.del('rest/gjoremal/:gjoremal_id',function(req,res,next){
    connection.query("UPDATE Gjoremal SET deleted=TRUE WHERE gjoremal_id=?", [req.params.gjoremal_id], function(err,rows,fields){
      res.send(err ? err : rows);
      return next();
    });
  });
};
