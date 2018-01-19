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
      res.send(err ? err : rows);
      return next();
    });
  });

// Hent alle brukere
  server.get('rest/bruker/', function (req, res, next) {
    connection.query("SELECT * FROM Bruker", function (err, rows, fields) {
      res.send(err ? err : rows);
      return next();
    });
  });

// Sjekke om en epost er registrert
  server.get('rest/brukerepost/:epost', function (req, res, next) {
    console.log('Checking if the email already exists...');
    connection.query("SELECT * FROM Bruker WHERE epost=?", [req.params.epost], function (err, rows, fields) {
      console.log('Exists: ' + (rows.length == 1));
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
    connection.query("UPDATE Bruker SET ? WHERE bruker_id=?", [req.body, req.body.bruker_id], function (err, rows, fields) {
      res.send(err ? err : rows);
      return next();
    });
  });

// Login
  server.post('rest/login', function (req, res, next) {
    console.log("login requested");
    connection.query("SELECT * FROM Bruker WHERE epost=?", [req.body.epost], function (err, rows, fields) {
      console.log("in query");

      if (rows.length == 0) {
        res.send(null);
        return next();
      }

      let user = rows[0];

      if ('sessionId' in req.cookies && req.cookies.sessionId != '') {
        console.log("session cookie found");
        if (auth.hasSession(req.cookies.sessionId)) {
          // User already logged in!
          console.log('user already logged in with sessionId: ' + req.cookies.sessionId);
          res.send(user);
          return next();
        }
        else {
          console.log("session forgotten");
          // User had sessionId cookie but server forgot about it. Kill the cookie.
          res.setCookie('sessionId', '');
        }
      }

      console.log("past if");


      //  Check if there even is a user with this email
      let passord = [req.body.passord] + ""; //               Load password from request (and force to proper string by adding + "")
      let hashed_passord = rows[0].hashed_passord; //          Get the hash returned from DB

      if (bcrypt.compareSync(passord, hashed_passord)) { //    Compare the password to the hash
        // Passwords match

        let session = auth.newSession(req.body);
        console.log('adding session ' + session);
        res.setCookie('sessionId', session);
        res.send(user); //                   Log in the user... (But for now, just tell the GUI it's all good!)
        return next();
      } else {
        // Passwords don't match
        console.log('login denied');
        res.send(null); //                  Tell the GUI that the password was no good!
        return next();
      }
    });
  });

// Check if user is already logged in.
  server.post('rest/loggedIn', function (req, res, next) {

    if ('sessionId' in req.cookies && req.cookies.sessionId != '') {
      if (auth.hasSession(req.cookies.sessionId)) {
        res.send(auth.getSession(req.cookies.sessionId));
        return next();
      }
      else {
        res.setCookie('sessionId', '');
        res.send(null);
        return next();
      }
    }
    else {
      res.send(null);
      return next();
    }


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
    let isUpdated = true;
    //Update the password
    let passord = [req.body.newPassword] + ""; //            Get the clear text password from the request body. (The + "" is apparently needed for bcrypt to read the data as a proper string.)
    let hash = bcrypt.hashSync(passord, 10); //                  Hashing the password 10 times
    req.body.hashed_passord = hash; //                            Re-inserting the hashed value into the request body
    /*******INSERT CODE HERE*******/
    connection.query('UPDATE Bruker SET hashed_passord=? WHERE epost=?', [reeq.body.newPassword, req.body.email], function (err, rows, field) {
      if (err) {
        isUpdated = false;
        return next(err);
      }

      //Return
      res.send({updated: isUpdated});
      return next();
    });
  });

};
