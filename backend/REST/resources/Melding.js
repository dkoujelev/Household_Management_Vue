let util = require('../util');
let connection_prod = require('../connection_prod');

module.exports = function(asdf, server){

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

    connection_prod.connection.query("INSERT INTO Melding SET ?", [req.body], function(err, rows, fields){
      if(err)
        return next(err);

      res.send(rows);
      return next();
    });
  });

// Hent meldinger skrevet av en bruker
  server.get('rest/melding/sendt/bruker/:skrevet_av_bruker',function(req, res, next){
    connection_prod.connection.query("SELECT * FROM Melding WHERE skrevet_av_bruker=?", [req.params.skrevet_av_bruker], function(err, rows, fields){
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
    connection_prod.connection.query("SELECT * FROM Melding WHERE sendt_til_bruker=?", [req.params.sendt_til_bruker], function(err, rows, fields){
      if(err)
        return next(err);

      res.send(rows);
      return next();
    });
  });

// Hente meldinger til et kollektiv
  server.get('rest/melding/motta/kollektiv/:sendt_til_kollektiv',function(req, res, next){
    connection_prod.connection.query("SELECT * FROM Melding WHERE sendt_til_kollektiv=? ORDER BY sendt DESC", [req.params.sendt_til_kollektiv], function(err, rows, fields){
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

  // Slett en melding
  server.del('rest/melding/:melding_id', (req,res,next) => {
    connection_prod.connection.query('DELETE FROM Melding WHERE melding_id=?', [req.params.melding_id], (err,rows,fields) => {
      if(err)
        return next(err);

      res.send(rows);
      return next();
    });
  });

  // Oppdatere melding - TRENGER IKKE

};
