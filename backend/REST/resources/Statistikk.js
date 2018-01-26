module.exports = function(connection, server) {
  // Hent statistikk over alle kjøpte varer i en undergruppe
  // NOT USED)
  server.post('rest/statistikkMestKjopteVarerUndergruppe/:undergruppe_id', function (req, res, next) {
    connection.query('SELECT * FROM Vare INNER JOIN Handleliste ON Vare.handleiste_id = Handleliste.handleiste_id ' +
      'WHERE undergruppe_id=? AND handling_utfort IS NOT NULL', req.params.undergruppe_id, function (err, rows, fields) {
      if(err)
        return next(err);
      res.send(rows);
    });
  });

  // Hent statistikk over alle kjøpte varer i et kollektiv
  server.post('rest/statistikkMestKjopteVarerKollektiv/:kollektiv_id', function (req, res, next) {
    if('fra' in req.body)
      req.body.fra = new Date(req.body.fra).getTime();
    if('til' in req.body)
      req.body.til = new Date(req.body.til).getTime();
    connection.query('SELECT DISTINCT Vare.navn, sum(antall) AS antall FROM `Vare` ' +
      'INNER JOIN Handleliste ON Vare.handleliste_id = Handleliste.handleliste_id ' +
      'INNER JOIN Undergruppe ON Handleliste.undergruppe_id = Undergruppe.undergruppe_id ' +
      'WHERE kollektiv_id=? AND Handleliste.handling_utfort >=? AND Handleliste.handling_utfort <=? ' +
      'GROUP BY (Vare.navn) ORDER BY antall DESC LIMIT ?', [req.params.kollektiv_id, req.body.fra, req.body.til, req.body.antall], function (err, rows, fields) {
      if(err)
        return next(err);
      res.send(rows);
    });
  });

  // Hent gjeld til kollektiv
  server.get('rest/statistikkGjeldKollektiv/:kolllektiv_id', function (req, res, next) {
    connection.query('SELECT Bruker.bruker_id, Bruker.fornavn, Bruker.etternavn, sum(belop) AS belop FROM Gjeld ' +
    'INNER JOIN Kostnad ON Gjeld.kostnad_id = Kostnad.kostnad_id ' +
    'INNER JOIN Undergruppe ON Kostnad.undergruppe_id = Undergruppe.undergruppe_id ' +
    'INNER JOIN Bruker ON Gjeld.bruker_skylder_id = Bruker.bruker_id ' +
    'WHERE Undergruppe.kollektiv_id=? AND betalt IS NULL ' +
    'GROUP BY (Gjeld.bruker_skylder_id)', req.params.kollektiv_id, function (err, rows, fields) {
      if(err)
        return next(err);
      res.send(err ? err: rows);
      return next();
    });
  });

  // Hent gjeld til og fra bruker
  // NOT USED
  server.get('rest/statistikkGjeldBruker/:bruker_id', function (req, res, next) {
    connection.query('SELECT', req.params.bruker_id, function (err, rows, fields) {
      if(err)
        return next(err);
      res.send(rows);
      return next();
    });
    //SELECT (Bruker.bruker_id, Bruker.fornavn, Bruker.etternavn, sum(belop) AS belop FROM Gjeld
    //INNER JOIN Kostnad ON Gjeld.kostnad_id = Kostnad.kostnad_id
    //INNER JOIN Bruker ON Gjeld.bruker_skylder_id = Bruker.bruker_id
    //WHERE Bruker.bruker_id=9 AND betalt IS NULL
    //GROUP BY (Gjeld.bruker_skylder_id)) AS inn,
    //
    //  (Bruker.bruker_id, Bruker.fornavn, Bruker.etternavn, sum(belop) AS belop FROM Gjeld
    //INNER JOIN Kostnad ON Gjeld.kostnad_id = Kostnad.kostnad_id
    //INNER JOIN Bruker ON Gjeld.bruker_innkrever_id = Bruker.bruker_id
    //WHERE Bruker.bruker_id=9 AND betalt IS NULL
    //GROUP BY (Gjeld.bruker_innkrever_id)) AS ut

    //SELECT * FROM (SELECT Bruker.bruker_id as brukerSkylder, (Bruker.fornavn + ' ' + Bruker.etternavn) as brukerNavnSkylder, sum(belop) AS belopSkylder FROM Gjeld
    //INNER JOIN Kostnad ON Gjeld.kostnad_id = Kostnad.kostnad_id
    //INNER JOIN Bruker ON Gjeld.bruker_skylder_id = Bruker.bruker_id
    //WHERE Bruker.bruker_id=9 AND betalt IS NULL
    //GROUP BY (Gjeld.bruker_innkrever_id)) inn,
    //
    //  (SELECT Bruker.bruker_id, Bruker.fornavn, Bruker.etternavn, sum(belop) AS belop FROM Gjeld
    //INNER JOIN Kostnad ON Gjeld.kostnad_id = Kostnad.kostnad_id
    //INNER JOIN Bruker ON Gjeld.bruker_innkrever_id = Bruker.bruker_id
    //WHERE Bruker.bruker_id=9 AND betalt IS NULL
    //GROUP BY (Gjeld.bruker_skylder_id)) ut WHERE bruker_id = 9 AND belalt = null;
  });

};
