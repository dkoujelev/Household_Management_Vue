let util = require('../util');

module.exports = function(connection, server) {

// Hent en bestemt liste
  server.get('rest/gjoremalsliste/:id', function (req, res, next) {
    connection.connection.query("SELECT * FROM Gjoremalsliste WHERE id=?", [req.params.id], function (err, rows, fields) {
      if (err || rows.length != 1)
        return next(err);

      let liste = rows[0];

      if ('opprettet' in liste)
        liste.opprettet = new Date(liste.opprettet);

      connection.connection.query("SELECT Gjoremal.* FROM Gjoremal " +
        "INNER JOIN Gjoremalsliste ON Gjoremalsliste.id = Gjoremal.liste_id WHERE Gjoremalsliste.id=?", [req.params.id], function (err, rows, fields) {
        if (err)
          return next(err);
        for (let gjoremal of rows) {
          if ('start' in gjoremal)
            gjoremal.start = new Date(gjoremal.start);
          if ('frist' in gjoremal)
            gjoremal.frist = new Date(gjoremal.frist);
          if ('ferdig' in gjoremal)
            gjoremal.ferdig = new Date(gjoremal.ferdig);
        }
        liste.gjoremal = JSON.parse(JSON.stringify(rows));

        res.send(liste);
        return next();
      });
    });
  });

// Hent alle lister i en undergruppe
  server.get('rest/gjoremalslisterUndergruppe/:undergruppe_id', function (req, res, next) {
    connection.connection.query("SELECT * FROM Gjoremalsliste WHERE undergruppe_id=?", [req.params.undergruppe_id], function (err, rows, fields) {
      if (err)
        return next(err);

      for (let gjoremalsliste of rows) {
        if ('opprettet' in gjoremalsliste)
          gjoremalsliste.opprettet = new Date(gjoremalsliste.opprettet);
      }
      let liste = JSON.parse(JSON.stringify(rows));
      res.send(liste);
      return next();
      /*
      connection.connection.query("SELECT Gjoremalsliste.*, Gjoremal.navn as gjoremal, Gjoremal.start, Gjoremal.frist, Gjoremal.ferdig," +
        "Bruker.fornavn, Bruker.etternavn FROM Gjoremalsliste " +
        "INNER JOIN Gjoremal ON Gjoremalsliste.id = Gjoremal.liste_id " +
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
        liste.push(JSON.parse(JSON.stringify(rows)));

        res.send(liste);
        return next();
      });
      */
    });
  });

// Hent alle lister i et kollektiv
  server.get('rest/gjoremalslisterKollektiv/:kollektiv_id', function (req, res, next) {
    connection.connection.query("SELECT DISTINCT Gjoremalsliste.* FROM `Gjoremalsliste` INNER JOIN Undergruppe WHERE kollektiv_id=?", req.params.kollektiv_id, function (err, rows, field) {
      if (err)
        return next(err);
      for (liste of rows) {
        if ('opprettet' in liste)
          liste.opprettet = new Date(liste.opprettet);
      }
      let lister = JSON.parse(JSON.stringify(rows));
      res.send(lister);
      return next();
    });
  });

// Hent alle lister til en bruker
  server.get('rest/gjoremalslisterBruker/:bruker_id', function (req, res, next) {
    connection.connection.query("SELECT DISTINCT Undergruppe.navn AS undergruppe, Gjoremalsliste.* FROM `Gjoremalsliste` INNER JOIN Gjoremal " +
      "INNER JOIN Undergruppe ON Undergruppe.undergruppe_id = Gjoremalsliste.undergruppe_id WHERE bruker_id=?", req.params.bruker_id, function (err, rows, field) {
      if (err)
        return next(err);
      for (liste of rows) {
        if ('opprettet' in liste)
          liste.opprettet = new Date(liste.opprettet);
      }
      let lister = JSON.parse(JSON.stringify(rows));
      res.send(lister);
      return next();
    });
  });

// Opprett ny liste
  server.post('rest/gjoremalsliste/:undergruppe_id', function (req, res, next) {
    let liste = Object.assign({}, req.body);
    liste.opprettet = util.getCurrentTimeAsEpoch();
    /*
    let liste = Object.assign({}, req.body);
    let gjoremaler = [];
    if ('gjoremal' in liste) {
      //gjoremal = Object.assign({}, liste.gjoremal);
      delete liste.gjoremal;
    }
    if ('opprettet' in liste)
      liste.opprettet = util.getCurrentTimeAsEpoch();
    */


    connection.connection.query('INSERT INTO Gjoremalsliste SET ?', [liste], function (err, rows, field) {
      if (err)
        return next(err);
      /*
      for(let item of req.body.gjoremal){
        let gjoremal = [];
        if('start' in item)
          gjoremal.push(new Date(item.start).getTime());
        if('frist' in item)
          gjoremal.push(new Date(item.frist).getTime());
        if('ferdig' in item)
          gjoremal.push(new Date(item.ferdig).getTime());
        gjoremal.push(item.beskrivelse);
        gjoremal.push(item.bruker_id);
        gjoremal.push(rows.insert.id);
        gjoremaler.push(gjoremal);
      }

      //console.log(JSON.stringify(gjoremaler));

      connection.connection.query('INSERT INTO Gjoremal (navn, start, frist, ferdig, beskrivelse, bruker_id, liste_id) VALUES ?', [gjoremaler], function(err,rows,field){
        if(err)
          return next(err);
        res.send(rows);
        return next();
      });
      */
      res.send(rows);
      return next();
    });
  });

// Oppdater en liste
  server.put('rest/gjoremalsliste/', function (req, res, next) {
    let liste = Object.assign({}, req.body);
    if ('opprettet' in liste)
      liste.opprettet = new Date(liste.opprettet).getTime();

    connection.connection.query("UPDATE Gjoremalsliste SET ? WHERE id=?", [req.body, req.body.id], function (err, rows, field) {
      if (err)
        return next(err);
      /*
      connection.connection.query('SELECT * FROM Gjoremal WHERE liste_id=?', req.body.id, function (err, rows, field) {
        if(err)
          return next(err);
        let gjoremaler = [];
        for(let gjoremal of liste){
          let gjoremalen = [];
          gjoremalen.push(gjoremal.gjoremal_id);
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
        connection.connection.query('UPDATE Gjoremal SET ?', [req.body.gjoremal], function (err,rows,field) {
          if(err)
            return next(err);

          return next(rows);
        });
      });
      */
      res.send(rows);
      return next();
    });
  });

// Slett en liste
  server.del('rest/gjoremalsliste/', function (req, res, next) {
    connection.connection.query('DELETE FROM Gjoremal WHERE liste_id=?', req.body.id, function (err, rows, field) {
      if (err)
        return next(err);
      //let info = rows;
      connection.connection.query('DELETE FROM Gjoremalsliste WHERE id=?', req.body.id, function (err, rows, field) {
        if (err)
          return next(err);
        res.send(rows);
        return next();
      });
    });
  });

// Favorittiser en gjoremalsliste
  server.put('rest/favorittGjoremalsliste/', function (req, res, next) {
    connection.connection.query('UPDATE Gjoremalsliste SET favoritt=? WHERE id=?', [req.body.favoritt, req.body.id], function (err, rows, fields) {
      if(err)
        return next(err);
      res.send(rows);
      return next();
    });
  });
};
