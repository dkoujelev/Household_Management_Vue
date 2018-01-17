let server = require("../server");
let connection = require("../connection");
let bcrypt = require('bcrypt');

// Hent en bestemt bruker
server.get('rest/bruker/:bruker_id',function(req, res, next){
  connection.query("SELECT * FROM Bruker WHERE bruker_id=?", [req.params.bruker_id], function(err, rows, fields){
    res.send(err ? err : (rows.length == 1 ? rows[0] : null));
    return next();
  });
});

// Finn bruker med bestemt epost
server.get('rest/bruker/:epost',function(req, res, next){
  connection.query("SELECT * FROM Bruker WHERE epost=?", [req.params.epost], function(err, rows, fields){
    res.send(err ? err : (rows.length == 1 ? rows[0] : null));
    return next();
  });
});

// Legg til bruker
server.post('rest/bruker/',function(req,res,next){
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
  let hash = bcrypt.hashSync(passord,10); //                  Hashing the password 10 times
  req.body.hashed_passord=hash; //                            Re-inserting the hashed value into the request body

  connection.query("INSERT INTO Bruker SET ?", req.body, function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});

// Hent alle brukere
server.get('rest/bruker/',function(req, res, next){
  connection.query("SELECT * FROM Bruker", function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});

// Sjekke om en epost er registrert
server.get('rest/brukerepost/:epost',function(req, res, next){
  console.log('Checking if the email already exists...');
  connection.query("SELECT * FROM Bruker WHERE epost=?", [req.params.epost], function(err, rows, fields){
    console.log('Exists: ' + (rows.length == 1));
    res.send({exists: rows.length == 1});
    return next();
  });
});

// Hent alle brukere i et bestemt kollektiv
server.get('rest/brukereIKollektiv/:kollektiv_id',function(req,res,next){
  connection.query("SELECT Bruker.* FROM Bruker " +
    "INNER JOIN Bruker_Kollektiv ON Bruker.bruker_id = Bruker_Kollektiv.bruker_id " +
    "INNER JOIN Kollektiv ON Bruker_Kollektiv.kollektiv_id = Kollektiv.kollektiv_id " +
    "WHERE Kollektiv.kollektiv_id = ?", req.params.kollektiv_id , function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});

// Oppdater en bruker
server.put('rest/bruker',function(req,res,next){
  connection.query("UPDATE Bruker SET ? WHERE bruker_id=?", [req.body, req.body.bruker_id], function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});

// Login
server.post('rest/login',function(req,res,next){
  connection.query("SELECT hashed_passord FROM Bruker WHERE epost=?", [req.body.epost], function(err, rows, fields){

    if(rows.length >= 1){ //                                  Check if there even is a user with this email
      let passord = [req.body.passord] + ""; //               Load password from request (and force to proper string by adding + "")
      let hashed_passord = rows[0].hashed_passord //          Get the hash returned from DB

      if(bcrypt.compareSync(passord, hashed_passord)) { //    Compare the password to the hash
        // Passwords match
        res.send({passwordMatch: true}); //                   Log in the user... (But for now, just tell the GUI it's all good!)
        return next();
       } else {
        // Passwords don't match
        res.send({passwordMatch: false}); //                  Tell the GUI that the password was no good!
        return next();
       }
    }else{ //                                                 apparently; there was no user with this email
      res.send({passwordMatch: false}); //                    Tell the GUI that the password was no good!
      return next();
    };
  });
});
