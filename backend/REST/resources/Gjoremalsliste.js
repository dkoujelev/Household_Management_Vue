module.exports = function(connection, server){

// Hent en bestemt liste
  server.get('rest/gjoremalsliste/:id',function(req, res, next){
    connection.query("SELECT * FROM Gjoremalsliste WHERE id=?", [req.params.id], function(err, rows, fields){
      if(err || rows.length != 1)
        return next(err);

      let liste = rows[0];

      if('opprettet' in liste)
        liste.opprettet = new Date(liste.opprettet);

      connection.query("SELECT Gjoremal.* FROM Gjoremal " +
        "INNER JOIN Gjoremalsliste ON Gjoremalsliste.id = Gjoremal.liste_id WHERE Gjoremalsliste.id=?", [req.params.id], function(err, rows, fields){
        if(err)
          return next(err);
        for(let gjoremal of rows){
          if('start' in gjoremal)
            gjoremal.start = new Date(gjoremal.start);
          if('frist' in gjoremal)
            gjoremal.frist = new Date(gjoremal.frist);
          if('ferdig' in gjoremal)
            gjoremal.ferdig = new Date(gjoremal.ferdig);
        }
        liste.gjoremal = JSON.parse(JSON.stringify(rows));

        res.send(liste);
        return next();
      });
    });
  });

//Hent alle lister i en undergruppe
  server.get('rest/gjoremalsliste/:undergruppe_id',function(req, res, next){
    connection.query("SELECT * FROM Gjoremalsliste WHERE undergruppe_id=?", [req.params.undergruppe_id], function(err, rows, fields){
      if(err)
        return next(err);
      let liste = JSON.parse(JSON.stringify(rows));
      for(let gjoremalsliste of rows){
        liste = rows[i];
        if('opprettet' in gjoremalsliste)
          rows.opprettet = new Date(rows.opprettet);
      }

      connection.query("SELECT Gjoremalsliste.*, Gjoremal.navn as gjoremal, Gjoremal.start, Gjoremal.frist, Gjoremal.ferdig," +
        "Bruker.fornavn, Bruker.etternavn FROM Gjoremalsliste " +
        "INNER JOIN Gjoremal ON Gjoremalsliste.id = Gjoremal.liste_id" +
        "INNER JOIN Bruker", req.params.undergruppe_id, function(err, rows, fields){
        if(err)
          return next(err);
        for(let item of rows){
          if('opprettet' in item)
            item.opprettet = new Date(item.opprettet);
          if('start' in item)
            item.start = new Date(item.start);
          if('frist' in item)
            item.frist = new Date(item.frist);
          if('ferdig' in item)
            item.ferdig = new Date(item.ferdig);
        }
        liste.gjoremal = JSON.parse(JSON.stringify(rows));

        res.send(liste);
        return next();
      });
    });
  });
  /*
   // Hent alle lister
   server.get('rest/gjoremalsliste/:kollektiv_id',function(req, res, next){
   connection.query("SELECT * FROM Gjoremalsliste WHERE ", function(err, rows, fields){
   res.send(err ? err : rows);
   return next();
   });
   });
   */
// Opprett ny liste
  server.post('rest/gjoremalsliste/:undergruppe_id',function(req, res, next){
    /*
     connection.query("INSERT INTO Gjoremalsliste SET ?", req.body, function(err, rows, fields){
     if(err)
     res.send(err);
     return next();
     let liste = Object.assign({}, req.body);

     if('gjoremal' in liste)
     delete liste.gjoremal;

     if('opprettet' in liste)
     liste.opprettet = new Date(liste.opprettet).getTime();
     });
     */
    connection.query('INSERT INTO Gjoremalsliste SET ?', [liste], function(err,rows,fields){
      if(err)
        return next(err);

      let gjoremaler = [];
      for(let gjoremal of req.body.gjoremaler){
        let gjoremalen = [];
        /*
         if('start' in gjoremal)
         gjoremal.start = new Date(gjoremal.start).getTime();
         if('frist' in gjoremal)
         gjoremal.frist = new Date(gjoremal.frist).getTime();
         if('ferdig' in gjoremal)
         gjoremal.ferdig = new Date(gjoremal.ferdig).getTime();
         */
        gjoremalen.push(gjoremal.navn);
        if('start' in gjoremal)
          gjoremalen.push(new Date(gjoremal.start).getTime());
        if('frist' in gjoremal)
          gjoremalen.push(new Date(gjoremal.frist).getTime());
        if('ferdig' in gjoremal)
          gjoremalen.push(new Date(gjoremal.ferdig).getTime());
        gjoremalen.push(gjoremal.beskrivelse);
        gjoremalen.push(gjoremal.bruker_id);
        gjoremalen.push(rows.insertId);
        gjoremaler.push(gjoremalen);
      }

      console.log(JSON.stringify(gjoremaler));

      connection.query('INSERT INTO Gjoremal (navn, start, frist, ferdig, beskrivelse, bruker_id, liste_id) VALUES ?', [gjoremaler], function(err,rows,fields){
        if(err)
          return next(err);
        res.send(rows);
      });
    });
  });

// Oppdater en liste
  server.put('rest/gjoremalsliste',function(req,res,next){
    connection.query("UPDATE Gjoremalsliste SET ? WHERE id=?", [req.body, req.body.id], function(err, rows, fields){
      res.send(err ? err : rows);
      return next();
    });
  });
};
