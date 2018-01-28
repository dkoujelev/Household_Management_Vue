let util = require('../util');
let auth = require('../auth');

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


    if(!auth.checkThatSessionHasUserId(req,res,req.body.skrevet_av_bruker))
      return next();


    req.body.sendt = util.getCurrentTimeAsEpoch();
    connection.query("INSERT INTO Melding SET ?", [req.body], function(err, rows, fields){
      if(err){
          console.log('SQL Error:   ' + err.code + ': ' + err.sqlMessage);
          console.log('SQL query:   ' + err.sql);
        return next(err);
      }else{
        // We know it's good, add notification
          let recipients = [];
          connection.query("SELECT bruker_id FROM Bruker_Kollektiv WHERE kollektiv_id=? AND NOT bruker_id=?", [req.body.sendt_til_kollektiv,req.body.skrevet_av_bruker], function (err, rows0, fields) {
            recipients = rows0;
            for(i=0;i<recipients.length;i++){
              let newNotification = {
                opprettet:util.getCurrentTimeAsEpoch(),
                tekst: 'Det er lagt ut en ny melding til nyhetsfeed',
                lest:0,
                id:null,
                bruker_id:recipients[i].bruker_id
              };
              connection.query("INSERT INTO Notifikasjon SET ?", newNotification, function (err, rows1, fields) {    
                if(err){
                  console.log('SQL Error:   ' + err.code + ': ' + err.sqlMessage);
                  console.log('SQL query:   ' + err.sql);
                  console.log('');
                }else{
                  //console.log('Ny notifikasjon for bruker_id: ' + newNotification.bruker_id);
                  connection.query("SELECT * FROM Notifikasjon", function (err, rows2, fields) {    
                    //console.log('Resulat for ny notifikasjon for bruker_id: ' + newNotification.bruker_id);
                    if(err){
                      console.log('SQL Error:   ' + err.code + ': ' + err.sqlMessage);
                      console.log('SQL query:   ' + err.sql);
                      console.log('');
                    }else{
                      for(i=0;i<rows2.length;i++){
                        //console.log('id=' + rows2[i].id + ' bruker_id=' + rows2[i].bruker_id  + ' opprettet=' + rows2[i].opprettet + ' lest=' + rows2[i].lest + ' tekst=' + rows2[i].tekst);
                      };
                      //console.log('------');
                    };
                  });
                };
              });
            };
          });
        res.send(rows);
        return next();
      };
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
