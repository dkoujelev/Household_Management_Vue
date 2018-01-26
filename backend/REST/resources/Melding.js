let util = require('../util');

module.exports = function(connection, server){

  /*
   Melding{
   overskrift: '',
   tekst: '',
   skrevet_av_bruker: '' //Bruker id

   //Option til bruker
   sendt_til_bruker: '' //Bruker id

   //Option til kollektiv
   sendt_til_kollektiv: '' //Kollektiv id
   }
   */

// Sende melding til bruker eller kollektiv
  server.post('rest/melding',function(req,res,next){

    req.body.sendt = util.getCurrentTimeAsEpoch();

    connection.query("INSERT INTO Melding SET ?", [req.body], function(err, rows, fields){
      if(err)
        return next(err);

      res.send(rows);
      return next();
    });
  });

// Hent meldinger skrevet av en bruker
  server.get('rest/melding/sendt/bruker/:skrevet_av_bruker',function(req, res, next){
    connection.query("SELECT * FROM Melding WHERE skrevet_av_bruker=? ORDER BY sendt DESC", [req.params.skrevet_av_bruker], function(err, rows, fields){
      if(err)
        return next(err);

      for(let melding of rows){
        if('sendt' in melding)
          melding.sendt = new Date(melding.sendt);
      }

      res.send(rows);
      return next();
    });
  });

// Hent meldinger til en bruker (brukes ikke)
  server.get('rest/melding/motta/bruker/:sendt_til_bruker',function(req, res, next){
    connection.query("SELECT * FROM Melding WHERE sendt_til_bruker=? ORDER BY sendt DESC", [req.params.sendt_til_bruker], function(err, rows, fields){
      if(err)
        return next(err);

      res.send(rows);
      return next();
    });
  });

// Hente meldinger til et kollektiv
  server.get('rest/melding/motta/kollektiv/:sendt_til_kollektiv',function(req, res, next){
    connection.query("SELECT * FROM Melding WHERE sendt_til_kollektiv=? ORDER BY sendt DESC", [req.params.sendt_til_kollektiv], function(err, rows, fields){
      if(err)
        return next(err);

      for(let melding of rows){
        if('sendt' in melding)
          melding.sendt = new Date(melding.sendt);
      }

      res.send(rows);
      return next();
    });
  });

// Hent alle meldinger som en bruker skal se
  server.get('rest/melding/motta/brukerAlle/:bruker_id', function (req, res, next) {
    connection.query("SELECT Melding.* FROM Melding INNER JOIN Bruker_Kollektiv ON Melding.sendt_til_kollektiv = Bruker_Kollektiv.kollektiv_id WHERE bruker_id=? ORDER BY sendt DESC", req.params.bruker_id, function (err, rows, fields) {
      for(let melding of rows){
        if('sendt' in melding)
          melding.sendt = new Date(melding.sendt);
      }
      if(err)
        return next(err);
      res.send(rows);
      return next();
    });
  });

  // Slett en melding
  server.del('rest/melding/:melding_id', (req,res,next) => {
    connection.query('DELETE FROM Melding WHERE melding_id=?', [req.params.melding_id], (err,rows,fields) => {
      if(err)
        return next(err);

      res.send(rows);
      return next();
    });
  });

  // Oppdatere melding
  // Trengs ikke

};
