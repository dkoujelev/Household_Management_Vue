module.exports = function(connection, server) {
  // Hent statistikk over alle kjøpte varer i en undergruppe (NOT USED)
  server.get('rest/statistikkMestKjopteVarerUndergruppe/:undergruppe_id', function (req, res, next) {
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
      'GROUP by (Vare.navn) ORDER BY antall DESC LIMIT ?', [req.params.kollektiv_id, req.body.fra, req.body.til, req.body.antall], function (err, rows, fields) {
      if(err)
        return next(err);
      res.send(rows);
    });
  });
};
