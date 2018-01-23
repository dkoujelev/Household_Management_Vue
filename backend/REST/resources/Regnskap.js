module.exports = function(connection, asdf){

// Denne filen brukes ikke

// Hente et bestemt regnskap
  server.get('rest/regnskap/:regnskap_id', function(req,res,next){
    connection.connection.query('SELECT * FROM Regnskap WHERE regnskap_id=?', [req.params.regnskap_id], function(err,rows,fields){
      if(err || rows.length != 1)
        next(err);

      let regnskap = rows[0];

      connection.connection.query('SELECT Kostnad* FROM Kostnad WHERE regnskap_id=?', [req.params.regnskap_id], function(err,rows,fields){
        if(err)
          return next(err);

        for(let kostnad in rows){
          if('opprettet' in kostnad)
            kostnad.opprettet = new Date(kostnad.opprettet);
        }

        regnskap.kostndad = JSON.parse(JSON.stringify(rows));

        rest.send(regnskap);
        return next();
      });
    });
  });
  /*
   // Hente regnskap for en undergruppe
   server.get('rest/regnskap/:undergtuppe_id', function(req,res,next){
   connection.connection.query('SELECT * FROM Regnskap WHERE undergruppe_id=?', [req.params.undergruppe_id], function (err,rows,fields) {
   if (err)
   return next(err);
   let regnskaper = [rows.length];
   for (let regnskap in rows) {
   if('opprettet' in regnskap)
   regnskap.opprettet = new Date(regnskap.opprettet);
   }
   connection.connection.query('',[req.params.undergruppe_id, function (err,rows,fields) {
   let regnskaper = [rows.length];
   for(let i = 0; i < rows.length; i++){
   if('opprettet' in regnskaper[i])
   ;
   }
   }]);
   });
   });
   */

};
