let bcrypt = require('bcrypt');
let auth = require('../auth.js');

module.exports = function(connection, server) {

  // Hent en bestemt bruker
  server.get('rest/bruker/:bruker_id', function (req, res, next) {
    connection.query("SELECT * FROM Bruker WHERE bruker_id=?", [req.params.bruker_id], function (err, rows, fields) {
      res.send(err ? err : (rows.length == 1 ? rows[0] : null));
      return next();
    });
  });

// Finn bruker med bestemt epost
  server.get('rest/brukerMedEpost/:epost', function (req, res, next) {

    connection.query("SELECT * FROM Bruker WHERE epost=?", [req.params.epost], function (err, rows, fields) {
      res.send(err ? err : (rows.length == 1 ? rows[0] : null));
      return next();
    });
  });

// Legg til bruker
  server.post('rest/bruker/', function (req, res, next) {

// console.log('---------------------------------------------------------------');
// console.log('Hashing: "p@a55w0rD!"');
// let testPass = 'p@a55w0rD!';
// let testHash = bcrypt.hashSync(testPass,10);
// console.log('Result: ' + testHash);
// console.log('---------------------------------------------------------------');
// console.log('Validating password...');
// if(bcrypt.compareSync(testPass, testHash)) {
//   // Passwords match
//   console.log("MATCH!");
//  } else {
//   // Passwords don't match
//   console.log("FAIL!");
//  }
//  console.log('---------------------------------------------------------------');

    let passord = [req.body.hashed_passord] + ""; //            Get the clear text password from the request body. (The + "" is apparently needed for bcrypt to read the data as a proper string.)
    let hash = bcrypt.hashSync(passord, 10); //                  Hashing the password 10 times
    req.body.hashed_passord = hash; //                            Re-inserting the hashed value into the request body

    connection.query("INSERT INTO Bruker SET ?", req.body, function (err, rows, fields) {

      if(err)
        return next(err);

      res.send(rows);
      return next();
    });
  });

// Hent alle brukere
  server.get('rest/bruker', function (req, res, next) {
    connection.query("SELECT * FROM Bruker ORDER BY bruker_id ASC", function (err, rows, fields) {
      res.send(err ? err : rows);
      return next();
    });
  });

// Sjekke om en epost er registrert
  server.get('rest/brukerepost/:epost', function (req, res, next) {


    connection.query("SELECT * FROM Bruker WHERE epost=?", [req.params.epost], function (err, rows, fields) {
      if(err)
        return next(err);

      res.send({exists: rows.length == 1});
      return next();
    });
  });

// Hent alle brukere i et bestemt kollektiv
  server.get('rest/brukereIKollektiv/:kollektiv_id', function (req, res, next) {
    connection.query("SELECT Bruker.* FROM Bruker " +
      "INNER JOIN Bruker_Kollektiv ON Bruker.bruker_id = Bruker_Kollektiv.bruker_id " +
      "INNER JOIN Kollektiv ON Bruker_Kollektiv.kollektiv_id = Kollektiv.kollektiv_id " +
      "WHERE Kollektiv.kollektiv_id = ?", req.params.kollektiv_id, function (err, rows, fields) {
      res.send(err ? err : rows);
      return next();
    });
  });

// Oppdater en bruker
  server.put('rest/bruker', function (req, res, next) {
    auth.checkThatSessionHasUserId(req,res,next,req.body.bruker_id);

    req.body.hashed_passord = bcrypt.hashSync(req.body.hashed_passord+"", 10);

    connection.query("UPDATE Bruker SET ? WHERE bruker_id=?", [req.body, req.body.bruker_id], function (err, rows, fields) {
      res.send(err ? err : rows);
      return next();
    });
  });

//Check password
  server.post('rest/password', function (req, res, next) {
    connection.query("SELECT * FROM Bruker WHERE epost=?", [req.body.email], function (err, rows, fields) {
      if (err)
        return next(err);
      //  Check if there even is a user with this email
      let password = [req.body.password] + ""; //               Load password from request (and force to proper string by adding + "")
      let hashed_password = rows[0].hashed_passord; //          Get the hash returned from DB

      (bcrypt.compareSync(password, hashed_password) ? res.send({valid: true}) : res.send({valid: false}));

      return next;
    });
  });

//Change password
  server.put('rest/changePassword', function (req, res, next) {
    connection.query('SELECT * FROM Bruker WHERE epost=?',[req.body.email], (err,rows,field) => {
      if(err || rows.length < 1){ res.send({isUpdated: false}); return next(); }

      auth.checkThatSessionHasUserId(req,res,next,rows[0].bruker_id);

      let passord = [req.body.newPassword] + ""; //            Get the clear text password from the request body. (The + "" is apparently needed for bcrypt to read the data as a proper string.)
      let hash = bcrypt.hashSync(passord, 10); //                  Hashing the password 10 times

      let isUpdated = true;
      //Update the password
      /*******INSERT CODE HERE*******/

      connection.query('UPDATE Bruker SET hashed_passord=? WHERE epost=?', [hash, req.body.email], function (err, rows, fields) {
        if (err)
          isUpdated = false;

        //Return
        res.send({updated: isUpdated});
        return next();
      });
    });
  });

  // Fjern bruker
  // NOT USED
  server.del('rest/bruker/:bruker_id', function (req, res, next) {
    connection.query('DELETE FROM Bruker, Bruker_Kollektiv, Bruker_Undergruppe WHERE bruker_id=?', req.params.bruker_id, function (err, rows, fields) {
      if(err)
        return next(err);
      res.send(rows);
      return next();
    });
  });
};
